import React, { useState, useEffect } from "react";

const EditTodo = ({ todo, fetchTodos, lists }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedListId, setSelectedListId] = useState(0);

  //use effect
  //if a todo, set the description to the todos description
  //in the brackets, include something (hint its the item)
  useEffect(() => {
    if (todo) {
      setContent(todo.content);
      setTitle(todo.title);
      setSelectedListId(todo.list_id); // Make sure the correct list is selected
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
      const body = { title, content, list_id: selectedListId };
      console.log("Updating Todo with Body:", body)
      await fetch(`http://localhost:5001/todos/${todo.item_id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      });

      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  }


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