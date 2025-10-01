import React, { useState, useEffect } from 'react';
import './ManagerTask.css';

const ManagerTask = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState({ month: '', year: '' });
  const [filterEmployee, setFilterEmployee] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium',
  });

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

    const departmentEmployeeIds = users
      .filter(u => u.department === user.department)
      .map(u => u.employeeId);
    let userTasks = tasks.filter(task => departmentEmployeeIds.includes(task.assignedTo) || task.assignedTo === user.employeeId);

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

    const employeeFilteredTasks = dateFilteredTasks.filter(task =>
      !filterEmployee || task.assignedTo === filterEmployee
    );

    setFilteredTasks(employeeFilteredTasks);
  }, [user, tasks, users, searchQuery, filterDate, filterEmployee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleDateFilterChange = (e) => {
    setFilterDate(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, title: newTask.title, description: newTask.description, assignedTo: newTask.assignedTo, dueDate: newTask.dueDate, priority: newTask.priority }
          : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task));
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

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ ...task });
    setShowForm(true);
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
            <div className="task-actions">
              <button className="task-edit-btn" onClick={() => handleEditTask(task)}>Edit</button>
              <button className="task-delete-btn" onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
            <div className="task-attachment">
              {task.fileName && <a href={task.fileData} download={task.fileName}>Download Attachment</a>}
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
        <h1>Task Board</h1>
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
          <select name="filterEmployee" value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)}>
            <option value="">All Employees</option>
            {users
              .filter(u => u.department === user?.department)
              .map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))
            }
          </select>
        </div>
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => { setShowForm(false); setEditingTask(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleTaskSubmit}>
              <h2>Edit Task</h2>
              <input
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Task Title"
                required
              />
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task Description"
                required
              />
              <select
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleInputChange}
                required
                disabled
              >
                <option value="">Assign to...</option>
                {users.map((u) => (
                  <option key={u.employeeId} value={u.employeeId}>
                    {u.employeeId} - {u.name} ({u.department})
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
              />
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <div className="form-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingTask(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default ManagerTask;