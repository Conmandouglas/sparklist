import React from 'react';

function LoginUser() {
  function onSubmitForm() {

  }

  return (
    <>
      <h2 className="mb-3">Log In</h2>
      <form action="/users/login" method="POST" onSubmit={onSubmitForm}>
        <div className="mb-3">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </>
  );
}

export default LoginUser;