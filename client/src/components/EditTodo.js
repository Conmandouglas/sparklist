import React, { useState, useEffect } from "react";

const EditTodo = ({ todo, fetchTodos, lists, color }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedListId, setSelectedListId] = useState(0);
  const [remind_at, setRemind_at] = useState("");

  //use effect
  //if a todo, set the description to the todos description
  //in the brackets, include something (hint its the item)

  function formatDateTimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0,16);
  }
  

  useEffect(() => {
    if (todo) {
      setContent(todo.content);
      setTitle(todo.title);
      setSelectedListId(todo.list_id);
      setRemind_at(formatDateTimeLocal(todo.remind_at));
    }
  }, [todo]);
  

  //update Description funcction and take in a value
  //prevent the default functinoality
  //get the bodies title and content
  //await and fetch the PUT url for todos/:id
  //for headers set content type to accept json
  //stringify the body
  //reset to the "/"
  //catch errors

  const updateContent = async (e) => {
    e.preventDefault();
    try {
      const body = {
        title,
        content,
        list_id: selectedListId,
        remind_at,
        color, // <-- still send it even if they can't edit
      };
      console.log("Updating Todo with Body:", body);
      await fetch(`http://localhost:5001/todos/${todo.item_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  };
  


  return (
    <>
      <button
        type="button"
        className="btn btn-warning p-1 px-2 me-1"
        data-bs-toggle="modal"
        data-bs-target={`#id${todo?.todo_id}`}
      >
        Edit
      </button>

      <div
        className="modal"
        id={`id${todo?.todo_id}`}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) {
            setContent(todo.content);
            setTitle(todo.title);
          }
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Todo</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={() => {
                  setContent(todo.content);
                  setTitle(todo.title);
                }}
              ></button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                value={title}
                placeholder="Edit title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Edit note"
                className="form-control mb-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <label className="form-label me-1">Importance:</label>
              <select className="me-2">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <label className="form-label me-1">List:</label>
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(parseInt(e.target.value))}
              >
                {lists.map((list) => (
                  <option key={list.list_id} value={list.list_id}>
                    {list.name}
                  </option>
                ))}
              </select>
              <br></br>
              <label className="form-label me-1">Remind At:</label>
              <input
                type="datetime-local"
                value={remind_at}
                onChange={(e) => {
                  setRemind_at(e.target.value);
                  console.log(`Remind at changed: ${e.target.value}`);
                }}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                onClick={async (e) => {
                  await updateContent(e);
                  // Manually close modal
                  const modal = document.getElementById(`id${todo?.todo_id}`);
                  const backdrop = document.querySelector(".modal-backdrop");
                  if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    document.body.classList.remove("modal-open");
                    document.body.style = "";
                    if (backdrop) backdrop.remove();
                  }
                }}
              >
                Edit
              </button>

              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => {
                  setContent(todo.content);
                  setTitle(todo.title);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTodo;