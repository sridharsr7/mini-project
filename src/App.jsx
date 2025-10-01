import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import HRLogin from "./pages/HRLogin";
import ManagerLogin from "./pages/ManagerLogin";
import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employee from "./pages/Employee";
import AdminPayroll from "./pages/Payroll";
import EmployeePayroll from "./pages/EmployeePayroll";
import AdminLeave from "./pages/Leave";
import EmployeeLeaveRequest from "./pages/EmployeeLeaveRequest";
import HRLeaveRequests from "./pages/HRLeaveRequests";
import ManagerLeaveRequest from "./pages/ManagerLeaveRequest";
import Report from "./pages/Report";
import Attendance from "./pages/Attendance";
import HRDashboard from "./pages/HRDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import HRPayroll from "./pages/HRPayroll";
import ManagerPayroll from "./pages/ManagerPayroll";

import EmployeeAttendance from "./pages/EmployeeAttendance";
import HRAttendance from "./pages/HRAttendance";
import ManagerAttendance from "./pages/ManagerAttendance";
import EmployeeTask from "./pages/EmployeeTask";
import HRTask from "./pages/HRTask";
import ManagerTask from "./pages/ManagerTask";
import AdminTask from "./pages/AdminTask";
import EmployeePerformance from "./pages/EmployeePerformance";

import HRPerformance from "./pages/HRPerformance";
import ManagerPerformance from "./pages/ManagerPerformance";
import AdminPerformance from "./pages/AdminPerformance";
function ProtectedRoute({ children }) {
  const userAuth = localStorage.getItem("auth");
  const adminAuth = localStorage.getItem("adminAuth");
  return userAuth || adminAuth ? children : <Navigate to="/login" />;
}


function AppLayout({ isAuth, userRole, onLogout }) {
  return (
    <div className="dashboard-layout">
      <Sidebar isAuth={isAuth} userRole={userRole} onLogout={onLogout} />
      <div className="container">
        <Outlet /> {}
      </div>
    </div>
  );
}

function AppContent() {
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.role) setUserRole(auth.role);
    else setUserRole(null);

    if (localStorage.getItem("auth") || localStorage.getItem("adminAuth")) {
      setIsAuth(true);
    }
  }, []);

  const handleLogin = (role) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const userRoleFromAuth = auth && auth.role ? auth.role : role;
    setUserRole(userRoleFromAuth);
    setIsAuth(true);

    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("adminAuth");
    setIsAuth(false);
    setUserRole(null);
    navigate("/login");
  };

  const noSidebarRoutes = ["/", "/login", "/hrlogin", "/managerlogin", "/adminlogin"];

  return (
    <div className="dashboard-layout">
      {!noSidebarRoutes.includes(location.pathname) && (
        <Sidebar isAuth={isAuth} userRole={userRole} onLogout={handleLogout} />
      )}
      <div className="container">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/hrlogin" element={<HRLogin onLogin={handleLogin} />} />
          <Route path="/managerlogin" element={<ManagerLogin onLogin={handleLogin} />} />
          <Route path="/adminlogin" element={<AdminLogin onAdminLogin={handleLogin} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {userRole === "employee" ? (
                  <EmployeeDashboard />
                ) : userRole === "hr" ? (
                  <HRDashboard />
                ) : userRole === "manager" ? (
                  <ManagerDashboard />
                ) : (
                  <Dashboard />
                )}
              </ProtectedRoute>
            }
          />

          <Route path="/admin/employee" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
          <Route path="/admin/payroll" element={<ProtectedRoute><AdminPayroll /></ProtectedRoute>} />
          <Route path="/admin/leave" element={<ProtectedRoute><AdminLeave /></ProtectedRoute>} />
          <Route path="/admin/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/admin/tasks" element={<ProtectedRoute><AdminTask /></ProtectedRoute>} />
          <Route path="/admin/performance" element={<ProtectedRoute><AdminPerformance /></ProtectedRoute>} />

          <Route path="/employee/leave" element={<ProtectedRoute><EmployeeLeaveRequest /></ProtectedRoute>} />
          <Route path="/employee/payroll" element={<ProtectedRoute><EmployeePayroll /></ProtectedRoute>} />
          <Route path="/employee/attendance" element={<ProtectedRoute><EmployeeAttendance /></ProtectedRoute>} />
          <Route path="/employee/tasks" element={<ProtectedRoute><EmployeeTask /></ProtectedRoute>} />
          <Route path="/employee/performance" element={<ProtectedRoute><EmployeePerformance /></ProtectedRoute>} />

          <Route path="/hr/leave" element={<ProtectedRoute><HRLeaveRequests /></ProtectedRoute>} />
          <Route path="/hr/payroll" element={<ProtectedRoute><HRPayroll /></ProtectedRoute>} />
          <Route path="/hr/attendance" element={<ProtectedRoute><HRAttendance /></ProtectedRoute>} />
          <Route path="/hr/tasks" element={<ProtectedRoute><HRTask /></ProtectedRoute>} />
          <Route path="/hr/performance" element={<ProtectedRoute><HRPerformance /></ProtectedRoute>} />

          <Route path="/manager/leave" element={<ProtectedRoute><ManagerLeaveRequest /></ProtectedRoute>} />
          <Route path="/manager/payroll" element={<ProtectedRoute><ManagerPayroll /></ProtectedRoute>} />
          <Route path="/manager/attendance" element={<ProtectedRoute><ManagerAttendance /></ProtectedRoute>} />
          <Route path="/manager/tasks" element={<ProtectedRoute><ManagerTask /></ProtectedRoute>} />
          <Route path="/manager/performance" element={<ProtectedRoute><ManagerPerformance /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
