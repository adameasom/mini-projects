import React from 'react';

function TaskItem({ task, index, deleteTask }) {
  return (
    <>
      <div
        className="task-item"
      >
        <span>{task.content}</span>
        <button onClick={() => deleteTask(task.id)}>X</button>
      </div>
    </>
  );
}

export default TaskItem;
