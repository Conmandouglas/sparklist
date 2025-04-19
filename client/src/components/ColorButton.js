import React from "react";

function ColorButton({ colorName, setColorName, btnColorName, isLightMode, colorMap }) {
  const bgColor = colorMap[btnColorName][isLightMode ? "light" : "dark"];

  return (
    <button
      className="btn rounded-circle p-0"
      data-bs-theme={isLightMode ? "light" : "dark"}
      style={{
        backgroundColor: bgColor,
        width: "20px",
        height: "20px",
        border:
          colorName === btnColorName
            ? isLightMode
              ? "solid 2px black"
              : "solid 2px white"
            : "none",
      }}
      onClick={(e) => {
        e.preventDefault(); // Prevent form submission
        setColorName(btnColorName); // Update the selected color
      }}
    ></button>
  );
}

export default ColorButton;
