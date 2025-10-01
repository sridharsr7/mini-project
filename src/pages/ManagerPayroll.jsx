import React, { useEffect, useState } from "react";
import "./Payroll.css";

function ManagerPayroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [userDept, setUserDept] = useState("");

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    setUserDept(auth?.department || "");

    setPayrolls(JSON.parse(localStorage.getItem("payrolls")) || []);
    setEmployees(JSON.parse(localStorage.getItem("employees")) || []);
  }, []);

  const deptEmployeeIds = employees
    .filter(emp => emp.department === userDept)
    .map(emp => emp.employeeId);

  const filteredPayrolls = payrolls.filter(p => {
    return (
      deptEmployeeIds.includes(p.employeeId) &&
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchDate === "" || p.paidOn === searchDate)
    );
  });

  return (
    <div className="payroll-container">
      <h2 className="payroll-title">Manager Payroll Approval</h2>

      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by employee ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          placeholder="Filter by date"
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
        />
      </div>

      {filteredPayrolls.length === 0 ? (
        <p>No payrolls found.</p>
      ) : (
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Amount (₹)</th>
              <th>Paid On</th>
              <th>Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.map(p => {
              const emp = employees.find(e => e.employeeId === p.employeeId);
              return (
                <tr key={p.id}>
                  <td>{emp ? emp.name : p.employeeId}</td>
                  <td>{p.employeeId}</td>
                  <td>₹ {p.amount}</td>
                  <td>{p.paidOn}</td>
                  <td>{p.remarks}</td>
                  <td><span className={`status-badge ${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManagerPayroll;
