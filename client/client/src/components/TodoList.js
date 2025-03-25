import React, { useEffect, useState } from "react";
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

  return (
    <>
      <ul>
        {todos.map((todo) => (
          <li key={todo.item_id}>
            <div>
              <p><strong>{todo.title}</strong></p>
            </div>
            <div>
              {todo.content}
            </div>
            <div>
              <button onClick={() => deleteTodo(todo.item_id)}>Delete</button>
              <EditTodo todo={todo} fetchTodos={fetchTodos}/>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default TodoList;