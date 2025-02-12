import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const JobList = ({ backendUrl }) => {
  const [jobs, setJobs] = useState([]); // Stores the job list
  const [newJob, setNewJob] = useState({ title: "", company: "", status: "applied" });
  const [editingJob, setEditingJob] = useState(null);
  const [addingJob, setAddingJob] = useState(false);
  const [formData, setFormData] = useState({ title: "", company: "", status: "" });

  useEffect(() => {
    axios
      .get(`${backendUrl}/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, [backendUrl]);

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${backendUrl}/jobs/`, newJob, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setJobs([...jobs, response.data]); // Update UI with new job
        setNewJob({ title: "", company: "", status: "applied" }); // Clear form
        setAddingJob(false); // Close modal
      })
      .catch((error) => console.error("Error adding job:", error));
  };

  const handleDelete = (id) => {
    // Show a confirmation dialog
    const confirmDeletion = window.confirm("Are you sure you want to delete this job?");

    if (confirmDeletion) {
      // If the user confirms, proceed with deletion
      axios
        .delete(`${backendUrl}/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
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
    console.log(`Updating job with ID: ${editingJob}`); // Log job ID
    axios
      .put(`${backendUrl}/jobs/${editingJob}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setJobs(jobs.map((job) => (job.id === editingJob ? response.data : job))); // Update UI
        setEditingJob(null); // Exit edit mode
      })
      .catch((error) => console.error("Error updating job:", error));
  };

  const filteredJobs = {
    applied: jobs.filter((job) => job.status === "applied"),
    interview: jobs.filter((job) => job.status === "interview"),
    offer: jobs.filter((job) => job.status === "offer"),
  };

  return (
    <>
      <div className={editingJob || addingJob ? "blur" : ""}>
        <div className="job-columns">
          {["applied", "interview", "offer"].map((status) => (
            <div key={status} className={`job-column ${status}`}>
              <div className="job-column-header">
                <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                {status === "applied" && (
                  <button onClick={() => setAddingJob(true)} className="add-job-button">
                    Add Job
                  </button>
                )}
              </div>
              <ul>
                {filteredJobs[status].map((job) => (
                  <li key={job.id}>
                    <div>
                      <strong>{job.title}</strong> at {job.company}
                    </div>
                    <div>
                      <button onClick={() => handleEdit(job)}>Edit</button>
                      <button onClick={() => handleDelete(job.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {addingJob && (
        <>
          <div className="modal-overlay" onClick={() => setAddingJob(false)}></div>
          <div className="modal">
            <h3>Add Job</h3>
            <form onSubmit={handleSubmit} className="job-form">
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={newJob.title}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={newJob.company}
                onChange={handleChange}
                required
              />
              <select name="status" value={newJob.status} onChange={handleChange}>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <button type="submit">Add Job</button>
              <button type="button" onClick={() => setAddingJob(false)}>Cancel</button>
            </form>
          </div>
        </>
      )}

      {editingJob && (
        <>
          <div className="modal-overlay" onClick={() => setEditingJob(null)}></div>
          <div className="modal">
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
              <option value="applied">Applied</option>
              <option value="interview">Interviewing</option>
              <option value="offer">Offer Received</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setEditingJob(null)}>Cancel</button>
          </div>
        </>
      )}
    </>
  );
};

export default JobList;
