import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Tooltip } from 'react-tooltip';
import TaskItem from './TaskItem';

function Column({ status, tasks, addTask, deleteTask, updateTask }) {
  const [taskTitle, setTaskTitle] = useState('');

  return (
    <div className={`column ${status.toLowerCase().replace(' ', '-')}`}>
      <div className="column-header">
        <h2>{status}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const taskTitle = e.target.elements.taskTitle.value;
            const taskDescription = e.target.elements.taskDescription.value;
            if (taskTitle) {
              addTask({ title: taskTitle, description: taskDescription, status });
              setTaskTitle(''); // Reset the task title
              e.target.reset();
            }
          }}
        >
          <button
            className="add-button"
            type="submit"
            disabled={!taskTitle}
            data-tooltip-id="my-add"
            data-tooltip-content="Add Task"
            data-tooltip-place="top">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" strokeWidth={1} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <Tooltip id="my-add" className="custom-tooltip" />
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
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            id={`${status}-tasks-container`}
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="tasks-container"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`task-item ${task.status.toLowerCase().replace(' ', '-')} ${snapshot.isDragging ? "dragging" : ""} ${task.removing ? 'removing' : ''}`}
                  >
                    <TaskItem task={task} deleteTask={deleteTask} updateTask={updateTask} status={status} />
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
