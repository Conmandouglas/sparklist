import React from "react";

function InfoText({ titleLimit, contentLimit }) {
  return (
    <>
      <p className="text-danger mb-0" style={{ display: titleLimit ? "block" : "none" }}>
        <strong>Warning!</strong> You have reached the character limit on the title!
      </p>
      <p className="text-danger" style={{ display: contentLimit ? "block" : "none" }}>
        <strong>Warning!</strong> You have reached the character limit on the content!
      </p>
    </>
  );
}

export default InfoText;
