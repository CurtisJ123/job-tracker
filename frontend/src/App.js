import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import Login from "./components/Login";
import Register from "./components/Register"; // Import Register component
import ForgotPassword from "./components/ForgotPassword"; // Import ForgotPassword component
import ResetPassword from "./components/ResetPassword"; // Import ResetPassword component
import JobList from "./components/JobList"; // Import JobList component
import "./styles/App.css"; // Import App CSS

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token")); // Check if user is logged in
  const [showRegister, setShowRegister] = useState(false); // State to toggle between login and register forms
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to toggle between login and forgot password forms
  const [showResetPassword, setShowResetPassword] = useState(false); // State to toggle between login and reset password forms

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch (e) {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    setAuth(null); // Update UI to show login form again
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setShowResetPassword(true);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Tracker</h1>
        {auth && <button onClick={handleLogout}>Logout</button>}
      </header>
      <div className="App-content">
        {!auth ? (
          showRegister ? (
            <Register setShowRegister={setShowRegister} />
          ) : showForgotPassword ? (
            <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
          ) : showResetPassword ? (
            <ResetPassword setShowResetPassword={setShowResetPassword} />
          ) : (
            <Login setAuth={setAuth} setShowRegister={setShowRegister} setShowForgotPassword={setShowForgotPassword} />
          )
        ) : (
          <div>
            <JobList backendUrl={process.env.REACT_APP_BACKEND_URL} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
