import React from "react";
import { useState } from "react";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post("/auth/register",formData)
        console.log("Register Success:",res.data);        
    } catch (error) {
        console.log("Register error:", error.response?.data || error.message );
        
    }
  };

  return (
    <div>
      <h1>Register</h1>

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
    </div>
  );
}

export default Register;
