import React from "react";
import EditTodo from "./EditTodo.js";
//import edit todo

const TodoList = ({ todos, fetchTodos }) => {
  //delete todo function
  const deleteTodo = async (id) => {
    try {
      //fetch the todos/id to delete using the method delete
      //set todos to filter to where the todo id is not equal to id
      await fetch(`http://localhost:5001/todos/${id}`, {
        method: "DELETE"
      });
      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  }

  const togglePin = async (id) => {
    try {
      await fetch(`http://localhost:5001/todos/${id}/pin`, { method: "PUT" });
      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <ul className="container-xl">
        {todos.map((todo) => (
          <li
            className="todo-item my-3"
            style={{ backgroundColor: todo.color ? todo.color : "#ffffce" }}
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
                className="btn btn-danger delete-button me-2 p-1 px-2"
                onClick={() => deleteTodo(todo.item_id)}
              >
                Delete
              </button>
              <EditTodo todo={todo} fetchTodos={fetchTodos} />
              <button
                className={`btn ${
                  todo.pinned ? "btn-warning" : "btn-outline-secondary"
                } me-2 p-1 px-2`}
                onClick={() => togglePin(todo.item_id)}
              >
                📌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TodoList;