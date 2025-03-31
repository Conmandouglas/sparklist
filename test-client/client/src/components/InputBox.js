import React, { useEffect, useRef } from "react";
import BoldToggle from "./BoldToggle.js";

function InputBox({
  content,
  updateContent,
  selectedText,
  setSelectedText,
  selectionRange,
  setSelectionRange,
  onSubmit
}) {
  const divRef = useRef(null);

  // Updates content inside the div when content state changes
  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== content) {
      // Ensuring no unnecessary HTML entity encoding happens
      divRef.current.innerHTML = content.replace(/&nbsp;/g, " ");
    }
  }, [content]);

  const handleSelection = () => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selected = selection.toString();

      if (divRef.current) {
        const preRange = document.createRange();
        preRange.selectNodeContents(divRef.current);
        preRange.setEnd(range.startContainer, range.startOffset);
        const startOffset = preRange.toString().length;
        const endOffset = startOffset + selected.length;

        setSelectedText(selected);
        setSelectionRange({ start: startOffset, end: endOffset });
      }
    }
  };

  const handleBold = () => {
    console.log("handling bold");

    if (divRef.current) {
      const newContent =
        content.slice(0, selectionRange.start) +
        "<b>" +
        content.slice(selectionRange.start, selectionRange.end) +
        "</b>" +
        content.slice(selectionRange.end);

      divRef.current.innerHTML = newContent;
      updateContent(newContent);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(content); // Send the content for further processing (rendering below)
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);

  return (
    <div className="border rounded p-2 flex flex-col min-h-[150px]">
      <div
        ref={divRef}
        className="flex-grow p-2 outline-none bg-body"
        contentEditable
        suppressContentEditableWarning={true}
        onInput={(e) => {
          // Only update the content state if it's changed (prevent frequent updates)
          if (e.currentTarget.innerHTML !== content) {
            updateContent(e.currentTarget.innerHTML);
          }
        }}
      />
      <BoldToggle className="self-end mt-2" handleBold={handleBold} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default InputBox;