
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [jobs, setJobs] = useState([]); // Stores the job list
  const [newJob, setNewJob] = useState({ title: "", company: "", status: "applied" });
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({ title: "", company: "", status: "" });
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  console.log("This is the backendURL " + backendUrl);
  useEffect(() => {
    // Fetch jobs from the backend
    axios
      .get(`${backendUrl}`) // Replace with your actual backend URL
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, [backendUrl]);

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(backendUrl, newJob) // Send new job to backend
      .then((response) => {
        setJobs([...jobs, response.data]); // Update UI with new job
        setNewJob({ title: "", company: "", status: "applied" }); // Clear form
      })
      .catch((error) => console.error("Error adding job:", error));
  };

  const handleDelete = (id) => {
    // Show a confirmation dialog
    const confirmDeletion = window.confirm("Are you sure you want to delete this job?");
    
    if (confirmDeletion) {
      // If the user confirms, proceed with deletion
      axios
        .delete(`${backendUrl}${id}`)
        .then(() => {
          // Update the UI by filtering out the deleted job
          setJobs(jobs.filter((job) => job.id !== id));
        })
        .catch((error) => console.error("Error deleting job:", error));
    }
  };
  const handleEdit = (job) => {
    setEditingJob(job.id); // Store the job ID being edited
    setFormData({ title: job.title, company: job.company, status: job.status });
  };
  const handleUpdate = () => {
    axios
      .put(`${backendUrl}${editingJob}`, formData)
      .then((response) => {
        setJobs(jobs.map((job) => (job.id === editingJob ? response.data : job))); // Update UI
        setEditingJob(null); // Exit edit mode
      })
      .catch((error) => console.error("Error updating job:", error));
  };
  

  return (
    <div className="App">
      <h1>Job Tracker</h1>

      {/* Job Submission Form */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Job Title" value={newJob.title} onChange={handleChange} required />
        <input type="text" name="company" placeholder="Company" value={newJob.company} onChange={handleChange} required />
        <select name="status" value={newJob.status} onChange={handleChange}>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit">Add Job</button>
      </form>

      {/* Job List */}
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.title} at {job.company} - Status: {job.status}
            <button onClick={() => handleEdit(job)}>Edit</button>
            <button onClick={() => handleDelete(job.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingJob && (
        <div>
          <h3>Edit Job</h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer Received">Offer Received</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditingJob(null)}>Cancel</button>
        </div>
      )}
    </div>
    
  );
  
}

export default App;
      