import './App.css';
import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput.js';
import TodoList from './components/TodoList.js';
import Navigation from "./components/Nav.js";
import Push from 'push.js';

function App() {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(null);
  const [currentList, setCurrentList] = useState({
    list_id: "",
    name: "Loading... (if taking too long, please refresh the page)"
  });
  const [audioEnabled, setAudioEnabled] = useState([true]);
  const publicVapidKey = "BMflZggYJziEpJHQQ5nA-tWUnUgcGVRA1z6mbNbDXX1RvZTTLu113nXvub2l57J8lTmuMefXd3li6RnAb85h5vA";
  const [currentUser, setCurrentUser] = useState(null);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setIsLightMode(mediaQuery.matches);
    const handleChange = (e) => setIsLightMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach(todo => {
        if (
          todo.remind_at &&
          !todo.notified &&
          new Date(todo.remind_at) <= now
        ) {
          Push.create(`Reminder: ${todo.title}`, {
            body: todo.content || 'Time to check this off!',
            icon: '/logo192.png',
            timeout: 6000,
            onClick: () => {
              window.focus();
              this?.close?.();
            }
          });
          todo.notified = true;
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [todos]);

  const colorMap = {
    yellow: { light: "#ffffce", dark: "#a2a212" },
    blue: { light: "#ADD8E6", dark: "#428ea7" },
    green: { light: "#ceffce", dark: "#2f962f" },
    pink: { light: "#ffceeb", dark: "#dd47a1" },
  };

  useEffect(() => {
    const fetchLists = async () => {
      if (!currentUser) return;  // Return early if no user
  
      try {
        console.log("Current user in fetchLists:", currentUser);
  
        // Fetch the lists associated with the current user
        const res = await fetch(`http://localhost:5001/lists?user_id=${currentUser.user_id}`);
        const data = await res.json();
        console.log("Fetched lists:", data);
  
        // Set lists state
        setLists(data);
  
        // If no lists exist, create a default list and set the current list
        if (data.length === 0) {
          const defaultList = await createList("Today");  // Ensure createList returns the created list object
          setLists([defaultList]);  // Set lists state with the newly created list
          setCurrentList(defaultList);  // Set the current list to the created one
        } else {
          // Default to first list if there are already lists
          setCurrentList(data[0]);
        }
      } catch (err) {
        console.error("Error fetching lists:", err.message);
      }
    };
  
    fetchLists();
  }, [currentUser]);
  
  

  const createList = async (listName) => {
    try {
      const response = await fetch("http://localhost:5001/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: listName, user_id: currentUser.user_id })
      });
      const newList = await response.json();
      setLists((prev) => [...prev, newList]);
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  useEffect(() => {
    if (isLightMode === null) return;
    const body = document.body;
    body.classList.toggle("light-mode", isLightMode);
    body.classList.toggle("dark-mode", !isLightMode);
  }, [isLightMode]);

  useEffect(() => {
    if (!currentUser || !currentList.list_id) return;  // Ensure user and list exist
  
    // Call fetchTodos whenever currentList or currentUser changes
    fetchTodos();
  }, [currentList, currentUser]);
  

  const fetchTodos = async () => {
    if (!currentUser || !currentList.list_id) return;
  
    try {
      const res = await fetch(
        `http://localhost:5001/todos?user_id=${currentUser.user_id}&list_id=${currentList.list_id}`
      );
      const data = await res.json();
      console.log("Fetched todos:", data);
      setTodos(data);  // Update todos state with the fetched todos for the current list
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container" data-bs-theme={isLightMode ? "light" : "dark"}>
      <Navigation
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleListSelect={(todos) => setTodos(todos)}
        setCurrentList={setCurrentList}
        lists={lists}
        setLists={setLists}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
        toggleAudio={toggleAudio}
        audioEnabled={audioEnabled}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
      <div className={`main-content ${isSidebarOpen ? "with-sidebar" : ""}`}>
        <TodoInput
          fetchTodos={fetchTodos}
          onSubmit={handleSubmit}
          currentList={currentList}
          setCurrentList={setCurrentList}
          isLightMode={isLightMode}
          colorMap={colorMap}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          currentUser={currentUser}
        />
        <TodoList
          todos={todos}
          fetchTodos={fetchTodos}
          lists={lists}
          colorMap={colorMap}
          isLightMode={isLightMode}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

export default App;
