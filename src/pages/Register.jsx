import React from "react";
import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handlechange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      const res = await api.post("/auth/register", formData);

      console.log("Register Success:", res.data);

      navigate("/login");
    } catch (error) {
      // console.log("Register error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Register Failed");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handlesubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handlechange}
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handlechange}
        />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handlechange}
        />
        <br />

        <button type="submit"> Register </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
