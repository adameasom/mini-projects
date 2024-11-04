import React, { useState } from 'react';
import TaskItem from './TaskItem';

function Column({ status, tasks, addTask, deleteTask }) {
  const [taskTitle, setTaskTitle] = useState('');

  return (
      <div className="column">
        <div className="column-header">
          <h2>{status}</h2>
          {status === 'To Do' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const taskTitle = e.target.elements.taskTitle.value;
                const taskDescription = e.target.elements.taskDescription.value;
                if (taskTitle) {
                  addTask({ title: taskTitle, description: taskDescription });
                  setTaskTitle(''); // Reset the task title
                  e.target.reset();
                }
              }}
            >
              <button className="add-button" type="submit" disabled={!taskTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" strokeWidth={1} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <input
                type="text"
                name="taskTitle"
                placeholder="Task title (Required)"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <input
                type="text"
                name="taskDescription"
                placeholder="Task description"
              />
            </form>
          )}
        </div>
        <div className="tasks-container">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </div>
  );
}

export default Column;
