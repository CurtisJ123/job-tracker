import React, { forwardRef } from "react";
import "../styles/JobCard.css"; // Import JobCard CSS

const JobCard = forwardRef(({ job, onEdit, onDelete, style, index, ...props }, ref) => {
  return (
    <li className="job-card" ref={ref} {...props} style={style}>
      <div className="job-details">
        <strong>{job.title}</strong> at {job.company}
      </div>
      <div className="job-actions">
        <button className="edit-button" onClick={() => onEdit(job)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(job.id)}>Delete</button>
      </div>
    </li>
  );
});

export default JobCard;
