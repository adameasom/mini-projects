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
    handleVibration(50); // Vibration to indicate successfully adding a task
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

  // Edit existing task
  const updateTask = (id, updatedFields) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      Object.keys(updatedTasks).forEach((status) => {
        updatedTasks[status] = updatedTasks[status].map((task) =>
          task.id === id ? { ...task, ...updatedFields } : task
        );
      });
      return updatedTasks;
    });
  };
  
  // Vibration on drag start
  const onDragStart = () => {
    handleVibration(20); // Short vibration to signal the start of dragging
  };

  // Handle drag-and-drop events
  const onDragEnd = (result) => {
    handleVibration(50); // Longer vibration to indicate drop action
    const { source, destination } = result;
  
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return; // Exit if dropped outside or in the same position
    }
  
    setTasks((prevTasks) => {
      // Clone the tasks arrays from the source and destination columns
      const sourceTasks = Array.from(prevTasks[source.droppableId]);
      const destinationTasks = source.droppableId === destination.droppableId ? sourceTasks : Array.from(prevTasks[destination.droppableId]);
      
      // Remove the task from the source column
      const [movedTask] = sourceTasks.splice(source.index, 1);
      
      // Update the status of the moved task to match the destination column
      movedTask.status = destination.droppableId;
  
      // Insert the task into the new position in the destination column
      destinationTasks.splice(destination.index, 0, movedTask);
  
      // Return updated state with modified columns
      return {
        ...prevTasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      };
    });
  };

  const onDragUpdate = (update) => {
    const { destination } = update;
    if (!destination) return;

    const destinationTasksContainer = document.getElementById(`${destination.droppableId}-tasks-container`);

    if (destinationTasksContainer) {
      const { scrollTop, clientHeight, scrollHeight } = destinationTasksContainer;
      const scrollThreshold = 50; // Threshold to trigger scrolling
      const scrollSpeed = 5; // Speed of scrolling

      if (scrollTop < scrollThreshold) {
        destinationTasksContainer.scrollTop -= scrollSpeed; // Scroll up
      } else if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
        destinationTasksContainer.scrollTop += scrollSpeed; // Scroll down
      }
    }
  };

  const handleVibration = (duration = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="app-container">
        <h1 className="app-header">Kantan Kanban</h1>
        <div className="columns-container">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks[status]}
              addTask={addTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              handleVibration={handleVibration}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
