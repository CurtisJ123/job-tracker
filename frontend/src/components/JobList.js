import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const job = jobs.find((job) => job.id.toString() === draggableId);
    if (job) {
      if (destination.droppableId === "trashcan") {
        const confirmRejection = window.confirm("Are you sure you want to reject this job?");
        if (!confirmRejection) {
          return;
        }
        job.status = "rejected";
      } else {
        job.status = destination.droppableId;
      }
      axios
        .put(`${backendUrl}/jobs/${draggableId}`, job, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setJobs((prevJobs) => prevJobs.map((j) => (j.id.toString() === draggableId ? response.data : j)));
        })
        .catch((error) => console.error("Error updating job:", error));
    }
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 16,
    margin: `0 0 8px 0`,
    borderRadius: 5,
    background: isDragging ? "#e0e1dd" : "#f4f4f4",
    boxShadow: isDragging ? "0 0 10px rgba(0, 0, 0, 0.2)" : "0 0 5px rgba(0, 0, 0, 0.1)",
    ...draggableStyle,
    transform: isDragging ? draggableStyle.transform : undefined,
  });

  const handleExport = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jobs.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={editingJob || addingJob ? "blur" : ""}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="job-columns">
            {["applied", "interview", "offer"].map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    className={`job-column ${status}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="job-column-header">
                      <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                      {status === "applied" && (
                        <button onClick={() => setAddingJob(true)} className="add-job-button">
                          Add Job
                        </button>
                      )}
                    </div>
                    <ul>
                      {jobs
                        .filter((job) => job.status === status)
                        .map((job, index) => (
                          <Draggable draggableId={job.id.toString()} index={index} key={job.id}>
                            {(provided, snapshot) => (
                              <JobCard
                                job={job}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              />
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            ))}
            <Droppable droppableId="trashcan">
              {(provided) => (
                <div
                  className="trashcan"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <span>🗑️ Rejected</span>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>

      <button onClick={handleExport} className="export-button">Export Jobs</button>

      {addingJob && (
        <JobAdd backendUrl={backendUrl} setJobs={setJobs} setAddingJob={setAddingJob} />
      )}

      {editingJob && (
        <JobEdit backendUrl={backendUrl} job={editingJob} setJobs={setJobs} setEditingJob={setEditingJob} />
      )}
    </>
  );
};

export default JobList;
