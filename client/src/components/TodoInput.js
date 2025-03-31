import React, { useState, useEffect, useRef } from "react";
import ColorButton from "./ColorButton.js";
import Heading from "./Heading.js"

const TodoInput = ({ fetchTodos, selectedText, setSelectedText, selectionRange, setSelectionRange, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("");
  const textareaRef = useRef(null);

  function setTheColor(newColor) {
    setColor(newColor); // This function does NOT need e.preventDefault()
  }

  // Ensure content updates correctly without messing up cursor position
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== content) {
      textareaRef.current.value = content.replace(/&nbsp;/g, " ");
    }
  }, [content]);

  // Track selection and its range when text is selected
  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selected = selection.toString();

      if (textareaRef.current) {
        const startOffset = textareaRef.current.selectionStart;
        const endOffset = textareaRef.current.selectionEnd;

        setSelectedText(selected);
        setSelectionRange({ start: startOffset, end: endOffset });

        console.log(`Selected: "${selected}" at (${startOffset}, ${endOffset})`);
      }
    }
  };

  // Handle form submission (send title and content to the server)
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { title, content, color };
      await fetch("http://localhost:5001/todos", {
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

  // Attach event listeners for selection tracking
  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);

  return (
    <>
      <Heading />

      <div className="container-fluid">
        <form onSubmit={onSubmitForm} className="d-flex flex-column">
          {/*text here that shows only if character limit is reached on title, or content.
          what it says is dependent on what is exceeded, ex "Title character limit reached!" or 
          "Title and Content character limit reached!" 
          get the input element
          add event listener for it checkMaxLength
          for that function if inputElement.value.length is greater than or equal to inputElement.maxLength
          then using ternary operator this displays.
          for now, have one that displays if title limit reached, and one if content limit reached
          for simplicity.  */}
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
          />
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
