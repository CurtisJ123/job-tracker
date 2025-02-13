import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Import Login CSS

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setAuth(true); // Update auth state in the parent component
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
