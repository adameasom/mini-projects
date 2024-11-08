// App.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './components/Column';
import './App.css';

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

  const addTask = ({ title, description }) => {
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
      status: 'To Do',
      dateCreated: formattedDateTime, // Use the formatted date and time
    };
    setTasks((prevTasks) => ({
      ...prevTasks,
      'To Do': [newTask, ...prevTasks['To Do']],
    }));
    setTaskIdCounter((prevId) => prevId + 1); // Increment counter
  };

  const deleteTask = (id, status) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [status]: prevTasks[status].filter((task) => task.id !== id),
    }));
  };

  // Handle drag-and-drop events
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return; // Exit if dropped outside or in the same position
    }

    setTasks((prevTasks) => {
      const sourceTasks = Array.from(prevTasks[source.droppableId]);
      const destinationTasks = source.droppableId === destination.droppableId ? sourceTasks : Array.from(prevTasks[destination.droppableId]);
      const [movedTask] = sourceTasks.splice(source.index, 1); // Remove from source

      destinationTasks.splice(destination.index, 0, movedTask); // Insert into destination

      // Return updated task columns
      return {
        ...prevTasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <h1 className="app-header">KANTAN KANBAN</h1>
        <div className="columns-container">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="column"
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
