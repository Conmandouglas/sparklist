import React from "react";
import EditTodo from "./EditTodo.js";

const TodoList = ({ todos, fetchTodos, lists, colorMap, isLightMode }) => {
  // Delete todo function
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5001/todos/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTextColor = (todo) => {
    const color = todo.color;
    if (!isLightMode) {
      return "white"; // Dark mode text color
    }
    return "black"; // Light mode text color
  };

  const togglePin = async (id) => {
    try {
      await fetch(`http://localhost:5001/todos/${id}/pin`, { method: "PUT" });
      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const getHexColor = (todo) => {
    const color = todo.color;
    if (color) {
      if (isLightMode) {
        return colorMap[color]?.light ?? "#ffffce"; // Default light color
      } else {
        return colorMap[color]?.dark ?? "#ffffff"; // Default dark color
      }
    }
    return isLightMode ? "#ffffce" : "#ffffff"; // Return a default color if no color is set
  };

  const getReadableTime = (remind_at) => {
    if (!remind_at) {
      return null; // Return null if no reminder is set
    }
    const date = new Date(remind_at);
    if (isNaN(date)) {
      return "Invalid date"; // In case the date is invalid
    }
    
    // Check if the reminder has passed
    const now = new Date();
    const isPast = date < now;
    
    if (isPast) {
      return `Reminded at: ${date.toLocaleString()}`; // Reminder has passed
    }
    return `Reminder At: ${date.toLocaleString()}`; // Reminder is still upcoming
  };

  return (
    <ul className="container-xl">
      {todos.map((todo) => (
        <li
          className="todo-item my-3"
          style={{
            backgroundColor: getHexColor(todo),
            color: getTextColor(todo),
          }}
          key={todo.item_id}
        >
          <div>
            <p>
              <strong>{todo.title}</strong>
              <p>{todo.importance}</p>
            </p>
          </div>
          <div>{todo.content}</div>
          <div className="mt-2">
            <button
              className="btn btn-success delete-button me- p-1 px-2"
              onClick={() => deleteTodo(todo.item_id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-check-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
            </button>
            <EditTodo todo={todo} fetchTodos={fetchTodos} lists={lists} />
            <button
              className={`btn ${todo.pinned ? "btn-warning" : "btn-outline-secondary"} me-2 p-1 px-2`}
              onClick={() => togglePin(todo.item_id)}
            >
              📌
            </button>
            {todo.remind_at && (
              <p className="m-0">{getReadableTime(todo.remind_at)}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
