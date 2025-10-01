
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AdminLogin.css";

function AdminLogin({ onAdminLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const defaultAdmin = {
    username: "admin",
    password: "admin123"
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.username === defaultAdmin.username && form.password === defaultAdmin.password) {
      localStorage.setItem("adminAuth", JSON.stringify(defaultAdmin));
      onAdminLogin();
      navigate("/dashboard");
    } else {
      setError("Invalid admin username or password!");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-login-form">
        <input
          name="username"
          placeholder="Admin Username"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <button type="submit" className="btn">Login as Admin</button>
      </form>
      <div style={{ marginTop: "20px", fontWeight: "600", fontSize: "1em" }}>
        <p>
          Login as <Link to="/login" style={{ color: "#2563eb", textDecoration: "underline" }}>Employee</Link>, <Link to="/hrlogin" style={{ color: "#2563eb", textDecoration: "underline" }}>HR</Link> or <Link to="/managerlogin" style={{ color: "#2563eb", textDecoration: "underline" }}>Manager</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
