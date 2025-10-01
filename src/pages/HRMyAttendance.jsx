import React, { useEffect, useState } from "react";
import "./HRMyAttendance.css";

function HRMyAttendance() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filter, setFilter] = useState({ month: "", year: "" });

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      setUser(auth);
    }

    const allAttendance = JSON.parse(localStorage.getItem("attendance")) || [];
    setAttendance(allAttendance);

    const now = new Date();
    setFilter({
      month: now.getMonth(),
      year: now.getFullYear(),
    });
  }, []);

  useEffect(() => {
    if (user) {
      const userAttendance = attendance.filter(
        (a) => a.employeeId === user.employeeId
      );

      const filtered = userAttendance.filter((a) => {
        const date = new Date(a.date);
        const matchMonth = filter.month === "" || date.getMonth() === parseInt(filter.month);
        const matchYear = filter.year === "" || date.getFullYear() === parseInt(filter.year);
        return matchMonth && matchYear;
      });

      setFilteredAttendance(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, [user, attendance, filter]);

  const handleFilterChange = (e) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="hr-my-attendance-container">
      <h1>My Attendance</h1>
      <div className="hr-my-attendance-filters">
        <select name="month" value={filter.month} onChange={handleFilterChange}>
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select name="year" value={filter.year} onChange={handleFilterChange}>
          <option value="">All Years</option>
          {getYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <table className="hr-my-attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record, index) => {
              const status = record.checkIn ? "Present" : "Absent";
              return (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.checkIn || "-"}</td>
                  <td>{record.checkOut || "-"}</td>
                  <td>
                    <span className={`status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No attendance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HRMyAttendance;