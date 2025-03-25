//to do
import React, { useState } from "react";

const TodoInput = ({ fetchTodos }) => {
//state for content
//state for title
const [title, setTitle] = useState("");
const [content, setContent] = useState("");

//on submitting form function
//get content and title from the body
//await responsde
//await a fetch from the main route
//set the headers to tell server we are sending JSON
//fetch only accepts a string so make it string converted
//set the window location to home route to reset the box upon submission
const onSubmitForm = async (e) => {
  e.preventDefault();
  try {
    const body = { title, content };
    await fetch('http://localhost:5001/todos', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    fetchTodos();
    setTitle("");
    setContent("");
  } catch (err) {
    console.error(err.message);
  }
}


  return (
    <>
      <h1>Spark List</h1>
      <form onSubmit={onSubmitForm}>
        <input 
          input="text"
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
        />
        {/*make expandable input eventually*/}
        <textarea 
          type="text"
          className="form-control"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Your note"
          style={{
            display: "block"
          }}
        />
        <button className="btn btn-success">+</button>
      </form>
    </>
  )
}

//watch: https://www.youtube.com/watch?v=ml4USMIm594 and build a rich text editor, and get it rendered too

export default TodoInput;