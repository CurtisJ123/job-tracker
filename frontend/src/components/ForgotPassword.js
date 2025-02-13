import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Reuse Login CSS for Forgot Password

const ForgotPassword = ({ setShowForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    try {
      await axios.post(`${backendUrl}/auth/forgot-password`, { email });
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError("Error sending password reset link.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleForgotPassword}>
        <h2>Forgot Password</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
        <button type="button" onClick={() => setShowForgotPassword(false)}>Back to Login</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
