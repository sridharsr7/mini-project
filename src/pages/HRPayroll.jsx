import React, { useEffect, useState } from "react";
import "./Payroll.css";

function HRPayroll() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    amount: "",
    paidOn: "",
    remarks: "",
  });
  const [payrolls, setPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [userDept, setUserDept] = useState("");

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    setUserDept(auth?.department || "");

    setEmployees(JSON.parse(localStorage.getItem("employees")) || []);
    setPayrolls(JSON.parse(localStorage.getItem("payrolls")) || []);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.amount || !form.paidOn) {
      alert("Please fill in required fields.");
      return;
    }

    const duplicate = payrolls.find(p =>
      p.employeeId === form.employeeId && p.paidOn === form.paidOn
    );

    if (duplicate) {
      alert("Payroll for this employee and date already exists.");
      return;
    }

    const newPayroll = {
      id: Date.now(),
      employeeId: form.employeeId,
      amount: parseFloat(form.amount),
      paidOn: form.paidOn,
      remarks: form.remarks,
      status: "Unpaid",
    };
    const updatedPayrolls = [...payrolls, newPayroll];
    setPayrolls(updatedPayrolls);
    localStorage.setItem("payrolls", JSON.stringify(updatedPayrolls));
    setForm({ employeeId: "", amount: "", paidOn: "", remarks: "" });
  };

  const filteredPayrolls = payrolls.filter(p => {
    const emp = employees.find(e => e.employeeId === p.employeeId);
    if (!emp || emp.department !== userDept) return false;

    const idMatch = p.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = searchDate === "" || p.paidOn === searchDate;
    return idMatch && dateMatch;
  });

  return (
    <div className="payroll-container">
      <h2 className="payroll-title">Create Payroll for Employee</h2>
      <form onSubmit={handleSubmit} className="payroll-form">
        <select
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>
          {employees
            .filter(emp => emp.department === userDept)
            .map(emp => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
          min="0"
          step="any"
        />

        <input
          type="date"
          name="paidOn"
          value={form.paidOn}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">Create Payroll</button>
      </form>

      <h3 className="payroll-title" style={{ marginTop: 40 }}>Payroll Records</h3>

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

export default HRPayroll;
