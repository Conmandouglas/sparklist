import React, { useState, useEffect } from "react";
import ColorButton from "./ColorButton.js";
import InfoText from "./InfoText.js";

const TodoInput = ({ fetchTodos, currentList, isLightMode, colorMap, audioEnabled, currentUser }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [colorName, setColorName] = useState("yellow"); // Default yellow color
  const [titleLimit, setTitleLimit] = useState(false);
  const [contentLimit, setContentLimit] = useState(false);
  const [importance, setImportance] = useState("3");
  const [remind, setRemind] = useState(false);
  const [remind_at, setRemind_at] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  function setTheColor(newColor) {
    setColorName(newColor); // This function does NOT need e.preventDefault()
    console.log(`Color set to: ${newColor}`);
  }

  useEffect(() => {
    setTitleLimit(title.length >= 30);
    console.log(`Title length limit reached: ${titleLimit}`);
  }, [title]);

  useEffect(() => {
    console.log(`remind_at updated: ${remind_at}`);
  }, [remind_at]);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
    setFormattedDate(formatted);
    console.log(`Formatted date generated: ${formatted}`);
  }, [remind]);

  useEffect(() => {
    if (remind) {
      setRemind_at(formattedDate);
    } else {
      setRemind_at(""); // Clear the remind_at when checkbox is unchecked
    }
  }, [remind, formattedDate]);

  const playSound = () => {
    if (audioEnabled) {
      const audio = new Audio("/sounds/pop-cartoon-328167.mp3");
      audio.play();
    }
    console.log("Audio play triggered.");
  };

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

    // Ensure remind_at is set to null or a valid date
    const body = {
      title,
      content,
      color: colorName,
      importance: importance ? parseInt(importance) : 3,
      list_id: currentList.list_id,
      remind_at: remind ? remind_at : null, // Ensure null if remind is false
      user_id: currentUser.user_id
    };

    console.log("Form body:", body);  // Log the final body to verify

    try {
      const response = await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      playSound();
      fetchTodos();
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {/* Conditionally render everything based on user */}
      {currentUser ? (
        <>
          <h1 className="my-3 fs-1">{currentList.name}</h1>
          <div
            className="container-fluid"
            data-bs-theme={isLightMode ? "light" : "dark"}
          >
            {currentList.name === "All Todos" && (
              <div className="alert alert-warning" role="alert">
                Please select a list from the sidebar to add a todo.
              </div>
            )}

            {currentList.list_id && currentList.name !== "All Todos" && (
              <form
                onSubmit={onSubmitForm}
                className="d-flex flex-column"
              >
                <InfoText titleLimit={titleLimit} contentLimit={contentLimit} />
                <input
                  type="text"
                  className={`form-control mb-2 ${
                    isLightMode ? "bg-light text-dark" : "bg-dark text-light"
                  }`}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    console.log(`Title changed: ${e.target.value}`);
                  }}
                  placeholder="Title"
                  maxLength="30"
                />

                <textarea
                  className={`form-control mb-2 ${
                    isLightMode ? "bg-light text-dark" : "bg-dark text-light"
                  }`}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    console.log(`Content changed: ${e.target.value}`);
                  }}
                  placeholder="Your note"
                  rows="4"
                  maxLength="255"
                />

                <div>
                  <label className="form-label me-2">Importance:</label>
                  <select
                    value={importance}
                    onChange={(e) => {
                      setImportance(e.target.value);
                      console.log(`Importance changed: ${e.target.value}`);
                    }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div>
                  <label>Remind User?</label>
                  <input
                    type="checkbox"
                    checked={remind}
                    onChange={(e) => {
                      setRemind(e.target.checked);
                      console.log(`Reminder checked: ${e.target.checked}`);
                      if (!e.target.checked) {
                        setRemind_at(""); // Clear the remind_at when checkbox is unchecked
                      }
                    }}
                    className="mx-2 my-2"
                  />
                  <input
                    type="datetime-local"
                    value={remind_at}
                    onChange={(e) => {
                      setRemind_at(e.target.value);
                      console.log(`Remind at changed: ${e.target.value}`);
                    }}
                    style={{ display: remind ? "inline-block" : "none" }}
                  />
                </div>
                <div>
                  <ColorButton
                    colorName={colorName}
                    setColorName={setTheColor}
                    btnColorName="yellow"
                    isLightMode={isLightMode}
                    colorMap={colorMap}
                  />
                  <ColorButton
                    colorName={colorName}
                    setColorName={setTheColor}
                    btnColorName="blue"
                    isLightMode={isLightMode}
                    colorMap={colorMap}
                  />
                  <ColorButton
                    colorName={colorName}
                    setColorName={setTheColor}
                    btnColorName="green"
                    isLightMode={isLightMode}
                    colorMap={colorMap}
                  />
                  <ColorButton
                    colorName={colorName}
                    setColorName={setTheColor}
                    btnColorName="pink"
                    isLightMode={isLightMode}
                    colorMap={colorMap}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className={`btn ${
                      isLightMode ? "btn-primary" : "btn-dark"
                    } py-1 px-2`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};

export default TodoInput;
