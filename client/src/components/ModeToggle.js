import React from "react";

function ModeToggle({ toggleMode, isLightMode }) {
  return (
    <button onClick={toggleMode} data-bs-theme={isLightMode ? "light" : "dark"}>
      Toggle Mode (Light/Dark)
    </button>
  );
}

export default ModeToggle;