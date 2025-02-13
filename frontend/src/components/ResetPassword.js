import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Reuse Login CSS for Reset Password

const ResetPassword = ({ setShowResetPassword }) => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    try {
      await axios.post(`${backendUrl}/auth/reset-password`, { token, newPassword });
      setMessage("Password reset successful. You can now log in with your new password.");
    } catch (err) {
      setError("Error resetting password.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleResetPassword}>
        <h2>Reset Password</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        <button type="button" onClick={() => setShowResetPassword(false)}>Back to Login</button>
      </form>
    </div>
  );
};

export default ResetPassword;
