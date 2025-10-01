import React, { useState, useEffect } from 'react';
import './EmployeeTask.css';

const EmployeeTask = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState({ month: '', year: '' });

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('auth'));
    setUser(authUser);

    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(allTasks);

    const allUsers = JSON.parse(localStorage.getItem('employees')) || [];
    setUsers(allUsers);
  }, []);

  useEffect(() => {
    if (!user) return;

    let userTasks = tasks.filter(task => task.assignedTo === user.employeeId);

    const searchedTasks = userTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const dateFilteredTasks = searchedTasks.filter(task => {
      if (!filterDate.month && !filterDate.year) return true;
      const taskDate = new Date(task.createdAt);
      const matchMonth = filterDate.month === '' || taskDate.getMonth() === parseInt(filterDate.month, 10);
      const matchYear = filterDate.year === '' || taskDate.getFullYear() === parseInt(filterDate.year, 10);

      if (filterDate.month && filterDate.year) return matchMonth && matchYear;
      if (filterDate.month) return matchMonth;
      if (filterDate.year) return matchYear;
      return true;
    });

    setFilteredTasks(dateFilteredTasks);
  }, [user, tasks, searchQuery, filterDate]);

  const handleDateFilterChange = (e) => {
    setFilterDate(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStatusChange = (taskId, newStatus) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (newStatus === 'Completed' && !taskToUpdate.fileName) {
      alert('Please attach the task file before marking it as completed.');
      const selectElement = document.querySelector(`.task-card[data-task-id="${taskId}"] .task-status-changer`);
      if (selectElement) {
        selectElement.value = taskToUpdate.status;
      }
      return;
    }

    const updatedTasks = tasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleAttachFile = (taskId, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, fileName: file.name, fileData: fileData };
        }
        return task;
      });
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAttachment = (taskId) => {
    if (!window.confirm('Are you sure you want to remove this attachment?')) return;
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, fileName: null, fileData: null };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const renderTasksByStatus = (status) => {
    return filteredTasks
      .filter(task => task.status === status)
      .map(task => {
        const assignedUser = users.find(u => u.employeeId === task.assignedTo);
        return (
          <div key={task.id} data-task-id={task.id} className={`task-card priority-${task.priority.toLowerCase()}`}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div className="task-meta">
              <span className="task-date"><b>Assigned:</b> {new Date(task.createdAt).toLocaleDateString()}</span>
              <span className="task-date"><b>Due:</b> {task.dueDate || 'N/A'}</span>
            </div>
            <div className="task-assigned-to">To: {assignedUser ? `${assignedUser.name} (${assignedUser.employeeId})` : 'N/A'}</div>
            <div className="task-attachment">
              {task.fileName ? (
                <div className="attachment-info">
                  <a href={task.fileData} download={task.fileName}>Download Attachment</a>
                  <button className="attachment-delete-btn" onClick={() => handleDeleteAttachment(task.id)}>&times;</button>
                </div>
              ) : (
                <div className="task-file-upload">
                  <input
                    id={`file-for-${task.id}`}
                    type="file"
                    className="file-input-hidden"
                    onChange={(e) => handleAttachFile(task.id, e.target.files[0])}
                  />
                  <label htmlFor={`file-for-${task.id}`} className="file-upload-button-small">Attach Work</label>
                </div>
              )}
            </div>
            <select
              className="task-status-changer"
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        );
      });
  };

  return (
    <div className="task-page-container">
      <div className="task-page-header">
        <h1>My Tasks</h1>
        <div className="task-filters">
          <input
            type="text"
            className="task-search-input"
            placeholder="Search by task title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select name="month" value={filterDate.month} onChange={handleDateFilterChange}>
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select name="year" value={filterDate.year} onChange={handleDateFilterChange}>
            <option value="">All Years</option>
            {getYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="kanban-board">
        <div className="kanban-column">
          <h3>To Do</h3>
          <div className="tasks-container">{renderTasksByStatus('To Do')}</div>
        </div>
        <div className="kanban-column">
          <h3>In Progress</h3>
          <div className="tasks-container">{renderTasksByStatus('In Progress')}</div>
        </div>
        <div className="kanban-column">
          <h3>Completed</h3>
          <div className="tasks-container">{renderTasksByStatus('Completed')}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTask;