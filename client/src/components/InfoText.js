import React from "react";

function InfoText({ titleLimit, contentLimit }) {
  return (
    <>
      <p className="text-warning-emphasis mb- bg-warning-subtle mb-1" style={{ display: titleLimit ? "block" : "none" }}>
        <strong>Alert!</strong> You have reached the character limit on the title!
      </p>
      <p className="text-warning-emphasis bg-warning-subtle mt-0" style={{ display: contentLimit ? "block" : "none" }}>
        <strong>Alert!</strong> You have reached the character limit on the content!
      </p>
    </>
  );
}

export default InfoText;
