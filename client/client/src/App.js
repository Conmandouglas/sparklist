import './App.css';
import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput.js';
import TodoList from './components/TodoList.js';

function App() {
  const [todos, setTodos] = useState([]);

  // Fetch todos when the app loads
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5001/todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container">
      <TodoInput fetchTodos={fetchTodos} />
      <TodoList todos={todos} fetchTodos={fetchTodos} />
    </div>
  );
}

export default App;
