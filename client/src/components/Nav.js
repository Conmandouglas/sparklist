import React, { useEffect, useState } from "react";
import ListItem from './ListItem.js';

function Navigation({ isSidebarOpen, toggleSidebar, handleListSelect, setCurrentList, lists, setLists }) {
  const [listName, setListName] = useState("");
  const [showAddList, setShowAddList] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
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
      
      const selectedList = lists.find(list => list.list_id === list_id);
      if (selectedList) {
        setCurrentList({
          list_id: selectedList.list_id,
          name: selectedList.name
        });
      }
      console.log("Fetching list:", list_id);
      console.log("List todos:", listTodos);
    } catch (err) {
      console.error(err.message);
    }
  }

  const goToAllTodos = async () => {
    try {
      const response = await fetch("http://localhost:5001/todos");
      const allTodos = await response.json();
      handleListSelect(allTodos);
      setCurrentList({
        list_id: "",
        name: "All Todos"
      });
    } catch (err) {
      console.error(err.message);
    }
  };
  

  const listButton = async () => {
    setShowAddList(!showAddList);
  }

  const submitNewList = async (e) => {
    e.preventDefault();
    try {
      setShowAddList(!showAddList);
      const body = {
        listName
      }

      const response = await fetch("http://localhost:5001/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      fetchLists();
      setListName("");
    } catch (err) {
      console.error(err.message);
    }
  }

  const listDelete = async (list_id) => {
    try {
      const response = await fetch(`http://localhost:5001/lists/${list_id}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.error); // 👈 Show user-friendly error
        return;
      }
  
      fetchLists(); // Refresh the list only if delete succeeded
    } catch (err) {
      console.error(err.message);
      alert("Something went wrong deleting the list.");
    }
  };
  

  return (
    <div>
      <nav
        className="navbar position-fixed top-0 start-0 w-100 bg-dark text-white d-flex align-items-center px-3"
        style={{ height: "50px", zIndex: "1050" }}
      >
        <button
          className="btn btn-outline-light me-3"
          onClick={toggleSidebar}
          style={{ fontSize: "20px", padding: "3px 8px", lineHeight: "1" }}
        >
          ☰
        </button>
        <h5 className="mb-0">Spark Todos</h5>
      </nav>

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
          <li className="ms-2 fw-bold">
            <button onClick={goToAllTodos}>
              All Todos
            </button>
            </li>
          <hr></hr>
          {lists.map((item) => {
            return (
              <ListItem
                key={item.list_id}
                name={item.name}
                list_id={item.list_id}
                goToList={goToList}
                listDelete={listDelete}
              />
            );
          })}
          <li>
            <button
              className="btn btn-secondary py-1 px-2"
              style={{ display: showAddList ? "none" : "block" }}
              onClick={listButton}
            >
              New List
            </button>
          </li>
        </ul>
        <form
          onSubmit={submitNewList}
          style={{ display: showAddList ? "block" : "none" }}
        >
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Enter list name"
            className="form-control"
            autoFocus
          />
          <button className="btn btn-primary mt-2">Create List</button>
        </form>
      </div>
    </div>
  );
}

export default Navigation;
