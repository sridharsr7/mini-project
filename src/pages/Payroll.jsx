import React, { useState, useEffect } from "react";
import "./Payroll.css";

function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    department: "",
    amount: "",
    status: "Unpaid",
    paidOn: "",
    remarks: ""
  });

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedPayrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
    setPayrolls(savedPayrolls);
    const savedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(savedEmployees);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeSelect = e => {
    const selectedId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.employeeId === selectedId);
    setForm(f => ({
      ...f,
      id: selectedEmployee ? selectedEmployee.employeeId : "",
      name: selectedEmployee ? selectedEmployee.name : "",
      department: selectedEmployee ? selectedEmployee.department : ""
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.id || !form.name || !form.department || !form.amount || !form.paidOn) return;
    let updatedPayrolls;
    if (editIndex !== null) {
      updatedPayrolls = [...payrolls];
      updatedPayrolls[editIndex] = { ...form, amount: parseFloat(form.amount) };
    } else {
      updatedPayrolls = [...payrolls, { ...form, amount: parseFloat(form.amount) }];
    }
    localStorage.setItem("payrolls", JSON.stringify(updatedPayrolls));
    setPayrolls(updatedPayrolls);
    setForm({ id: "", name: "", department: "", amount: "", status: "Unpaid", paidOn: "", remarks: "" });
    setEditIndex(null);
  };

  const handleEditClick = (item, index) => {
    setForm(item);
    setEditIndex(index);
  };

  const handleDelete = index => {
    if (!window.confirm("Are you sure you want to delete this payroll record?")) return;
    const updatedPayrolls = [...payrolls];
    updatedPayrolls.splice(index, 1);
    localStorage.setItem("payrolls", JSON.stringify(updatedPayrolls));
    setPayrolls(updatedPayrolls);
    if (editIndex === index) {
      setForm({ id: "", name: "", department: "", amount: "", status: "Unpaid", paidOn: "", remarks: "" });
      setEditIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setForm({ id: "", name: "", department: "", amount: "", status: "Unpaid", paidOn: "", remarks: "" });
    setEditIndex(null);
  };

  return (
    <div className="payroll-container">
      <h2>Admin Payroll Management</h2>
      <form className="payroll-form" onSubmit={handleSubmit}>
        <select
          value={form.id}
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
          type="text"
          name="name"
          value={form.name}
          placeholder="Employee Name"
          readOnly
        />
        <input
          type="text"
          name="department"
          value={form.department}
          placeholder="Department"
          readOnly
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select 
          name="status" 
          value={form.status} 
          onChange={handleChange}
          required
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <input
          type="date"
          name="paidOn"
          value={form.paidOn}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="remarks"
          placeholder="Optional"
          value={form.remarks}
          onChange={handleChange}
        />
        <button type="submit" className="add-payroll-btn">
          {editIndex !== null ? "Update Payroll" : "Add Payroll"}
        </button>
        {editIndex !== null && (
          <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Name (ID)</th>
            <th>Role</th>
            <th>Department</th>
            <th>Amount (₹)</th>
            <th>Paid On</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.length > 0 ? (
            payrolls.map((p, idx) => {
              const emp = employees.find(
                e => e.employeeId === p.id || e.employeeId === p.employeeId
              );
              return (
                <tr key={idx}>
                  <td>{emp ? `${emp.name} (${emp.employeeId})` : (p.name ? `${p.name} (${p.id || p.employeeId})` : `(${p.id || p.employeeId})`)}</td>
                  <td>{emp ? emp.role.toUpperCase() : "-"}</td>
                  <td>{emp ? emp.department : "-"}</td>
                  <td>₹ {p.amount}</td>
                  <td>{p.paidOn}</td>
                  <td>{p.status}</td>
                  <td>{p.remarks}</td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEditClick(p, idx)}>Edit</button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="8" style={{ textAlign: "center" }}>No payrolls found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Payroll;
