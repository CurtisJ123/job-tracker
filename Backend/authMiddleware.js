// Import necessary modules
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware function to authenticate requests
const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user information to the request object
    req.user = decoded;
    // Call the next middleware function in the stack
    next();
  } catch (err) {
    // Log the error and return a 400 Bad Request response if the token is invalid
    console.error(err);
    res.status(400).json({ error: "Invalid token." });
  }
};

// Export the middleware function
module.exports = authMiddleware;
