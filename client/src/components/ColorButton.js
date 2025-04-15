import React from "react";

function ColorButton({ color, setColor, btnColor }) {
  return (
    <button
      className="btn rounded-circle p-0 "
      style={{
        backgroundColor: btnColor,
        width: "20px",
        height: "20px",
        border: color === btnColor ? "2px solid black" : "none",
      }}
      onClick={(e) => {
        e.preventDefault(); // Prevent form submission
        setColor(btnColor); // Set color without event object
      }}
    >
    </button>
  );
}

export default ColorButton;
