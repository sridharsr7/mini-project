import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [payrollCount, setPayrollCount] = useState(0);
  const [leavesPending, setLeavesPending] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [userName, setUserName] = useState("");

  const [chartData, setChartData] = useState([]);

  const loadDashboardData = () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const user = JSON.parse(auth);
      setUserName(user.name || user.username || user.email || "User");
    }

    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const payrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    setEmployeeCount(employees.length);

    const activePayrolls = payrolls.filter((p) => p.status === "Paid" || p.status === "Pending");
    setPayrollCount(activePayrolls.length);

    const pendingLeaves = leaves.filter((l) => l.status === "Pending");
    setLeavesPending(pendingLeaves.length);
    const pendingTasks = tasks.filter(task => task.status !== "Completed");
    setPendingTasksCount(pendingTasks.length);

    const recentLeavesData = [...leaves]
      .sort((a, b) => new Date(b.from) - new Date(a.from))
      .slice(0, 5)
      .map((lv) => {
        const emp = employees.find((e) => e.employeeId === lv.employeeId);
        return {
          ...lv,
          displayName: emp
            ? `${emp.name} (${emp.employeeId})`
            : lv.employee || lv.employeeId || "-",
          role: emp ? (emp.role ? emp.role.toUpperCase() : "-") : "-",
          department: emp ? emp.department : "-",
        };
      });

    setRecentLeaves(recentLeavesData);

    setChartData([
      { name: "Total Employees", value: employees.length },
      { name: "Active Payrolls", value: activePayrolls.length },
      { name: "Leaves Pending", value: pendingLeaves.length },
      { name: "Pending Tasks", value: pendingTasks.length },
    ]);
  };

  useEffect(() => {
    loadDashboardData();

    const handleStorageChange = (event) => {
      if (["employees", "payrolls", "leaves", "auth"].includes(event.key)) {
        loadDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">Dolphin Colours</div>
        <nav className="sidebar-nav">
          <a href="/" className="nav-link active">Home</a>
          <a href="/employee" className="nav-link">Employee</a>
          <a href="/payroll" className="nav-link">Payroll</a>
          <a href="/leave" className="nav-link">Leave</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/report" className="nav-link">Report</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <div className="user-info">
            <span className="user-name">Welcome, admin {userName}</span>
          </div>
        </header>

        <section className="cards-section">
          <div className="card">
            <h3>Total Employees</h3>
            <p className="card-value">{employeeCount}</p>
          </div>
          <div className="card">
            <h3>Active Payrolls</h3>
            <p className="card-value">{payrollCount}</p>
          </div>
          <div className="card">
            <h3>Leaves Pending</h3>
            <p className="card-value">{leavesPending}</p>
          </div>
          <div className="card">
            <h3>Pending Tasks</h3>
            <p className="card-value">{pendingTasksCount}</p>
          </div>
        </section>

        <section className="charts-section">
          <div className="chart-center-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="table-section">
          <h3>Recent Leave Requests</h3>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaves.length > 0 ? (
                recentLeaves.map(
                  ({ id, displayName, role, department, type, from, to, status }) => (
                    <tr key={id}>
                      <td>{displayName}</td>
                      <td>{role}</td>
                      <td>{department}</td>
                      <td>{type}</td>
                      <td>{from}</td>
                      <td>{to}</td>
                      <td>{status}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No recent leave requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
