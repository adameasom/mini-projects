import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function TaskItem({ task, index, deleteTask }) {
  return (
    <Draggable draggableId={`${task.id}`} index={index}>
      {(provided) => (
        <div
          className="task-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span>{task.content}</span>
          <button onClick={() => deleteTask(task.id)}>X</button>
        </div>
      )}
    </Draggable>
  );
}

export default TaskItem;
