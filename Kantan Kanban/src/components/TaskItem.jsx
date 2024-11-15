import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

function TaskItem({ task, deleteTask, updateTask, status, handleVibration }) {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleDeleteClick = () => {
    setIsConfirmVisible(true); // Show confirmation box
  };

  const handleCancel = () => {
    setIsConfirmVisible(false); // Hide confirmation box
  };

  const handleConfirmDelete = () => {
    deleteTask(task.id, status); // Call delete function
    setIsConfirmVisible(false); // Hide confirmation box after deletion
  };

  const handleEditClick = () => {
    setIsEditing(true);
  }

  const handleSaveEditClick = () => {
    updateTask(task.id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
  }

  const handleCancelEditClick = () => {
    setIsEditing(false);
    setEditedTitle(task.title); // Reset to original title
    setEditedDescription(task.description); // Reset to original description if it exists
  }

  return (
    <>
      {isEditing ? (
        <div className="edit-box">
          <div className="edit-title">
            <input
              className="edit-title-input"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <button className="fake-button my-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16" strokeWidth={1} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
          </div>
          <input
            className="edit-desc-input"
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <div className="edit-buttons-box">
            <div className="edit-save-or-cancel">
              <button className="edit-save my-text-button" onClick={() => { handleSaveEditClick(); handleVibration(50); }}>Save</button>
              <button className="edit-cancel my-text-button" onClick={() => { handleCancelEditClick(); handleVibration(20); }}>Cancel</button>
            </div>
            <button className="fake-button my-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16" strokeWidth={1} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="title-box">
            <h3 className="task-title">{task.title}</h3>
            <button
              className="edit-button my-button"
              onClick={() => { handleEditClick(); handleVibration(20); }}
              data-tooltip-id={`my-edit-${task.id}`}
              data-tooltip-content="Edit Task"
              data-tooltip-place="top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16" strokeWidth={1} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
            <Tooltip id={`my-edit-${task.id}`} className="custom-tooltip" />
          </div>
          <p className="task-description">{task.description}</p>
          <div className="task-footer">
            <span className={`date-created ${isConfirmVisible ? 'fade' : ''}`}>created at {task.dateCreated}</span>
            <button
              className="delete-button my-button"
              onClick={() => { handleDeleteClick(); handleVibration(20); }}
              data-tooltip-id={`my-delete-${task.id}`}
              data-tooltip-content="Delete Task"
              data-tooltip-place="top-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16" strokeWidth={1} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            <Tooltip id={`my-delete-${task.id}`} className="custom-tooltip" />
            <div className={`confirmation-box ${isConfirmVisible ? 'show' : ''}`}>
              <button className="confirm-delete my-text-button" onClick={() => { handleConfirmDelete(); handleVibration(150); }}>Delete</button>
              <button className="confirm-cancel my-text-button" onClick={() => { handleCancel(); handleVibration(20); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskItem;
