import React, { useEffect, useState } from "react";
import "./ManagerLeaveRequest.css";

function ManagerLeaveRequest() {
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) setUser(auth);

    const savedLeaves = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(savedLeaves);

    const emps = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(emps);
  }, []);

  useEffect(() => {
    if (!user) {
      setFilteredLeaves([]);
      return;
    }
    const deptLeaves = leaves.filter((lv) => lv.department === user.department);
    setFilteredLeaves(deptLeaves);
  }, [leaves, user]);

  const handleStatusChange = (id, newStatus) => {
    let remark = "";
    remark = window.prompt("Enter remark (optional):") || "";

    const updated = leaves.map(lv => {
      if (lv.id === id) {
        return { ...lv, status: newStatus, managerRemark: remark };
      }
      return lv;
    });

    setLeaves(updated);
    localStorage.setItem("leaves", JSON.stringify(updated));
  };

  return (
    <div className="mleave-container">
      <h1>Leave Requests</h1>

      <table className="mleave-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>Manager Remark</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.length === 0 ? (
            <tr>
              <td colSpan={11} style={{ textAlign: "center" }}>
                No leave requests.
              </td>
            </tr>
          ) : (
            filteredLeaves
              .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
              .map(lv => {
                const emp = employees.find(e => e.employeeId === lv.employeeId);
                return (
                  <tr key={lv.id}>
                    <td>{emp ? `${emp.name} (${emp.employeeId})` : lv.employeeId}</td>
                    <td>{emp ? emp.role.toUpperCase() : "-"}</td>
                    <td>{emp ? emp.department : "-"}</td>
                    <td>{lv.type}</td>
                    <td>{lv.from}</td>
                    <td>{lv.to}</td>
                    <td>{lv.reason}</td>
                    <td>
                      <span className={`status ${lv.status.toLowerCase()}`}>
                        {lv.status}
                      </span>
                    </td>
                    <td>{new Date(lv.requestedAt).toLocaleString()}</td>
                    <td>{lv.managerRemark || "-"}</td>
                    <td>
                      <select
                        value={lv.status}
                        onChange={(e) => handleStatusChange(lv.id, e.target.value)}
                        className={`status-select ${lv.status.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                );
              })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerLeaveRequest;
