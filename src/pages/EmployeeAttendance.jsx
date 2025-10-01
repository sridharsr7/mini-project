import React, { useEffect, useState } from "react";
import "./Attendance.css";

function EmployeeAttendance() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("auth"));
    setUser(u);
    const att = JSON.parse(localStorage.getItem("attendance")) || [];
    setAttendance(att);
    if (u) {
      const today = new Date().toISOString().slice(0, 10);
      setTodayRecord(att.find((a) => a.employeeId === u.employeeId && a.date === today));
    }
  }, []);

  const handleCheckIn = () => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    if (todayRecord?.checkIn) return;
    const now = new Date().toLocaleTimeString();
    const record = {
      id: Date.now(),
      employeeId: user.employeeId,
      name: user.name,
      department: user.department,
      role: user.role,
      date: today,
      checkIn: now,
      checkOut: "",
    };
    const updated = [...attendance, record];
    setAttendance(updated);
    localStorage.setItem("attendance", JSON.stringify(updated));
    setTodayRecord(record);
  };

  const handleCheckOut = () => {
    if (!user || !todayRecord || todayRecord.checkOut) return;
    const now = new Date().toLocaleTimeString();
    const updated = attendance.map((a) =>
      a.id === todayRecord.id ? { ...a, checkOut: now } : a
    );
    setAttendance(updated);
    localStorage.setItem("attendance", JSON.stringify(updated));
    setTodayRecord({ ...todayRecord, checkOut: now });
  };

  const userDays = attendance.filter((a) => a.employeeId === user?.employeeId);

  const filteredDays = selectedDate
    ? userDays.filter((a) => a.date === selectedDate)
    : userDays;

  return (
    <div className="attendance-container">
      <h2>My Attendance</h2>
      <div className="attendance-actions">
        <button className="att-btn" disabled={todayRecord?.checkIn} onClick={handleCheckIn}>
          {todayRecord?.checkIn ? "Checked In" : "Check In"}
        </button>
        <button className="att-btn" disabled={!todayRecord?.checkIn || todayRecord?.checkOut} onClick={handleCheckOut}>
          {todayRecord?.checkOut ? "Checked Out" : "Check Out"}
        </button>
      </div>
      <input
        className="att-search"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        placeholder="Select a date"
      />
      <table className="att-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          {filteredDays.length === 0 ? (
            <tr><td colSpan={3}>No attendance found.</td></tr>
          ) : (
            filteredDays.slice().sort((a, b) => b.date.localeCompare(a.date)).map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.checkIn || "-"}</td>
                <td>{a.checkOut || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeAttendance;
