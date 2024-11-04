import React from 'react';
import TaskItem from './TaskItem';

function Column({ status, tasks, addTask, deleteTask }) {
  return (
    <>
      <div
        className="column"
      >
        <h2>{status}</h2>
        {status === 'To Do' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const taskContent = e.target.elements.taskInput.value;
              if (taskContent) addTask(taskContent);
              e.target.reset();
            }}
          >
            <button type="submit">+</button>
            <input type="text" name="taskInput" placeholder="Add a task" />
          </form>
        )}
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </>
  );
}

export default Column;
