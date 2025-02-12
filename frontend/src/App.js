import React, { useState } from "react";
import Login from "./login";
import JobList from "./JobList"; // Import JobList component
import "./App.css";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token")); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    setAuth(null); // Update UI to show login form again
  };

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
