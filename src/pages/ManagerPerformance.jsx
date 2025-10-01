import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip,
} from "recharts";
import "./Performance.css";

function ManagerPerformance() {
  const [user, setUser] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("id"); 
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [filter, setFilter] = useState({
    month: new Date().getMonth(), 
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("auth"));
    if (!authUser) {
      setIsLoading(false);
      return;
    }
    setUser(authUser);

    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];

    const employeesToDisplay = employees.filter(
      (emp) => emp.department === authUser.department
    );

    const isYearlyView = filter.month === "";
    const workingDays = isYearlyView ? 22 * 12 : 22; 

    const data = employeesToDisplay.map((emp) => {
      const employeeTasks = tasks.filter((t) => {
        const taskDate = new Date(t.dueDate);
        return (
          t.assignedTo === emp.employeeId &&
          taskDate.getFullYear() === filter.year &&
          (isYearlyView || taskDate.getMonth() === filter.month)
        );
      });

      const completedTasks = employeeTasks.filter((t) => t.status === "Completed").length;

      const attendanceThisMonth = attendance.filter((a) => {
        const aDate = new Date(a.date);
        return (
          a.employeeId === emp.employeeId &&
          a.checkIn &&
          aDate.getFullYear() === filter.year &&
          (isYearlyView || aDate.getMonth() === filter.month)
        );
      }).length;

      const leavesThisMonth = leaves.filter((l) => {
        const lDate = new Date(l.from);
        return (
          l.employeeId === emp.employeeId &&
          l.status === "Approved" &&
          lDate.getFullYear() === filter.year &&
          (isYearlyView || lDate.getMonth() === filter.month)
        );
      }).length;

      const taskPerformance =
        employeeTasks.length > 0
          ? (completedTasks / employeeTasks.length) * 100
          : 100; 

      const attendancePerformance = Math.min(
        100,
        (attendanceThisMonth / workingDays) * 100
      );

      const leavePenalty = isYearlyView ? 2 : 10;
      const leavePerformance = Math.max(0, 100 - leavesThisMonth * leavePenalty);

      let overallScore =
        taskPerformance * 0.5 + attendancePerformance * 0.3 + leavePerformance * 0.2;

      const finalScore = isNaN(overallScore) ? 0 : Math.round(overallScore);

      return {
        ...emp,
        completedTasks,
        totalTasks: employeeTasks.length,
        attendance: attendanceThisMonth,
        leaves: leavesThisMonth,
        performance: finalScore,
        chartData: [{ name: "Performance", value: finalScore }],
      };
    });

    setPerformanceData(data);
    setIsLoading(false);
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value === "" ? "" : parseInt(value) }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const filteredPerformanceData = performanceData.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredPerformanceData = [...filteredPerformanceData].sort(
    (a, b) => {
      if (sortBy === "performance") {
        if (sortOrder === "asc") {
          return a.performance - b.performance;
        } else {
          return b.performance - a.performance;
        }
      } else {
        let compareA, compareB;
        if (sortBy === "name") {
          compareA = a.name;
          compareB = b.name;
        } else {
          compareA = a.employeeId;
          compareB = b.employeeId;
        }

        if (sortOrder === "asc") {
          return compareA.localeCompare(compareB);
        }
        return compareB.localeCompare(compareA);
      }
    }
  );

  if (isLoading) {
    return <div className="performance-container"><p>Loading performance data...</p></div>;
  }

  if (!user) {
    return (
      <div className="performance-container">
        <h1>Employee Performance</h1>
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="performance-container">
      <h1>Team Performance - {user.department}</h1>
      <div className="performance-filters">
        <select name="month" value={filter.month} onChange={handleFilterChange}>
          <option value="">All Months (Yearly)</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select name="year" value={filter.year} onChange={handleFilterChange}>
          {getYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="performance-search"
        />
        <button onClick={() => handleSort("id")} className="filter-btn">
          Sort by ID
        </button>
        <button onClick={() => handleSort("name")} className="filter-btn">
          Sort by Name
        </button>
        <button onClick={() => handleSort("performance")} className="filter-btn">
          Sort by Performance
        </button>
      </div>
      {sortedAndFilteredPerformanceData.length > 0 ? (
        <div className="performance-cards-grid">
          {sortedAndFilteredPerformanceData.map((emp) => (
            <div key={emp.employeeId} className="performance-card">
              <div className="card-header">
                <h3>{emp.name}</h3>
                <p>{emp.employeeId}</p>
              </div>
              <div className="card-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={emp.chartData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} fill="#10b981" />
                    <Tooltip />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="progress-label">
                      {`${emp.performance}%`}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="card-stats">
                <p><strong>Tasks:</strong> {emp.completedTasks} / {emp.totalTasks}</p>
                <p><strong>Attendance:</strong> {emp.attendance} days</p>
                <p><strong>Leaves:</strong> {emp.leaves} days</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No performance data to display for your team.</p>
      )}
    </div>
  );
}

export default ManagerPerformance;