import React, { useEffect, useState } from "react";
//import edit todo

const TodoList = () => {
  //set the state for the todos array
  const [todos, setTodos] = useState([]);

  //delete todo function
  const deleteTodo = async (id) => {
    try {
      //fetch the todos/id to delete using the method delete
      //set todos to filter to where the todo id is not equal to id
      const deletedTodo = await fetch(`http://localhost:5001/todos/${id}`, {
        method: "DELETE"
      });
      setTodos(todos.filter((item) => item.item_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  }

  //get all todos function (REMEMBER TO AWAIT)
  const getTodos = async () => {
    try {
      const response = await fetch('http://localhost:5001/todos')
      const jsonData = await response.json()
      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  }

  //automatically get todos using "effect"
  useEffect(() => {
    getTodos();
  }, []);

  //at every page load get all the todos

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
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default TodoList;