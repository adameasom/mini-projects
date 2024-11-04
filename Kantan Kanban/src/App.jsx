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

  const addTask = (content) => {
    const newTask = {
      id: taskIdCounter,
      content,
      status: 'To Do',
    };
    setTasks([...tasks, newTask]);
    setTaskIdCounter(taskIdCounter + 1); // Increment Counter
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="App">
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
