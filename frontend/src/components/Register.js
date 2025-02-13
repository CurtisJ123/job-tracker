import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Reuse Login CSS for Register

const Register = ({ setShowRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      await axios.post(`${backendUrl}/auth/register`, {
        username,
        email,
        password,
      });
      setShowRegister(false); // Navigate back to login form
    } catch (err) {
      setError("Error registering user");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <button type="button" onClick={() => setShowRegister(false)}>Back to Login</button>
      </form>
    </div>
  );
};

export default Register;
