import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Form.css";

function ManagerLogin({ onLogin }) {
  const [form, setForm] = useState({
    employeeId: "",
    identifier: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const employees = JSON.parse(localStorage.getItem("employees")) || [];

      const user = employees.find(emp =>
        emp.employeeId === form.employeeId &&
        [emp.name, emp.email, emp.phone].includes(form.identifier) &&
        emp.password === form.password &&
        emp.role === "manager"
      );

      if (user) {
        localStorage.setItem("auth", JSON.stringify(user));
        setError("");
        onLogin(user.role);
        navigate("/dashboard");
      } else {
        setError("Invalid Manager credentials.");
      }
    } catch {
      setError("Unexpected error occurred.");
    }
  };

  return (
    <div className="form-container">
      <h2>Manager Login</h2>
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
          placeholder="Username / Email / Phone"
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
        <button type="submit" className="btn">Login as Manager</button>
      </form>
      <div style={{ marginTop: "20px", fontWeight: "600", fontSize: "1em" }}>
        <p>
          Login as <Link to="/login" style={{ color: "#2563eb", textDecoration: "underline" }}>Employee</Link>, <Link to="/hrlogin" style={{ color: "#2563eb", textDecoration: "underline" }}>HR</Link> or <Link to="/adminlogin" style={{ color: "#2563eb", textDecoration: "underline" }}>Admin</Link>
        </p>
      </div>
    </div>
  );
}

export default ManagerLogin;
