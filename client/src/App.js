import './App.css';
import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput.js';
import TodoList from './components/TodoList.js';
import Heading from "./components/Heading.js"

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });

  // Fetch todos when the app loads
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:5001/todos");
      const data = await response.json();
      console.log("Fetched data:", data); // 🔥 Debugging line
      setTodos(data); // Make sure it's an array
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  };
  
  

  const handleSubmit = async (title, content) => {
    try {
      const body = { title, content };
      await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container">
      <Heading />
      <TodoInput
        fetchTodos={fetchTodos}
        onSubmit={handleSubmit}
        selectedText={selectedText}
        setSelectedText={setSelectedText}
        selectionRange={selectionRange}
        setSelectionRange={setSelectionRange}
      />
      <TodoList todos={todos} fetchTodos={fetchTodos} />
    </div>
  );
}

export default App;
