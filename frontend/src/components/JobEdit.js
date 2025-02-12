import React, { useState, useEffect } from "react";
import axios from "axios";

const JobEdit = ({ backendUrl, job, setJobs, setEditingJob }) => {
  const [formData, setFormData] = useState({ title: "", company: "", status: "" });

  useEffect(() => {
    if (job) {
      setFormData({ title: job.title, company: job.company, status: job.status });
    }
  }, [job]);

  const handleUpdate = () => {
    axios
      .put(`${backendUrl}/jobs/${job.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setJobs((prevJobs) => prevJobs.map((j) => (j.id === job.id ? response.data : j)));
        setEditingJob(null);
      })
      .catch((error) => console.error("Error updating job:", error));
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => setEditingJob(null)}></div>
      <div className="modal">
        <form onSubmit={handleUpdate} className="job-form">
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
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingJob(null)}>Cancel</button>
        </form>
      </div>
    </>
  );
};

export default JobEdit;
