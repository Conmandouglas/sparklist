import React, { useState } from "react";
import InputBox from "./components/InputBox.js";

function App() {
  const [content, updateContent] = useState("");
    const [selectedText, setSelectedText] = useState("");
    const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
    const [submittedContent, setSubmittedContent] = useState("");


  function updateText(value) {
    updateContent(value);
    console.log(value); // This will now log correctly
    console.log(selectionRange);
  }

  const handleSubmit = (content) => {
    setSubmittedContent(content);
  }

  return (
    <>
      <InputBox
        updateContent={updateText}
        content={content}
        selectedText={selectedText}
        setSelectedText={setSelectedText}
        selectionRange={selectionRange}
        setSelectionRange={setSelectionRange}
        onSubmit={handleSubmit}
      />
      <div>
        <h3>Submitted Content:</h3>
        {/* Render the content as HTML */}
        <div dangerouslySetInnerHTML={{ __html: submittedContent }} />
      </div>
    </>
  );
}

export default App;
