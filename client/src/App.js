import './App.css';
import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput.js';
import TodoList from './components/TodoList.js';
import Navigation from "./components/Nav.js";

function App() {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [currentList, setCurrentList] = useState({
    list_id: "",  // Ensure this matches the other components
    name: "Loading..."
  });

  // Fetch lists when the component mounts
  useEffect(() => {
    const fetchLists = async() => {
      try {
        const res = await fetch('http://localhost:5001/lists');
        const data = await res.json();
        setLists(data);

        // If there are no lists, create a default "Today" list
        if (data.length === 0) {
          await createList("Today");
          fetchLists(); // Refetch lists after creating the default one
        } else {
          // Sort lists by the lowest list_id and set it as the current list
          data.forEach((list) => {
            console.log(`List ID: ${list.list_id}, List Name: ${list.name}`);
          });
          const defaultList = data.sort((a, b) => a.list_id - b.list_id)[0];
          console.log(defaultList);
          setCurrentList(defaultList);
        }
      } catch (err) {
        console.error("Error fetching lists:", err.message);
      }
    }
    
    fetchLists();
  }, []);

  const createList = async (listName) => {
    try {
      const response = await fetch("http://localhost:5001/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listName }),
      });
      const newList = await response.json();
      setLists((prevLists) => [...prevLists, newList]);
    } catch (err) {
      console.error("Error creating list:", err);
    }
  }

  // Fetch todos based on the current selected list, only when currentList.list_id is set
  useEffect(() => {
    if (currentList.list_id) {
      fetchTodos();
    }
  }, [currentList]);

  const fetchTodos = async () => {
    try {
      console.log(`Current LIST ID: ${currentList.list_id}`);
      console.log(`THE WHOLE LIST: ${currentList}`);
      const res = await fetch(`http://localhost:5001/lists/${currentList.list_id}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  };

  const handleListSelect = (listTodos) => {
    setTodos(listTodos);
  }

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
        handleListSelect={handleListSelect}
        setCurrentList={setCurrentList}
        lists={lists}
        setLists={setLists}
      />
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <TodoInput
          fetchTodos={fetchTodos}
          onSubmit={handleSubmit}
          currentList={currentList}
          setCurrentList={setCurrentList}
        />
        <TodoList todos={todos} fetchTodos={fetchTodos} lists={lists} />
      </div>
    </div>
  );
}

export default App;
