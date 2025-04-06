import React, { useEffect, useState } from "react";
import ListItem from './ListItem.js';

function Navigation({ isSidebarOpen, toggleSidebar, handleListSelect }) {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Automatically open the sidebar on large screens
        toggleSidebar();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toggleSidebar]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch("http://localhost:5001/lists");
      const data = await response.json();
      setLists(data);
      console.log("Fetched Lists:", data);
    } catch (err) {
      console.error(err.message);
    }
  }


  const goToList = async (list_id) => {
    try {
      const response = await fetch(`http://localhost:5001/lists/${list_id}`);
      const listTodos = await response.json();
      handleListSelect(listTodos);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar position-fixed top-0 start-0 w-100">
        <button
          className="btn btn-outline-light ms-3"
          onClick={toggleSidebar}
          style={{ fontSize: "20px", padding: "3px 8px", lineHeight: "1" }}
        >
          ☰
        </button>
      </nav>

      {/* Sidebar */}
      <div
        className={`sidebar position-fixed top-0 start-0 vh-100 text-white p-3 ${
          !isSidebarOpen ? "collapsed" : ""
        }`}
        style={{
          width: isSidebarOpen ? "250px" : "0",
          overflow: "hidden",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <h4 style={{ display: isSidebarOpen ? "block" : "none" }}>Sidebar</h4>
        <ul
          className="nav flex-column"
          style={{ display: isSidebarOpen ? "block" : "none" }}
        >
          {lists.map((item) => {
            return (
              <ListItem
                key={item.list_id}
                name={item.name}
                list_id={item.list_id}
                goToList={goToList}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Navigation;