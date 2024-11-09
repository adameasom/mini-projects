// App.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './components/Column';
import './App.css';
import './Custom-tooltip-styles.css';

function App() {
  // Load initial state from local storage or set default values
  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    return storedTasks || { 'To Do': [], 'In Progress': [], 'Done': [] };
  });

  const [taskIdCounter, setTaskIdCounter] = useState(() => Number(localStorage.getItem('taskIdCounter')) || 1);

  // Save tasks and counter to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskIdCounter', taskIdCounter);
  }, [tasks, taskIdCounter]);

  const addTask = ({ title, description, status }) => {
    const now = new Date();
    // Get the components for the formatted date and time
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const optionsDate = { day: '2-digit', month: 'short', year: 'numeric' };

    // Format time and date separately
    const formattedTime = now.toLocaleTimeString('en-GB', optionsTime);
    const formattedDate = now.toLocaleDateString('en-GB', optionsDate);

    // Combine them into the desired format
    const formattedDateTime = `${formattedTime} on ${formattedDate}`;

    const newTask = {
      id: taskIdCounter,
      title,
      description,
      status,
      dateCreated: formattedDateTime, // Use the formatted date and time
    };
    setTasks((prevTasks) => ({
      ...prevTasks,
      [status]: [newTask, ...prevTasks[status]],
    }));
    setTaskIdCounter((prevId) => prevId + 1); // Increment counter
  };

  const deleteTask = (id, status) => {
    // Add a class to trigger animation
    setTasks((prevTasks) => ({
      ...prevTasks,
      [status]: prevTasks[status].map((task) =>
        task.id === id ? { ...task, removing: true } : task
      ),
    }));
  
    // After the animation delay, remove the task
    setTimeout(() => {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: prevTasks[status].filter((task) => task.id !== id),
      }));
    }, 500); // Adjust delay to match animation duration
  };

  // Handle drag-and-drop events
  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    // If the task was dropped outside or in the same position, do nothing
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
  
    // Handle moving the task between columns
    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;
  
    // Copy the tasks from the source and destination columns
    const sourceTasks = Array.from(tasks[sourceColumn]);
    const destinationTasks = Array.from(tasks[destinationColumn]);
  
    // Remove the task from the source column
    const [movedTask] = sourceTasks.splice(source.index, 1);
  
    // Update the task's status to reflect the new column
    movedTask.status = destinationColumn;
  
    // Add the task to the destination column at the new position
    destinationTasks.splice(destination.index, 0, movedTask);
  
    // Update the state with the new task positions and statuses
    setTasks((prevTasks) => ({
      ...prevTasks,
      [sourceColumn]: sourceTasks,
      [destinationColumn]: destinationTasks,
    }));
  };
  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <h1 className="app-header">Kantan Kanban</h1>
        <div className="columns-container">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`column ${status.toLowerCase().replace(' ', '-')}`}
                >
                  <Column
                    status={status}
                    tasks={tasks[status]}
                    addTask={addTask}
                    deleteTask={deleteTask}
                  />
                  <div>
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
