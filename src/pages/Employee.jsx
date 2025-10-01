import React, { useState, useEffect } from "react";
import "./Employee.css";

function Employee() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    department: "",
    email: "",
    password: "",
    role: "employee",
    status: "Active",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(form);

  const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];
  const roles = ["employee", "hr", "manager"];

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("auth"));
    if (authUser && authUser.username) setLoggedInUserName(authUser.username);
    else if (authUser && authUser.name) setLoggedInUserName(authUser.name);
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));

    let updatedUsers = [...users];

    employees.forEach((emp) => {
      const userIndex = updatedUsers.findIndex((u) => u.employeeId === emp.employeeId);
      if (userIndex !== -1) {
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          username: emp.name,
          email: emp.email,
          password: emp.password,
          role: emp.role || "employee",
          department: emp.department,
          employeeId: emp.employeeId,
        };
      } else {
        updatedUsers.push({
          username: emp.name,
          email: emp.email,
          password: emp.password,
          role: emp.role || "employee",
          department: emp.department,
          employeeId: emp.employeeId,
          phone: "",
        });
      }
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }, [employees]);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.name || !form.department || !form.email || !form.password || !form.role) return;

    setEmployees([...employees, { ...form, id: Date.now() }]);
    setForm({
      employeeId: "",
      name: "",
      department: "",
      email: "",
      password: "",
      role: "employee",
      status: "Active",
    });
  };

  const handleDelete = (id) => {
    const empToDelete = employees.find((emp) => emp.id === id);
    if (!empToDelete) return;

    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);

    const updatedUsers = users.filter((u) => u.employeeId !== empToDelete.employeeId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleEditClick = (emp) => {
    setEditId(emp.id);
    setEditForm({ ...emp });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleEditSave = (id) => {
    setEmployees(employees.map((emp) => (emp.id === id ? { ...editForm } : emp)));
    setEditId(null);
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  return (
    <>
      <div className="header-container">
        <h1 className="emph1">EMPLOYEE DIRECTORY</h1>
      </div>
      <div className="header-line"></div>

      <div className="employee-container">
        <form className="form-section" onSubmit={handleAddEmployee}>
          <input
            type="text"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <select
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button type="submit">Add Employee</button>
        </form>

        <div className="employee-list">
          {employees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            employees.map((emp) => (
              <div key={emp.id} className="employee-card">
                {editId === emp.id ? (
                  <>
                    <input name="employeeId" value={editForm.employeeId} onChange={handleEditChange} required />
                    <input name="name" value={editForm.name} onChange={handleEditChange} required />
                    <select name="department" value={editForm.department} onChange={handleEditChange} required>
                      <option value="">Select Department</option>
                      {departments.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                    <select name="role" value={editForm.role} onChange={handleEditChange} required>
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <input name="email" value={editForm.email} onChange={handleEditChange} type="email" required />
                    <input name="password" value={editForm.password} onChange={handleEditChange} type="password" required />
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <div className="edit-buttons">
                      <button onClick={() => handleEditSave(emp.id)} className="save-btn">Save</button>
                      <button onClick={handleEditCancel} className="cancel-btn">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><b>Name:</b> {emp.name}</p>
                    <p><b>Employee ID:</b> {emp.employeeId}</p>
                    <p><b>Department:</b> {emp.department}</p>
                    <p><b>Role:</b> {emp.role.toUpperCase()}</p>
                    <p><b>Email:</b> {emp.email}</p>
                    <p><b>Status:</b> <span className={`status ${emp.status.toLowerCase()}`}>{emp.status}</span></p>
                    <div className="action-buttons">
                      <button onClick={() => handleEditClick(emp)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(emp.id)} className="delete-btn">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Employee;
