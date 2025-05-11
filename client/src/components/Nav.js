import React, { useEffect, useState } from "react";
import ListItem from './ListItem.js';
import ModeToggle from "./ModeToggle.js";
import AudioToggle from "./AudioToggle.js";
import LoginUser from "./LoginUser.js";
import SignUp from "./SignUp.js";

function Navigation({
  isSidebarOpen,
  toggleSidebar,
  handleListSelect,
  setCurrentList,
  lists,
  setLists,
  isLightMode,
  setIsLightMode,
  toggleAudio,
  audioEnabled,
  currentUser,
  setCurrentUser
}) {
  const [listName, setListName] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [view, setView] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.name || "");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        toggleSidebar();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggleSidebar]);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setNewUsername(parsedUser.name);
    }
  }, []);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?.user_id) return;

    const newName = newUsername;
    const userId = currentUser.user_id;

    try {
      const response = await fetch('http://localhost:5001/users/editname', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName, user_id: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentUser(prev => ({ ...prev, name: newName }));
        localStorage.setItem('user', JSON.stringify({ ...currentUser, name: newName }));
      } else {
        console.error("Error updating username:", data.error);
      }
    } catch (err) {
      console.error("Username update failed:", err);
    }
  };

  const onLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setView("");
  };

  const onRegisterSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setView("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setShowUserMenu(false);
  };

  const toggleMode = () => {
    setIsLightMode(!isLightMode);
  };

  const fetchLists = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`http://localhost:5001/lists?user_id=${currentUser.user_id}`);
      const data = await response.json();
      console.log("Fetched lists:", data);  // Log fetched lists
      setLists(data);
    } catch (err) {
      console.error("Failed to fetch lists:", err.message);
    }
  };

  const goToList = async (list_id) => {
    console.log("Navigating to list with ID:", list_id);  // Log the list ID
    try {
      const response = await fetch(`http://localhost:5001/lists/${list_id}`);
      const listTodos = await response.json();
      handleListSelect(listTodos);

      const selectedList = lists.find((list) => list.list_id === list_id);
      if (selectedList) {
        console.log("Selected list:", selectedList);  // Log selected list details
        setCurrentList({
          list_id: selectedList.list_id,
          name: selectedList.name,
        });
      }
    } catch (err) {
      console.error("Error fetching list todos:", err.message);
    }
  };

  const listButton = () => {
    setShowAddList(!showAddList);
  };

  const submitNewList = async (e) => {
    e.preventDefault();
    if (!listName.trim()) {
      alert("List name cannot be empty.");
      return;
    }

    try {
      setShowAddList(false);
      const response = await fetch("http://localhost:5001/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listName, user_id: currentUser?.user_id }),
      });

      if (response.ok) {
        fetchLists();
        setListName("");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create list");
      }
    } catch (err) {
      console.error("Error creating list:", err.message);
      alert("Something went wrong while creating the list.");
    }
  };

  const listDelete = async (list_id) => {
    console.log("Deleting list with ID:", list_id);  // Log the list ID to be deleted
    try {
      if (!list_id) {
        alert("Invalid list ID");
        return;
      }

      if (lists.length === 1) {
        alert("You are unable to delete this list. It is your only list.");
        return;
      }

      const todosResponse = await fetch("http://localhost:5001/todos");
      const todos = await todosResponse.json();
      const todosToDelete = todos.filter((todo) => todo.list_id === list_id);

      if (todosToDelete.length > 0) {
        const confirmDeleteTodos = window.confirm(
          "This list contains todos. Do you want to delete them along with the list?"
        );
        if (!confirmDeleteTodos) return;

        await Promise.all(
          todosToDelete.map(async (todo) => {
            const todoDeleteResponse = await fetch(
              `http://localhost:5001/todos/${todo.item_id}`,
              { method: "DELETE" }
            );
            if (!todoDeleteResponse.ok) {
              throw new Error(`Failed to delete todo with ID: ${todo.item_id}`);
            }
          })
        );
      }

      const confirmDeleteList = window.confirm(
        "Are you sure you want to delete this list?"
      );
      if (!confirmDeleteList) return;

      const listDeleteResponse = await fetch(
        `http://localhost:5001/lists/${list_id}`,
        { method: "DELETE" }
      );

      if (!listDeleteResponse.ok) {
        const data = await listDeleteResponse.json();
        alert(data.error || "Something went wrong deleting the list.");
        return;
      }

      fetchLists();
    } catch (err) {
      console.error("Error during deletion:", err.message);
      alert("Something went wrong while deleting the list and todos.");
    }
  };

  return (
    <div>
      <nav
        className="navbar position-fixed top-0 start-0 w-100 d-flex align-items-center justify-content-between px-3"
        style={{
          height: "50px",
          zIndex: "1050",
          backgroundColor: isLightMode ? "#e0e0e0" : "#1c1c1c",
          color: isLightMode ? "#000" : "#FFD700",
        }}
      >
        {/* Left: Sidebar toggle and title */}
        <div className="d-flex align-items-center">
          <button
            className={`btn me-3 ${
              isLightMode ? "btn-outline-dark" : "btn-outline-light"
            }`}
            onClick={toggleSidebar}
            style={{ fontSize: "20px", padding: "3px 8px", lineHeight: "1" }}
          >
            ☰
          </button>
          <h5 className="mb-0">Spark Todos</h5>
        </div>

        {/* Right: Log In / Sign Up buttons */}
        <div className="d-flex align-items-center me-2">
          {currentUser ? (
            <>
              <button
                className="btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span style={{ marginRight: "10px" }}>
                  Hello, {currentUser.name} ▼
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setView("login")}
                className="btn btn-secondary btn-sm me-2"
              >
                Log In
              </button>
              <button
                onClick={() => setView("signup")}
                className="btn btn-secondary btn-sm"
              >
                Sign Up
              </button>
            </>
          )}

          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: "25px", // Adjust based on your layout
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: isLightMode ? "#f9f9f9" : "#2c2c2c",
                boxShadow: "6px 6px rgba(0, 0, 0, 0.3)",
                zIndex: 1100,
                minWidth: "150px",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>{currentUser ? currentUser.name : "Guest"}</strong>
              </div>
              {isEditingUsername ? (
                <form onSubmit={handleUsernameSubmit}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="New username"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm w-100 mb-1"
                  >
                    Change Username
                  </button>
                </form>
              ) : (
                <button
                  className="btn btn-outline-secondary btn-sm w-100 mb-1"
                  onClick={() => {
                    setNewUsername(currentUser.name);
                    setIsEditingUsername(true);
                  }}
                >
                  Edit Username
                </button>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm w-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* View box (optional) */}
        {view && (
          <div
            style={{
              position: "absolute",
              top: 60,
              right: 20,
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: isLightMode ? "#f9f9f9" : "#1c1c1c",
              boxShadow: "6px 6px rgba(0, 0, 0, 0.5)",
              zIndex: 1100,
            }}
          >
            <button
              onClick={() => setView("")}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                border: "none",
                background: "none",
                fontSize: "25px",
                fontWeight: "bold",
                color: isLightMode ? "#000" : "#fff",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>
            {view === "login" && <LoginUser onLoginSuccess={onLoginSuccess} />}
            {view === "signup" && (
              <SignUp onRegisterSuccess={onRegisterSuccess} />
            )}
          </div>
        )}
      </nav>

      <div
        className={`sidebar position-fixed top-0 start-0 p-3 ${
          !isSidebarOpen ? "collapsed" : ""
        }`}
        style={{
          position: "fixed",
          width: isSidebarOpen ? "250px" : "0",
          height: "100%", // use full height, not vh
          overflow: "hidden",
          transition: "width 0.3s ease-in-out",
          backgroundColor: isLightMode ? "#e0e0e0" : "#1c1c1c",
          color: isLightMode ? "#000" : "#FFD700",
        }}
      >
        <h4 style={{ display: isSidebarOpen ? "block" : "none" }}>Sidebar</h4>
        <ul
          className="nav flex-column"
          style={{ display: isSidebarOpen ? "block" : "none" }}
        >
          {currentUser && (
            <div className="list-container">
              {lists.map((list) => (
                <ListItem
                  key={list.list_id}
                  list={list}
                  list_id={list.list_id}  // Make sure this value is defined
                  name={list.name}        // Make sure this value is defined
                  goToList={goToList}
                  listDelete={listDelete}
                  isLightMode={isLightMode}
                />
              ))}
            </div>
          )}
          <li>
            <button
              className={`navbtn btn ${
                isLightMode ? "btn-info" : "btn-success"
              } py-1 px-2`}
              style={{
                display: showAddList ? "none" : "block",
                fontWeight: "425",
              }}
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
        {isSidebarOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "25px",
              left: "15px",
            }}
          >
            <p className="conf d-block mb-3">Settings</p>
            <div className="d-flex">
              <ModeToggle
                toggleMode={toggleMode}
                isLightMode={isLightMode}
                isSidebarOpen={isSidebarOpen}
              />
              <AudioToggle
                toggleAudio={toggleAudio}
                audioEnabled={audioEnabled}
                isSidebarOpen={isSidebarOpen}
                isLightMode={isLightMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
