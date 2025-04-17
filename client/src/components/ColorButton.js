import React from "react";

function ColorButton({ colorName, setColorName, btnColorName, isLightMode }) {
  const colorMap = {
    yellow: {
      light: "#ffffce",
      dark: "#dfdf7f",
    },
    blue: {
      light: "#ADD8E6",
      dark: "#60aec9",
    },
    green: {
      light: "#ceffce",
      dark: "#3ebc3e",
    },
    pink: {
      light: "#ffceeb",
      dark: "#dd47a1",
    },
  };

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
