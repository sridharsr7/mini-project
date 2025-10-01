import React, { useState, useEffect } from "react";
import "./Report.css";

function Report() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({
    totalLeaves: 0,
    completedTasks: 0,
    paidPayrolls: 0,
    presentToday: 0,
  });
  const [filter, setFilter] = useState("all");
  const [loggedInUserName, setLoggedInUserName] = useState("");

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("adminAuth"));
    if (authUser && authUser.username) setLoggedInUserName(authUser.username);
    else if (authUser && authUser.name) setLoggedInUserName(authUser.name);

    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const payrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const totalLeaves = leaves.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const paidPayrolls = payrolls.filter(p => p.status === "Paid").length;
    const presentToday = attendance.filter(a => a.date === today && a.checkIn).length;

    setSummary({ totalLeaves, completedTasks, paidPayrolls, presentToday });

    const generatedReports = [];

    const approvedLeaves = leaves.filter(l => l.status === "Approved").length;
    generatedReports.push({
      id: 1,
      title: "Leave Management",
      date: currentMonth,
      value: `${approvedLeaves} / ${totalLeaves} Approved`,
      status: leaves.some(l => l.status === "Pending") ? "Ongoing" : "Completed",
    });

    generatedReports.push({
      id: 2,
      title: "Task Completion",
      date: currentMonth,
      value: `${completedTasks} / ${tasks.length} Done`,
      status: tasks.length > completedTasks ? "Ongoing" : "Completed",
    });

    generatedReports.push({
      id: 3,
      title: "Payroll Processing",
      date: currentMonth,
      value: `${paidPayrolls} / ${payrolls.length} Paid`,
      status: payrolls.length > paidPayrolls ? "Ongoing" : "Completed",
    });

    generatedReports.push({
      id: 4,
      title: "Daily Attendance",
      date: today,
      value: `${presentToday} / ${employees.length} Present`,
      status: "Ongoing",
    });

    setReports(generatedReports);
  }, []);

  const filteredReports = reports.filter(r =>
    filter === "all" ? true : r.status.toLowerCase() === filter
  );

  return (
    <div className="reports-container">
      <header className="reports-header">
        <div className="header-content">
          <h1>Company Reports</h1>
          {loggedInUserName && <p className="welcome-user">Welcome, {loggedInUserName}</p>}
        </div>
      </header>

      <section className="reports-summary">
        <div className="summary-card">
          <h3>Total Leave Requests</h3>
          <p>{summary.totalLeaves}</p>
        </div>
        <div className="summary-card">
          <h3>Completed Tasks</h3>
          <p>{summary.completedTasks}</p>
        </div>
        <div className="summary-card">
          <h3>Paid Payrolls</h3>
          <p>{summary.paidPayrolls}</p>
        </div>
        <div className="summary-card">
          <h3>Present Today</h3>
          <p>{summary.presentToday}</p>
        </div>
      </section>

      <section className="reports-filter">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="delayed">Delayed</option>
        </select>
      </section>

      <section className="reports-table-section">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.date}</td>
                <td>{r.value}</td>
                <td className={r.status.toLowerCase()}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Report;
