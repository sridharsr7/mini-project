import React, { useEffect, useState } from "react";
import "./Attendance.css";

function HRAttendance() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("auth"));
    setUser(u);
    setAttendance(JSON.parse(localStorage.getItem("attendance")) || []);
  }, []);

  const deptAttendance = attendance.filter((a) => a.department === user?.department);

  const filteredAttendance = deptAttendance.filter((a) => {
    const matchesDate = selectedDate ? a.date === selectedDate : true;
    const matchesId = searchId ? a.employeeId.toLowerCase().includes(searchId.toLowerCase()) : true;
    const matchesName = searchName ? a.name.toLowerCase().includes(searchName.toLowerCase()) : true;
    return matchesDate && matchesId && matchesName;
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
    const updatedRecords = attendance.map((a) =>
      a.id === editingId ? { ...a, checkIn: editCheckIn, checkOut: editCheckOut } : a
    );
    setAttendance(updatedRecords);
    localStorage.setItem("attendance", JSON.stringify(updatedRecords));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updatedRecords = attendance.filter((a) => a.id !== id);
    setAttendance(updatedRecords);
    localStorage.setItem("attendance", JSON.stringify(updatedRecords));
    if (editingId === id) {
      setEditingId(null);
      setEditCheckIn("");
      setEditCheckOut("");
    }
  };

  return (
    <div className="attendance-container">
      <h2>Attendance (Department: {user?.department})</h2>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <input
          className="att-search"
          type="text"
          placeholder="Search by Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          className="att-search"
          type="text"
          placeholder="Search by Employee Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          className="att-search"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Select a date"
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
              <td colSpan={6}>No attendance found.</td>
            </tr>
          ) : (
            filteredAttendance
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.name} ({a.employeeId})
                  </td>
                  <td>{a.role}</td>
                  <td>{a.date}</td>
                  <td>
                    {editingId === a.id ? (
                      <input
                        type="text"
                        value={editCheckIn}
                        onChange={(e) => setEditCheckIn(e.target.value)}
                        className="att-table-input"
                      />
                    ) : (
                      a.checkIn || "-"
                    )}
                  </td>
                  <td>
                    {editingId === a.id ? (
                      <input
                        type="text"
                        value={editCheckOut}
                        onChange={(e) => setEditCheckOut(e.target.value)}
                        className="att-table-input"
                      />
                    ) : (
                      a.checkOut || "-"
                    )}
                  </td>
                  <td>
                    {editingId === a.id ? (
                      <>
                        <button className="edit-btn" onClick={handleSave}>
                          Save
                        </button>
                        <button className="cancel-btn" onClick={handleCancel}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEditClick(a)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(a.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HRAttendance;
