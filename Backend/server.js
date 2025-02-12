// server.js

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const authRoutes = require("./auth"); // Import auth.js
const authMiddleware = require("./authMiddleware"); // Import authMiddleware

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow frontend to access API
app.use(express.json()); // Parse JSON requests

// Log environment variables for debugging
console.log("Connection_String:", process.env.Connection_String);

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.Connection_String,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Basic API route
app.get("/", (req, res) => {
  res.send("Job Tracker API is running!");
});

// Authentication routes
app.use("/auth", authRoutes); // Use authentication routes

// Job CRUD operations (protected by authMiddleware)
app.post("/jobs", authMiddleware, async (req, res) => {
  const { title, company, status } = req.body;
  const user_id = req.user.userId; // Get user ID from authMiddleware
  console.log("User ID in POST /jobs:", user_id); // Log user ID

  if (!title || !company || !status) {
    return res.status(400).json({ error: "Please provide title, company, and status" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO jobs (title, company, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, company, status, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all jobs (protected by authMiddleware)
app.get("/jobs", authMiddleware, async (req, res) => {
  const user_id = req.user.userId; // Get user ID from authMiddleware

  try {
    const result = await pool.query("SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC", [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a job (protected by authMiddleware)
app.put("/jobs/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, company, status } = req.body;
  const user_id = req.user.userId; // Get user ID from authMiddleware
  console.log(`Updating job with ID: ${id} for user ID: ${user_id}`); // Log job ID and user ID

  if (!title || !company || !status) {
    return res.status(400).json({ error: "Please provide title, company, and status" });
  }

  try {
    const result = await pool.query(
      "UPDATE jobs SET title=$1, company=$2, status=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
      [title, company, status, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(result.rows[0]); // Return updated job
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a job (protected by authMiddleware)
app.delete("/jobs/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId; // Get user ID from authMiddleware

  try {
    const result = await pool.query("DELETE FROM jobs WHERE id=$1 AND user_id=$2 RETURNING *", [id, user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test DB connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database connected! Current time: ${result.rows[0].now}`);
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).send("Database connection error");
  }
});
