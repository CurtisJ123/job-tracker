// Load environment variables
require('dotenv').config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (plugins that add functionality)
app.use(cors()); // Allows frontend to access API
app.use(express.json()); // Allows parsing of JSON requests

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Test database connection
app.get("/test-db", async (req, res) => {
    try {
      const result = await pool.query("SELECT NOW()");
      res.send(`Database connected! Current time: ${result.rows[0].now}`);
    } catch (err) {
      console.error("Database connection error:", err);
      res.status(500).send("Database connection error");
    }
  });
// Add a new job
app.post("/jobs", async (req, res) => {
  const { title, company, status } = req.body;

  if (!title || !company || !status) {
    return res.status(400).json({ error: "Please provide title, company, and status" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO jobs (title, company, status) VALUES ($1, $2, $3) RETURNING *",
      [title, company, status]
    );
    res.status(201).json(result.rows[0]); // Respond with the newly added job
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
// Get all jobs
app.get("/jobs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
// Update a job
app.put("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, company, status } = req.body;

  if (!title || !company || !status) {
    return res.status(400).json({ error: "Please provide title, company, and status" });
  }

  try {
    const result = await pool.query(
      "UPDATE jobs SET title=$1, company=$2, status=$3 WHERE id=$4 RETURNING *",
      [title, company, status, id]
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

// Delete a job
app.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM jobs WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

