import React from "react";
import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await api.post("/auth/login", formData);
      // localStorage.setItem("token", res.data.token);
      login(res.data.token);
      navigate("/dashboard");
      console.log("login success:", res.data);
    } catch (error) {
      // console.log("login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="passwprd"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <button type="submit"> Login </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Don't have an acoount? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
