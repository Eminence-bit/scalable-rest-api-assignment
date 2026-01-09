import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/tasks?limit=5');
      const tasks = response.data.data.tasks;
      
      setRecentTasks(tasks);
      
      // Calculate stats
      const total = tasks.length;
      const pending = tasks.filter(task => task.status === 'pending').length;
      const inProgress = tasks.filter(task => task.status === 'in-progress').length;
      const completed = tasks.filter(task => task.status === 'completed').length;
      
      setStats({ total, pending, inProgress, completed });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.name}!</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats.inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completed}</h3>
          <p>Completed</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <Link to="/tasks/create" className="btn btn-primary">
            Create New Task
          </Link>
          <Link to="/tasks" className="btn btn-secondary">
            View All Tasks
          </Link>
        </div>
      </div>
      
      {recentTasks.length > 0 && (
        <div className="recent-tasks">
          <h2>Recent Tasks</h2>
          <div className="task-grid">
            {recentTasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`task-status ${task.status}`}>
                    {task.status}
                  </span>
                  <span className={`task-priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                {task.dueDate && (
                  <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;