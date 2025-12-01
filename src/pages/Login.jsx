import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Form.css";

function Login({ onLogin }) {
  const [form, setForm] = useState({
    employeeId: "",
    identifier: "",
    password: "",
    role: "employee",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((u) => {
      const matchId = u.employeeId === form.employeeId;
      const matchIdentifier = [u.username, u.phone, u.email].includes(form.identifier);
      const matchPwd = u.password === form.password;

      if (!matchId || !matchIdentifier || !matchPwd) return false;

      if (form.role === "hr") {
        return u.role === "hr" && u.department === "HR";
      }

      if (form.role === "employee") {
        return u.role === "employee" && u.department !== "HR";
      }

      return false;
    });

    if (user) {
      localStorage.setItem("auth", JSON.stringify(user));
      setError("");
      onLogin();
    } else {
      setError(`Invalid credentials or wrong role/department combination for ${form.role.toUpperCase()}.`);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="employeeId"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={handleChange}
          required
        />
        <input
          name="identifier"
          placeholder="Username / Phone / Email"
          value={form.identifier}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "6px", marginBottom: "16px" }}
        >
          <option value="employee">EMPLOYEE</option>
          <option value="hr">HR</option>
        </select>
        <button type="submit" className="btn">Login</button>
      </form>
      <div style={{ marginTop: "20px", fontWeight: "600", fontSize: "1em" }}>
        <p>
          Login as <Link to="/hrlogin" style={{ color: "#2563eb", textDecoration: "underline" }}>HR</Link>, <Link to="/managerlogin" style={{ color: "#2563eb", textDecoration: "underline" }}>Manager</Link> or <Link to="/adminlogin" style={{ color: "#2563eb", textDecoration: "underline" }}>Admin</Link>
        </p>
      </div>
      <div style={{ marginTop: "10px", fontWeight: "600", fontSize: "1em" }}>
        admin login: username - admin, password - admin123<br/>
      </div>
    </div>
  );
}

export default Login;
