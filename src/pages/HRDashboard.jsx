import React, { useEffect, useState, useRef } from "react";
import "./HRDashboard.css";

function HRDashboard() {
  const [hrUser, setHrUser] = useState(null);
  const [leaveRequestsCount, setLeaveRequestsCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [payrollsCount, setPayrollsCount] = useState(0);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [currentMonthName, setCurrentMonthName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) return;
    const user = JSON.parse(auth);
    setHrUser(user);

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
    const leavesThisMonth = leaves.filter((lv) => {
      if (
        lv.department !== user.department ||
        new Date(lv.from).getFullYear() !== currentYear ||
        new Date(lv.from).getMonth() !== currentMonth
      )
        return false;
      return true;
    });
    setLeaveRequestsCount(leavesThisMonth.length);

    
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const attendanceThisMonth = attendance.filter((a) => {
      if (
        a.department !== user.department ||
        !a.checkIn ||
        new Date(a.date).getFullYear() !== currentYear ||
        new Date(a.date).getMonth() !== currentMonth
      )
        return false;
      return true;
    });
    setAttendanceCount(attendanceThisMonth.length);

  
    const payrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
    const payrollsThisMonth = payrolls.filter((p) => {
      
      const employees = JSON.parse(localStorage.getItem("employees")) || [];
      const emp = employees.find((e) => e.employeeId === p.employeeId);
      if (
        !emp ||
        emp.department !== user.department ||
        new Date(p.paidOn).getFullYear() !== currentYear ||
        new Date(p.paidOn).getMonth() !== currentMonth
      )
        return false;
      return true;
    });
    setPayrollsCount(payrollsThisMonth.length);

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const departmentEmployeeIds = (JSON.parse(localStorage.getItem("employees")) || [])
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
      if (emp.employeeId === hrUser.employeeId) {
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
      if (usr.employeeId === hrUser.employeeId) {
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

    const savedUser = updatedEmployees.find(emp => emp.employeeId === hrUser.employeeId);
    localStorage.setItem("auth", JSON.stringify(savedUser));

    setHrUser(savedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: hrUser.name || "",
      email: hrUser.email || "",
      password: hrUser.password || ""
    });
    setIsEditing(false);
  };

  if (!hrUser)
    return (
      <div className="empdash-container">
        <h1>HR Dashboard</h1>
        <p>Please log in to see the HR dashboard.</p>
      </div>
    );

  return (
    <div className="empdash-container">
      <header className="empdash-header-horizontal">
        <h1 className="empdash-title">HR Dashboard</h1>
        <div className="empdash-right-vertical">
          <span className="empdash-welcome">{`Welcome, ${hrUser.name}`}</span>
        </div>
      </header>

      <section className="empdash-summary-cards">
        <article className="emp-card">
          <h3>Leave Requests ({currentMonthName})</h3>
          <p className="emp-card-value">{leaveRequestsCount}</p>
        </article>

        <article className="emp-card">
          <h3>Attendance Records ({currentMonthName})</h3>
          <p className="emp-card-value">{attendanceCount}</p>
        </article>

        <article className="emp-card">
          <h3>Payrolls Managed ({currentMonthName})</h3>
          <p className="emp-card-value">{payrollsCount}</p>
        </article>

        <article className="emp-card">
          <h3>Pending Tasks</h3>
          <p className="emp-card-value">{pendingTaskCount}</p>
        </article>
      </section>

      <h2>Your Details</h2>
      <div className="empdash-table-wrapper">
        <table className="empdash-table" aria-label="HR Details">
          <tbody>
            <tr><th>Name</th><td>{hrUser.name}</td></tr>
            <tr><th>Email</th><td>{hrUser.email}</td></tr>
            <tr><th>Department</th><td>{hrUser.department}</td></tr>
            <tr><th>Role</th><td>{hrUser.role.toUpperCase()}</td></tr>
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

export default HRDashboard;
