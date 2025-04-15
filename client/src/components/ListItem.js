import React from 'react';

function ListItem({ list_id, name, goToList, listDelete, isLightMode }) {
  return (
    <li
      className="nav-item d-flex justify-content-between align-items-center list-item"
      style={{
        color: isLightMode ? "#000" : "#FFD700",
      }}
    >
      <button
        className="nav-link flex-grow-1 text-start px-2"
        onClick={() => goToList(list_id)}
        style={{
          background: "transparent",
          border: "none",
          color: isLightMode ? "#000" : "#ccc",
        }}
      >
        {name}
      </button>
      <button
        className="btn p-0 border-0 bg-transparent"
        style={{ lineHeight: "1" }}
        onClick={() => listDelete(list_id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill={isLightMode ? "darkred" : "#FF6B6B"}
          viewBox="0 0 16 16"
          className="trash-icon"
        >
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
        </svg>
      </button>
    </li>
  );
}


export default ListItem;