import React from "react";

function AudioToggle({toggleAudio, audioEnabled, isSidebarOpen}) {
  return (
    <>
      <button
        onClick={toggleAudio}
        style={{
          backgroundColor: audioEnabled ? "red" : "green",
          color: "white",
          padding: "5px 10px",
          border: "none",
          borderRadius: "5px",
          display: isSidebarOpen ? "block" : "none"
        }}
      >
        {audioEnabled ? "Turn Sound Off" : "Turn Sound On"}
      </button>
    </>
  );
}

export default AudioToggle;