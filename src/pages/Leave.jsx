import React, { useState, useEffect } from "react";
import "./Leave.css";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    employee: "",
    department: "",
    type: "",
    from: "",
    to: "",
    status: "Pending"
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    employeeId: "",
    employee: "",
    department: "",
    type: "",
    from: "",
    to: "",
    status: "Pending"
  });

  const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];
  const leaveTypes = ["Annual", "Sick", "Casual", "Maternity", "Paternity"];

  const [loggedInUserName, setLoggedInUserName] = useState("");

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("auth"));
    if (authUser && authUser.username) setLoggedInUserName(authUser.username);
    else if (authUser && authUser.name) setLoggedInUserName(authUser.name);

    const storedLeaves = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(storedLeaves);

    const savedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(savedEmployees);
  }, []);

  const handleAddLeave = (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.employee || !form.department || !form.type || !form.from || !form.to) return;

    const newLeave = { ...form, id: Date.now() };
    const updatedLeaves = [...leaves, newLeave];

    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setLeaves(updatedLeaves);

    setForm({
      employeeId: "",
      employee: "",
      department: "",
      type: "",
      from: "",
      to: "",
      status: "Pending"
    });
  };

  const handleDelete = (id) => {
    const updatedLeaves = leaves.filter(l => l.id !== id);
    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setLeaves(updatedLeaves);
  };

  const handleEditClick = (l) => {
    setEditId(l.id);
    setEditForm({ ...l });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleEditSave = (id) => {
    const updatedLeaves = leaves.map(l => (l.id === id ? { ...editForm } : l));
    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setLeaves(updatedLeaves);
    setEditId(null);
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleEmployeeSelect = (e) => {
    const selectedId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.employeeId === selectedId);
    if (selectedEmployee) {
      setForm(f => ({
        ...f,
        employeeId: selectedEmployee.employeeId,
        employee: selectedEmployee.name,
        department: selectedEmployee.department
      }));
    } else {
      setForm(f => ({
        ...f,
        employeeId: "",
        employee: "",
        department: ""
      }));
    }
  };

  return (
    <div className="leave-container">
      <header className="leave-header">
        <h1>Leave Requests</h1>
        {loggedInUserName && <p className="welcome-user">Welcome, {loggedInUserName}</p>}
      </header>

      <form className="form-section" onSubmit={handleAddLeave}>
        <select
          value={form.employeeId}
          onChange={handleEmployeeSelect}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>
        <input
          placeholder="Employee Name"
          value={form.employee}
          readOnly
          required
        />
        <input
          placeholder="Department"
          value={form.department}
          readOnly
          required
        />
        <select
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          required
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          type="date"
          value={form.from}
          onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
          required
        />
        <input
          type="date"
          value={form.to}
          onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
          required
        />
        <select
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <button type="submit">Add Leave</button>
      </form>

      <div className="leave-list">
        {leaves.length > 0 ? (
          leaves.map(l => {
            const emp = employees.find(e => e.employeeId === l.employeeId);
            return (
              <div key={l.id} className="leave-card">
                {editId === l.id ? (
                  <>
                    <select
                      name="employeeId"
                      value={editForm.employeeId}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                          {emp.name} ({emp.employeeId})
                        </option>
                      ))}
                    </select>
                    <input
                      name="employee"
                      placeholder="Employee Name"
                      value={editForm.employee}
                      onChange={handleEditChange}
                      required
                      readOnly
                    />
                    <input
                      name="department"
                      placeholder="Department"
                      value={editForm.department}
                      onChange={handleEditChange}
                      required
                      readOnly
                    />
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      name="from"
                      value={editForm.from}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      type="date"
                      name="to"
                      value={editForm.to}
                      onChange={handleEditChange}
                      required
                    />
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                    >
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                    <div className="edit-buttons">
                      <button onClick={() => handleEditSave(l.id)} className="save-btn">
                        Save
                      </button>
                      <button onClick={handleEditCancel} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div><b>ID:</b> {emp ? emp.employeeId : l.employeeId}</div>
                    <div><b>Employee:</b> {emp ? emp.name : l.employee}</div>
                    <div><b>Department:</b> {emp ? emp.department : l.department}</div>
                    <div><b>Leave Type:</b> {l.type}</div>
                    <div><b>From:</b> {l.from}</div>
                    <div><b>To:</b> {l.to}</div>
                    <div><b>Status:</b> <span className={`status ${l.status.toLowerCase()}`}>{l.status}</span></div>
                    <div className="action-buttons">
                      <button onClick={() => handleEditClick(l)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(l.id)} className="delete-btn">Delete</button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>No leave requests found.</p>
        )}
      </div>
    </div>
  );
}

export default Leave;
