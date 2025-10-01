import React, { useEffect, useState } from "react";
import "./ManagerDashboard.css"; 

function ManagerDashboard() {
  const [manager, setManager] = useState(null);
  const [teamLeavesCount, setTeamLeavesCount] = useState(0);
  const [teamAttendanceCount, setTeamAttendanceCount] = useState(0);
  const [teamPayrollsCount, setTeamPayrollsCount] = useState(0);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [currentMonthName, setCurrentMonthName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) return;
    const user = JSON.parse(auth);
    setManager(user);

    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        password: user.password || ""
      });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    setCurrentMonthName(now.toLocaleString("default", { month: "long" }));

    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const payrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    const teamEmployeeIds = employees
      .filter((emp) => emp.department === user.department)
      .map((emp) => emp.employeeId);

    const teamLeaves = leaves.filter((lv) => {
      const fromDate = new Date(lv.from);
      return (
        teamEmployeeIds.includes(lv.employeeId) &&
        lv.status === "Approved" &&
        fromDate.getFullYear() === currentYear &&
        fromDate.getMonth() === currentMonth
      );
    });
    setTeamLeavesCount(teamLeaves.length);

    const teamAttendance = attendance.filter((a) => {
      const aDate = new Date(a.date);
      return (
        teamEmployeeIds.includes(a.employeeId) &&
        a.checkIn &&
        aDate.getFullYear() === currentYear &&
        aDate.getMonth() === currentMonth
      );
    });
    setTeamAttendanceCount(teamAttendance.length);

    const teamPayroll = payrolls.filter((p) => {
      const pDate = new Date(p.paidOn);
      const emp = employees.find((e) => e.employeeId === p.employeeId);
      return (
        emp &&
        emp.department === user.department &&
        pDate.getFullYear() === currentYear &&
        pDate.getMonth() === currentMonth
      );
    });
    setTeamPayrollsCount(teamPayroll.length);

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const departmentEmployeeIds = employees
      .filter(emp => emp.department === user.department)
      .map(emp => emp.employeeId);
    const pendingTasks = tasks.filter(task =>
      departmentEmployeeIds.includes(task.assignedTo) && task.status !== "Completed"
    );
    setPendingTaskCount(pendingTasks.length);
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!editForm.name || !editForm.email) {
      alert("Name and email are required.");
      return;
    }
    const allEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    const updatedEmployees = allEmployees.map(emp => {
      if (emp.employeeId === manager.employeeId) {
        return {
          ...emp,
          name: editForm.name,
          email: editForm.email,
          password: editForm.password
        };
      }
      return emp;
    });
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map(usr => {
      if (usr.employeeId === manager.employeeId) {
        return {
          ...usr,
          name: editForm.name,
          email: editForm.email,
          password: editForm.password,
        };
      }
      return usr;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const savedUser = updatedEmployees.find(emp => emp.employeeId === manager.employeeId);
    localStorage.setItem("auth", JSON.stringify(savedUser));

    setManager(savedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: manager.name || "",
      email: manager.email || "",
      password: manager.password || ""
    });
    setIsEditing(false);
  };

  if (!manager)
    return (
      <div className="empdash-container">
        <h1>Manager Dashboard</h1>
        <p>Please log in to see manager dashboard.</p>
      </div>
    );

  return (
    <div className="empdash-container">
      <header className="empdash-header-horizontal">
        <h1 className="empdash-title">Manager Dashboard</h1>
        <div className="empdash-right-vertical">
          <span className="empdash-welcome">{`Welcome, ${manager.name}`}</span>
        </div>
      </header>

      <section className="empdash-summary-cards">
        <article className="emp-card">
          <h3>Team Leave Requests ({currentMonthName})</h3>
          <p className="emp-card-value">{teamLeavesCount}</p>
        </article>

        <article className="emp-card">
          <h3>Team Attendance ({currentMonthName})</h3>
          <p className="emp-card-value">{teamAttendanceCount}</p>
        </article>

        <article className="emp-card">
          <h3>Team Payrolls ({currentMonthName})</h3>
          <p className="emp-card-value">{teamPayrollsCount}</p>
        </article>

        <article className="emp-card">
          <h3>Pending Tasks</h3>
          <p className="emp-card-value">{pendingTaskCount}</p>
        </article>
      </section>

      <h2>Your Details</h2>

      <div className="empdash-table-wrapper">
        <table className="empdash-table" aria-label="Manager Details">
          <tbody>
            <tr><th>Name</th><td>{manager.name}</td></tr>
            <tr><th>Email</th><td>{manager.email}</td></tr>
            <tr><th>Department</th><td>{manager.department}</td></tr>
            <tr><th>Role</th><td>{manager.role.toUpperCase()}</td></tr>
          </tbody>
        </table>
      </div>

      {isEditing ? (
        <div className="profile-edit-form">
          <h2>Edit Profile</h2>
          <label>
            Name:
            <input name="name" value={editForm.name} onChange={handleFieldChange} />
          </label>
          <label>
            Email:
            <input name="email" value={editForm.email} onChange={handleFieldChange} type="email" />
          </label>
          <label>
            Password:
            <input name="password" value={editForm.password} onChange={handleFieldChange} type="password" />
          </label>
          <div className="edit-buttons">
            <button onClick={handleSaveProfile} className="save-btn">Save</button>
            <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} className="edit-profile-btn">Edit Profile</button>
      )}
    </div>
  );
}

export default ManagerDashboard;
