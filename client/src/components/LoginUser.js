import React, { useState } from 'react';

function LoginUser({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const res = await fetch("http://localhost:5001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: 'include' // Include cookies if using sessions
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setErrors([{ message: data.error || "An unknown error occurred" }]);
      } else {
        console.log("Login success response:", data); // ✅ add this
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }
      
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors([{ message: "Network error. Please try again." }]);
    }
  };

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
      <h2 className="mb-3">Log In</h2>
      <form onSubmit={onSubmitForm}>
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
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </>
  );
}

export default LoginUser;
