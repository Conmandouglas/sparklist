import React, { useState } from 'react';

function SignUp({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState([]);

  function onChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  //you have to manually send form data in React
  async function onSubmitForm(e) {
    e.preventDefault();
    setErrors([]);

    try {
      const res = await fetch("http://localhost:5001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setErrors([{ message: "An unknown error occurred" }]);
      } else {
        if (onRegisterSuccess) {
          onRegisterSuccess(data.user); // Send user info up to Navigation
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  }
  

  return (
    <>
      {errors.length > 0 && (
        <div className="mb-3">
          {errors.map((error, index) => (
            <div key={index} style={{ color: "red" }}>
              {error.message}
            </div>
          ))}
        </div>
      )}
      <h2 className="mb-3">Sign Up</h2>
      <form onSubmit={onSubmitForm}>
        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="form-control"
            required
            value={formData.name}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control"
            required
            value={formData.email}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control"
            required
            value={formData.password}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            className="form-control"
            required
            value={formData.password2}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    </>
  );
}

export default SignUp;
