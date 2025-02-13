import React, { useState } from "react";
import axios from "axios";

const JobAdd = ({ backendUrl, setJobs, setAddingJob }) => {
  const [newJob, setNewJob] = useState({ title: "", company: "", status: "applied" });

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
        setJobs((prevJobs) => [...prevJobs, response.data]);
        setNewJob({ title: "", company: "", status: "applied" });
        setAddingJob(false);
      })
      .catch((error) => console.error("Error adding job:", error));
  };

  return (
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
          <button type="submit">Add Job</button>
          <button type="button" onClick={() => setAddingJob(false)}>Cancel</button>
        </form>
      </div>
    </>
  );
};

export default JobAdd;
