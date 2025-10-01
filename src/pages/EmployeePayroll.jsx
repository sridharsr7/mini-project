import React, { useEffect, useState } from "react";
import "./EmployeePayroll.css";

function EmployeePayroll() {
  const [employee, setEmployee] = useState(null);
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      setEmployee(null);
      setPayrolls([]);
      return;
    }
    const user = JSON.parse(auth);
    setEmployee(user);

    const allPayrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
    const userPayrolls = allPayrolls.filter(p => p.employeeId === user.employeeId);
    setPayrolls(userPayrolls);
  }, []);

  return (
    <div className="payroll-container">
      <h2 className="payroll-title">My Payroll</h2>
      {payrolls.length === 0 ? (
        <p>No payroll records found.</p>
      ) : (
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Amount (₹)</th>
              <th>Paid On</th>
              <th>Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map(p => (
              <tr key={p.id}>
                <td>₹ {p.amount}</td>
                <td>{p.paidOn}</td>
                <td>{p.remarks}</td>
                <td>
                  <span className={`status-badge ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeePayroll;
