import React, { useState, useEffect, useRef } from "react";
import ColorButton from "./ColorButton.js";
import InfoText from "./InfoText.js";

const TodoInput = ({ fetchTodos, selectedText, setSelectedText, selectionRange, setSelectionRange, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("");
  const [titleLimit, setTitleLimit] = useState(false);
  const [contentLimit, setContentLimit] = useState(false);
  const [importance, setImportance] = useState("3");
  const textareaRef = useRef(null);

  function setTheColor(newColor) {
    setColor(newColor); // This function does NOT need e.preventDefault()
  }

  // Ensure content updates correctly without messing up cursor position
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== content) {
      textareaRef.current.value = content.replace(/&nbsp;/g, " ");
    }
    setContentLimit(content.length >= 255);
  }, [content]);

  useEffect(() => {
    setTitleLimit(title.length >= 30);
  }, [title])

  // Handle form submission (send title and content to the server)
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {
        title,
        content,
        color,
        importance: parseInt(importance), // Convert to number
      };
  
      const response = await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      fetchTodos();
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <form onSubmit={onSubmitForm} className="d-flex flex-column">
          <InfoText titleLimit={titleLimit} contentLimit={contentLimit} />
          <h2>List 1</h2> {/*make it so when submitted it posts to current list*/}
          <input
            type="text"
            className="form-control mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            maxLength="30"
          />
          <textarea
            ref={textareaRef}
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
      </div>
    </>
  );
};

export default TodoInput;
