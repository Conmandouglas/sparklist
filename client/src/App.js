import './App.css';
import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput.js';
import TodoList from './components/TodoList.js';
import Navigation from "./components/Nav.js";
import Push from 'push.js';

function App() {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [isLightMode, setIsLightMode] = useState(null); // start with null
  const [currentList, setCurrentList] = useState({
    list_id: "",  // Ensure this matches the other components
    name: "Loading...  (if taking too long, please refresh the page)"
  });
  const [audioEnabled, setAudioEnabled] = useState([true]);
  const publicVapidKey = "BMflZggYJziEpJHQQ5nA-tWUnUgcGVRA1z6mbNbDXX1RvZTTLu113nXvub2l57J8lTmuMefXd3li6RnAb85h5vA"; 
  const [currentUser, setCurrentUser] = useState(null);


  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    console.log("System prefers light mode?", mediaQuery.matches);
    setIsLightMode(mediaQuery.matches);

    // Optional: Watch for changes
    const handleChange = (e) => {
      console.log("System theme changed. Now prefers light mode?", e.matches);
      setIsLightMode(e.matches);
    };

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

          todo.notified = true; // Prevent duplicates during this session
        }
      })
    }, 10000);

    return () => clearInterval(interval);
  }, [todos])


  const colorMap = {
    yellow: {
      light: "#ffffce",
      dark: "#a2a212",
    },
    blue: {
      light: "#ADD8E6",
      dark: "#428ea7",
    },
    green: {
      light: "#ceffce",
      dark: "#2f962f",
    },
    pink: {
      light: "#ffceeb",
      dark: "#dd47a1",
    },
  };

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

  useEffect(() => {
    if (isLightMode === null) return;
  
    const body = document.body;
    if (isLightMode) {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    } else {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    }
  }, [isLightMode]);
  
  

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
    <div
      className="app-container"
      data-bs-theme={isLightMode ? "light" : "dark"}
    >
      <Navigation
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleListSelect={handleListSelect}
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
        />
        <TodoList
          todos={todos}
          fetchTodos={fetchTodos}
          lists={lists}
          colorMap={colorMap}
          isLightMode={isLightMode}
        />
      </div>
    </div>
  );
}

export default App;
