import React, { useState, useEffect } from "react";
import ColorButton from "./ColorButton.js";
import InfoText from "./InfoText.js";

const TodoInput = ({ fetchTodos, currentList, setCurrentList, onSubmit, isLightMode }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffce"); // Default yellow color
  const [titleLimit, setTitleLimit] = useState(false);
  const [contentLimit, setContentLimit] = useState(false);
  const [importance, setImportance] = useState("3");

  function setTheColor(newColor) {
    setColor(newColor); // This function does NOT need e.preventDefault()
  }

  useEffect(() => {
    setTitleLimit(title.length >= 30);
  }, [title]);

  // Handle form submission (send title and content to the server)
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please enter something for your todo.");
      return;
    }

    if (!currentList.list_id) {
      alert("Please select a list before submitting a todo.");
      return;
    }

    try {
      const body = {
        title,
        content,
        color,
        importance: importance ? parseInt(importance) : 3, // Convert to number
        list_id: currentList.list_id
      };

      const response = await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // After submission, fetch todos again for the current list and for "All Todos"
      fetchTodos();
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h1 className="my-3 fs-1">{currentList.name}</h1>
      <div className="container-fluid" data-bs-theme={isLightMode ? "light" : "dark"}>
        {/* Show message if "All Todos" is selected */}
        {currentList.name === "All Todos" && (
          <div className="alert alert-warning" role="alert">
            Please select a list from the sidebar to add a todo.
          </div>
        )}

        {/* Render input form only if a list is selected */}
        {currentList.list_id && currentList.name !== "All Todos" && (
          <form onSubmit={onSubmitForm} className="d-flex flex-column">
            <InfoText titleLimit={titleLimit} contentLimit={contentLimit} />
            <input
              type="text"
              className="form-control mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              maxLength="30"
            />
            <textarea
              className="form-control mb-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your note"
              rows="4"
              maxLength="255"
            />
            <div>
              <label className="form-label me-2">Importance:</label>
              <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div>
              <ColorButton
                color={color}
                setColor={setTheColor}
                btnColor={"#ffffce"}
              />
              <ColorButton
                color={color}
                setColor={setTheColor}
                btnColor={"#ADD8E6"}
              />
              <ColorButton
                color={color}
                setColor={setTheColor}
                btnColor={"#ceffce"}
              />
              <ColorButton
                color={color}
                setColor={setTheColor}
                btnColor={"#ffceeb"}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default TodoInput;
