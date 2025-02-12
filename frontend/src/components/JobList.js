import React, { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "./JobCard"; // Import JobCard component
import JobAdd from "./JobAdd"; // Import JobAdd component
import JobEdit from "./JobEdit"; // Import JobEdit component
import "../styles/JobList.css"; // Import JobList CSS

const JobList = ({ backendUrl }) => {
  const [jobs, setJobs] = useState([]); // Stores the job list
  const [editingJob, setEditingJob] = useState(null);
  const [addingJob, setAddingJob] = useState(false);

  useEffect(() => {
    axios
      .get(`${backendUrl}/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, [backendUrl]);

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
    setEditingJob(job); // Store the job being edited
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
                {
                  jobs.filter((job) => job.status === status).map((job) => (
                    <JobCard key={job.id} job={job} onEdit={handleEdit} onDelete={handleDelete} />
                  ))
                }
              </ul>
            </div>
          ))}
        </div>
      </div>

      {addingJob && (
        <>
          <div className="modal-overlay" onClick={() => setAddingJob(false)}></div>
          <JobAdd backendUrl={backendUrl} setJobs={setJobs} setAddingJob={setAddingJob} />
        </>
      )}

      {editingJob && (
        <>
          <div className="modal-overlay" onClick={() => setEditingJob(null)}></div>
          <JobEdit backendUrl={backendUrl} job={editingJob} setJobs={setJobs} setEditingJob={setEditingJob} />
        </>
      )}
    </>
  );
};

export default JobList;
