import './App.css';
import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput.js';
import TodoList from './components/TodoList.js';
import Heading from "./components/Heading.js";
import Navigation from "./components/Nav.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:5001/todos");
      const data = await response.json();
      setTodos(data);
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

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <Navigation 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
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
    </div>
  );
}

export default App;
