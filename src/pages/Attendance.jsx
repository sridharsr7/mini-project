import React, { useState, useEffect } from "react";
import "./Attendance.css";

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  
  useEffect(() => {
    const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const savedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setAttendanceRecords(savedAttendance);
    setEmployees(savedEmployees);
  }, []);

  
  const filteredAttendance = attendanceRecords.filter(record => {
    const matchesId = record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = searchDate === "" || record.date === searchDate;
    return matchesId && matchesDate;
  });

  const handleEditClick = (record) => {
    setEditingId(record.id);
    setEditCheckIn(record.checkIn || "");
    setEditCheckOut(record.checkOut || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditCheckIn("");
    setEditCheckOut("");
  };

  const handleSave = () => {
    const updatedRecords = attendanceRecords.map(record =>
      record.id === editingId ? { ...record, checkIn: editCheckIn, checkOut: editCheckOut } : record
    );
    setAttendanceRecords(updatedRecords);
    localStorage.setItem("attendance", JSON.stringify(updatedRecords));
    setEditingId(null);
    setEditCheckIn("");
    setEditCheckOut("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    const updatedRecords = attendanceRecords.filter(record => record.id !== id);
    setAttendanceRecords(updatedRecords);
    localStorage.setItem("attendance", JSON.stringify(updatedRecords));
    if (editingId === id) {
      handleCancel();
    }
  };

  return (
    <div className="attendance-container">
      <h2>Admin - All Employees Attendance</h2>

      <div style={{ marginBottom: 16, display: "flex", gap: "12px" }}>
        <input
          type="text"
          placeholder="Search by Employee ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="att-search"
        />
        <input
          type="date"
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
          className="att-search"
        />
      </div>

      <table className="att-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>No attendance records found.</td>
            </tr>
          ) : (
            filteredAttendance
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
              .map(record => {
                const emp = employees.find(e => e.employeeId === record.employeeId);
                return (
                  <tr key={record.id}>
                    <td>{emp ? `${emp.name} (${emp.employeeId})` : record.employeeId}</td>
                    <td>{emp ? emp.role.toUpperCase() : "-"}</td>
                    <td>{record.date}</td>
                    <td>
                      {editingId === record.id ? (
                        <input
                          type="text"
                          value={editCheckIn}
                          onChange={e => setEditCheckIn(e.target.value)}
                          className="att-table-input"
                        />
                      ) : (
                        record.checkIn || "-"
                      )}
                    </td>
                    <td>
                      {editingId === record.id ? (
                        <input
                          type="text"
                          value={editCheckOut}
                          onChange={e => setEditCheckOut(e.target.value)}
                          className="att-table-input"
                        />
                      ) : (
                        record.checkOut || "-"
                      )}
                    </td>
                    <td>
                      {editingId === record.id ? (
                        <>
                          <button className="edit-btn" onClick={handleSave}>Save</button>
                          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => handleEditClick(record)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(record.id)}>Delete</button>
                        </>
                      )}
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

export default Attendance;
