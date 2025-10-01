import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ isAuth, userRole, onLogout }) {
  const location = useLocation();

  if (!isAuth) {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">MUST TECH</div>
        <nav className="sidebar-menu">
          <Link
            to="/login"
            className={`sidebar-link${location.pathname === "/login" ? " active" : ""}`}
          >
            Login
          </Link>
        </nav>
      </aside>
    );
  }

  if (userRole === "employee") {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">MUST TECH</div>
        <nav className="sidebar-menu">
          <Link
            to="/dashboard"
            className={`sidebar-link${location.pathname === "/dashboard" ? " active" : ""}`}
          >
            Employee Dashboard
          </Link>
          <Link
            to="/employee/leave"
            className={`sidebar-link${location.pathname === "/employee/leave" ? " active" : ""}`}
          >
            Leave Request
          </Link>
          <Link
            to="/employee/payroll"
            className={`sidebar-link${location.pathname === "/employee/payroll" ? " active" : ""}`}
          >
            Payroll
          </Link>
          <Link
            to="/employee/attendance"
            className={`sidebar-link${location.pathname === "/employee/attendance" ? " active" : ""}`}
          >
            Attendance
          </Link>
          <Link
            to="/employee/tasks"
            className={`sidebar-link${location.pathname === "/employee/tasks" ? " active" : ""}`}
          >
            Tasks
          </Link>
          <Link
            to="/employee/performance"
            className={`sidebar-link${location.pathname === "/employee/performance" ? " active" : ""}`}
          >
            My Performance
          </Link>
          <button onClick={onLogout} className="sidebar-link sidebar-logout-btn">
            Logout
          </button>
        </nav>
      </aside>
    );
  }

  if (userRole === "hr") {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">MUST TECH</div>
        <nav className="sidebar-menu">
          <Link
            to="/dashboard"
            className={`sidebar-link${location.pathname === "/dashboard" ? " active" : ""}`}
          >
            HR Dashboard
          </Link>
          <Link
            to="/hr/leave"
            className={`sidebar-link${location.pathname === "/hr/leave" ? " active" : ""}`}
          >
            Leave Requests
          </Link>
          <Link
            to="/hr/payroll"
            className={`sidebar-link${location.pathname === "/hr/payroll" ? " active" : ""}`}
          >
            Payroll
          </Link>
          <Link
            to="/hr/attendance"
            className={`sidebar-link${location.pathname === "/hr/attendance" ? " active" : ""}`}
          >
            Attendance
          </Link>
          <Link
            to="/hr/tasks"
            className={`sidebar-link${location.pathname === "/hr/tasks" ? " active" : ""}`}
          >
            Tasks
          </Link>
          <Link
            to="/hr/performance"
            className={`sidebar-link${location.pathname === "/hr/performance" ? " active" : ""}`}
          >
            Performance
          </Link>
          <button onClick={onLogout} className="sidebar-link sidebar-logout-btn">
            Logout
          </button>
        </nav>
      </aside>
    );
  }

  if (userRole === "manager") {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">MUST TECH</div>
        <nav className="sidebar-menu">
          <Link
            to="/dashboard"
            className={`sidebar-link${location.pathname === "/dashboard" ? " active" : ""}`}
          >
            Manager Dashboard
          </Link>
          <Link
            to="/manager/leave"
            className={`sidebar-link${location.pathname === "/manager/leave" ? " active" : ""}`}
          >
            Leave Requests
          </Link>
          <Link
            to="/manager/payroll"
            className={`sidebar-link${location.pathname === "/manager/payroll" ? " active" : ""}`}
          >
            Payroll
          </Link>
          <Link
            to="/manager/attendance"
            className={`sidebar-link${location.pathname === "/manager/attendance" ? " active" : ""}`}
          >
            Attendance
          </Link>
          <Link
            to="/manager/tasks"
            className={`sidebar-link${location.pathname === "/manager/tasks" ? " active" : ""}`}
          >
            Tasks
          </Link>
          <Link
            to="/manager/performance"
            className={`sidebar-link${location.pathname === "/manager/performance" ? " active" : ""}`}
          >
           Performance
          </Link>
          <button onClick={onLogout} className="sidebar-link sidebar-logout-btn">
            Logout
          </button>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">MUST TECH</div>
      <nav className="sidebar-menu">
        <Link
          to="/dashboard"
          className={`sidebar-link${location.pathname === "/dashboard" ? " active" : ""}`}
        >
          Admin Dashboard
        </Link>
        <Link
          to="/admin/employee"
          className={`sidebar-link${location.pathname === "/admin/employee" ? " active" : ""}`}
        >
          Employee
        </Link>
        <Link
          to="/admin/payroll"
          className={`sidebar-link${location.pathname === "/admin/payroll" ? " active" : ""}`}
        >
          Payroll
        </Link>
        <Link
          to="/admin/leave"
          className={`sidebar-link${location.pathname === "/admin/leave" ? " active" : ""}`}
        >
          Leave
        </Link>
        <Link
          to="/admin/attendance"
          className={`sidebar-link${location.pathname === "/admin/attendance" ? " active" : ""}`}
        >
          Attendance
        </Link>

         <Link
          to="/admin/tasks"
          className={`sidebar-link${location.pathname === "/admin/tasks" ? " active" : ""}`}
        >
          Tasks
        </Link>

        <Link
          to="/admin/performance"
          className={`sidebar-link${location.pathname === "/admin/performance" ? " active" : ""}`}
        >
          Performance
        </Link>
        
        <Link
          to="/admin/report"
          className={`sidebar-link${location.pathname === "/admin/report" ? " active" : ""}`}
        >
          Report
        </Link>
       
        
        <button onClick={onLogout} className="sidebar-link sidebar-logout-btn">
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
