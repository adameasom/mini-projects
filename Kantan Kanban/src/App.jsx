// App.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './components/Column';
import { Tooltip } from 'react-tooltip';
import './App.css';
import './Custom-tooltip-styles.css';

function App() {
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load initial state from local storage or set default values
  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    return storedTasks || { 'To Do': [], 'In Progress': [], 'Done': [] };
  });
  
  const [taskIdCounter, setTaskIdCounter] = useState(() => Number(localStorage.getItem('taskIdCounter')) || 1);

  // Save users theme to local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", newMode);
  };

  // Save tasks and counter to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskIdCounter', taskIdCounter);
  }, [tasks, taskIdCounter]);

  const handleVibration = (duration = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

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

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">Kantan Kanban</h1>
          <button
          className="light-or-dark-button"
            onClick={toggleDarkMode}
            data-tooltip-id="my-mode"
            data-tooltip-content={isDarkMode ? "Light Mode" : "Dark Mode"}
            data-tooltip-place="left"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ?
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="sun-icon">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>
            
             : 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="moon-icon">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg>
           }
          </button>
          <Tooltip id="my-mode" className="custom-tooltip" border="1px solid var(--tooltip-border)" />
        </div>
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
