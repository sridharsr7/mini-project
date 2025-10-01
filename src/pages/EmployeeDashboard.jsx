import React, { useEffect, useState, useRef } from "react";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const MAX_LEAVE_DAYS_PER_MONTH = 2;

  const [employee, setEmployee] = useState(null);
  const [monthlyLeaveCount, setMonthlyLeaveCount] = useState(0);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [monthlyPresentDays, setMonthlyPresentDays] = useState(0);
  const [payrollInitiated, setPayrollInitiated] = useState(false);
  const [payrollStatus, setPayrollStatus] = useState("Pending");
  const [currentMonthName, setCurrentMonthName] = useState("");
  const timerRef = useRef(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "" });

  const workEndTime = new Date();
  workEndTime.setHours(18, 0, 0, 0);

  const calculateLeaveDuration = (from, to) => {
    if (!from || !to) return 0;
    const startDate = new Date(from);
    const endDate = new Date(to);
    return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) return;
    const user = JSON.parse(auth);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    setCurrentMonthName(now.toLocaleString("default", { month: "long" }));

    const allEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    const currentEmployee = allEmployees.find(
      (e) => e.employeeId === user.employeeId
    );
    setEmployee(currentEmployee || null);

    if (currentEmployee) {
      setEditForm({
        name: currentEmployee.name || "",
        email: currentEmployee.email || "",
        password: currentEmployee.password || ""
      });
    }

    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const todayDate = new Date().toISOString().slice(0, 10);
    const todayRecord = attendance.find(
      (a) => a.employeeId === user.employeeId && a.date === todayDate && a.checkIn
    );
    if (todayRecord) {
      setCheckInTime(new Date(`${todayRecord.date} ${todayRecord.checkIn}`));
      if (todayRecord.checkOut) {
        setCheckOutTime(new Date(`${todayRecord.date} ${todayRecord.checkOut}`));
      }
    }

    const presentThisMonth = attendance.filter((a) => {
      if (a.employeeId !== user.employeeId) return false;
      if (!a.checkIn) return false;
      const d = new Date(a.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    setMonthlyPresentDays(presentThisMonth.length);

    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
    const leavesThisMonth = leaves.filter((lv) => {
      if (lv.employeeId !== user.employeeId || lv.status !== "Approved")
        return false;
      const from = new Date(lv.from);
      return from.getFullYear() === currentYear && from.getMonth() === currentMonth;
    });
    const totalLeaveDays = leavesThisMonth.reduce((total, lv) => {
      return total + calculateLeaveDuration(lv.from, lv.to);
    }, 0);
    setMonthlyLeaveCount(totalLeaveDays);

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const pendingTasks = tasks.filter(
      (task) => task.assignedTo === user.employeeId && task.status !== "Completed"
    );
    setPendingTaskCount(pendingTasks.length);

    const payrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
    const myPayrolls = payrolls.filter((p) => p.employeeId === user.employeeId);
    if (myPayrolls.length > 0) {
      setPayrollInitiated(true);
      setPayrollStatus(myPayrolls[myPayrolls.length - 1].status || "Pending");
    } else {
      setPayrollInitiated(false);
      setPayrollStatus("Pending");
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkInTime && !checkOutTime) {
      timerRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    } else {
      setCurrentTime(new Date());
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkInTime, checkOutTime]);

  const handleCheckIn = () => {
    const now = new Date();
    const todayDate = now.toISOString().slice(0, 10);
    const currentTimeStr = now.toTimeString().slice(0, 8); 

    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const todayRecordIndex = attendance.findIndex(
      (a) => a.employeeId === employee.employeeId && a.date === todayDate
    );

    const newRecord = {
      employeeId: employee.employeeId,
      date: todayDate,
      checkIn: currentTimeStr,
      checkOut: null,
    };

    if (todayRecordIndex > -1) {
      attendance[todayRecordIndex] = { ...attendance[todayRecordIndex], ...newRecord };
    } else {
      attendance.push(newRecord);
    }
    localStorage.setItem("attendance", JSON.stringify(attendance));
    setCheckInTime(now);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const todayDate = now.toISOString().slice(0, 10);
    const currentTimeStr = now.toTimeString().slice(0, 8); 

    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const todayRecordIndex = attendance.findIndex(
      (a) => a.employeeId === employee.employeeId && a.date === todayDate
    );

    if (todayRecordIndex > -1) {
      attendance[todayRecordIndex].checkOut = currentTimeStr;
    } else {
      attendance.push({
        employeeId: employee.employeeId,
        date: todayDate,
        checkIn: null,
        checkOut: currentTimeStr,
      });
    }
    localStorage.setItem("attendance", JSON.stringify(attendance));
    setCheckOutTime(now);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatElapsedTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return "00:00:00";
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (num) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

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
      if (emp.employeeId === employee.employeeId) {
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
      if (usr.employeeId === employee.employeeId) {
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

    const savedEmployee = updatedEmployees.find(emp => emp.employeeId === employee.employeeId);
    localStorage.setItem("auth", JSON.stringify(savedEmployee));

    setEmployee(savedEmployee);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (employee) {
      setEditForm({
        name: employee.name || "",
        email: employee.email || "",
        password: employee.password || ""
      });
    }
    setIsEditing(false);
  };

  if (!employee) {
    return (
      <div className="empdash-container">
        <header className="empdash-header-horizontal">
          <h1 className="empdash-title">Employee Dashboard</h1>
          <div className="empdash-right">
            <span className="empdash-welcome">Welcome!</span>
          </div>
        </header>
        <section className="empdash-summary-cards">
          <article className="emp-card">
            <h3>No Data</h3>
            <p className="emp-card-value">-</p>
          </article>
        </section>
        <p className="empdash-no-data">
          No employee record found. Please contact HR or admin.
        </p>
      </div>
    );
  }

  return (
    <div className="empdash-container">
      <header className="empdash-header-horizontal">
        <h1 className="empdash-title">Employee Dashboard</h1>
        <div className="empdash-right-vertical">
          <span className="empdash-welcome">{`Welcome, ${employee.name}`}</span>
          {checkInTime ? (
            checkOutTime ? (
              <span className="empdash-clock">
                Check-in: {formatTime(checkInTime)} | Check-out: {formatTime(checkOutTime)}
              </span>
            ) : (
              <>
                <span className="empdash-clock">
                  Check-in: {formatTime(checkInTime)} | Work Ends: {formatTime(workEndTime)}
                </span>
                {checkInTime && (
                  <div className="empdash-elapsed-time">
                    Elapsed time: {formatElapsedTime(Math.floor((currentTime - checkInTime) / 1000))}
                  </div>
                )}
                <button onClick={handleCheckOut} className="check-out-btn">Check-out</button>
              </>
            )
          ) : (
            <button onClick={handleCheckIn} className="check-in-btn">Check-in</button>
          )}

        </div>
      </header>

      <section className="empdash-summary-cards">
        <article className="emp-card">
          <h3>Leaves Taken ({currentMonthName})</h3>
          <p className="emp-card-value">{monthlyLeaveCount}</p>
        </article>

        <article className="emp-card">
          <h3>Days Present ({currentMonthName})</h3>
          <p className="emp-card-value">{monthlyPresentDays}</p>
        </article>

        <article className="emp-card">
          <h3>Pending Tasks</h3>
          <p className="emp-card-value">{pendingTaskCount}</p>
        </article>

        <article className="emp-card">
          <h3>Leave Days Remaining ({currentMonthName})</h3>
          <p className="emp-card-value">{Math.max(0, MAX_LEAVE_DAYS_PER_MONTH - monthlyLeaveCount)}</p>
        </article>

        <article className="emp-card">
          <h3>Payroll</h3>
          <p className={`emp-card-value ${payrollInitiated ? "pay-yes" : "pay-no"}`}>
            {payrollInitiated ? "Initiated" : "Not Initiated"}
          </p>
          <div className={`metrics-badge ${payrollStatus.toLowerCase()}`}>{payrollStatus}</div>
        </article>
      </section>

      <h2>Your Details</h2>

      <div className="empdash-table-wrapper">
        <table className="empdash-table" aria-label="Employee Details">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{employee.name}</td>
            </tr>
            <tr>
              <th>Employee ID</th>
              <td>{employee.employeeId}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{employee.email}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{employee.department}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span className={`status ${employee.status?.toLowerCase()}`}>
                  {employee.status}
                </span>
              </td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{employee.role ? employee.role.toUpperCase() : "EMPLOYEE"}</td>
            </tr>
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

export default EmployeeDashboard;
