import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; // Import jwt-decode library
import Login from "./components/login";
import JobList from "./components/JobList"; // Import JobList component
import "./styles/App.css"; // Import App CSS

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token")); // Check if user is logged in

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Tracker</h1>
        {auth && <button onClick={handleLogout}>Logout</button>}
      </header>
      <div className="App-content">
        {!auth ? (
          <Login setAuth={setAuth} />
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
