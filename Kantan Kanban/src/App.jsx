// App.jsx
import React, { useState, useEffect } from 'react';
import Column from './components/Column';
import './App.css';

function App() {
  // Load initial state from local storage or set default values
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
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
    
    setTasks([...tasks, newTask]);
    setTaskIdCounter(taskIdCounter + 1); // Increment Counter
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="app-container">
      <h1 className="app-header">KANTAN KANBAN</h1>
      <div className="columns-container">
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            addTask={addTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
