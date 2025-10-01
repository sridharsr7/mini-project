import React, { useEffect, useState } from "react";
import "./EmployeeLeaveRequest.css";

function EmployeeLeaveRequest() {
  const [user, setUser] = useState(null);
  const [allLeaves, setAllLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    type: "",
    from: "",
    to: "",
    reason: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isHR = user?.role === "hr";
  const isEmployee = user && user.role === "employee";
  const department = user?.department;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("auth"));
    if (storedUser) setUser(storedUser);

    const storedLeaves = JSON.parse(localStorage.getItem("leaves")) || [];
    setAllLeaves(storedLeaves);
  }, []);

  useEffect(() => {
    if (!user) return setFilteredLeaves([]);

    if (isEmployee) {
      setFilteredLeaves(allLeaves.filter(lv => lv.employeeId === user.employeeId));
    } else if (isHR) {
      setFilteredLeaves(allLeaves.filter(lv => lv.department === department));
    }
  }, [allLeaves, user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const hasOverlap = (employeeId, start, end) => {
    return filteredLeaves.some(lv =>
      lv.employeeId === employeeId &&
      (new Date(start) <= new Date(lv.to) && new Date(end) >= new Date(lv.from))
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { employeeId, name, type, from, to, reason } = form;

    if ((isHR && (!employeeId || !name)) || !type || !from || !to || !reason) {
      setError("Please fill all fields.");
      return;
    }
    if (new Date(from) > new Date(to)) {
      setError("From date cannot be after To date.");
      return;
    }
    if (hasOverlap(employeeId || user.employeeId, from, to)) {
      setError("Leave overlaps with existing requests.");
      return;
    }

    const newLeave = {
      id: Date.now(),
      employeeId: isHR ? employeeId : user.employeeId,
      name: isHR ? name : user.name,
      department: isHR ? (allLeaves.find(lv => lv.employeeId === employeeId)?.department || "") : department,
      type,
      from,
      to,
      reason,
      status: "Pending",
      managerRemark: "",
      requestedAt: new Date().toISOString(),
    };

    const updatedLeaves = [newLeave, ...allLeaves];
    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setAllLeaves(updatedLeaves);
    setForm({ employeeId: "", name: "", type: "", from: "", to: "", reason: "" });
    setSuccess("Leave request submitted successfully.");
  };

  const handleDelete = id => {
    const updatedLeaves = allLeaves.filter(lv => lv.id !== id);
    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setAllLeaves(updatedLeaves);
  };

  return (
    <div className="eleave-container">
      <div className="eleave-header">
        <h1>Leave Requests</h1>
        <span className="eleave-welcome">{user ? `Welcome, ${user.name}` : ""}</span>
      </div>

      {(isEmployee || isHR) && (
        <form className="eleave-form" onSubmit={handleSubmit}>
          {error && <div className="eleave-error">{error}</div>}
          {success && <div className="eleave-success">{success}</div>}

          {isHR && (
            <>
              <label>
                Employee ID
                <input
                  type="text"
                  name="employeeId"
                  placeholder="Employee ID"
                  value={form.employeeId}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Employee Name
                <input
                  type="text"
                  name="name"
                  placeholder="Employee Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}

          <label>
            Leave Type
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Paternity leave</option>
              <option>Marriage leave</option>
              <option>Maternity leave</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            From
            <input type="date" name="from" value={form.from} onChange={handleChange} required />
          </label>

          <label>
            To
            <input type="date" name="to" value={form.to} onChange={handleChange} required />
          </label>

          <label>
            Reason for Leave
            <textarea name="reason" value={form.reason} onChange={handleChange} required />
          </label>

          <button type="submit" className="eleave-btn">Submit Leave Request</button>
        </form>
      )}

      <section className="eleave-table-section">
        <h2>{isEmployee ? "Your Leave Requests" : "Department Leave Requests"}</h2>
        <table className="eleave-table">
          <thead>
            <tr>
              {!isEmployee && <th>Employee Name</th>}
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Manager Remark</th>
              {isEmployee && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan={isEmployee ? 8 : 8} style={{ textAlign: "center" }}>No leave requests found.</td>
              </tr>
            ) : (
              filteredLeaves
                .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
                .map(lv => (
                  <tr key={lv.id}>
                    {!isEmployee && <td>{lv.name}</td>}
                    <td>{lv.type}</td>
                    <td>{lv.from}</td>
                    <td>{lv.to}</td>
                    <td>{lv.reason}</td>
                    <td><span className={`status ${lv.status.toLowerCase()}`}>{lv.status}</span></td>
                    <td>{new Date(lv.requestedAt).toLocaleString()}</td>
                    <td>{lv.managerRemark || "-"}</td>
                    {isEmployee && lv.status.toLowerCase() === "pending" && (
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(lv.id)}
                          title="Delete pending leave request"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default EmployeeLeaveRequest;
