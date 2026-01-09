import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      
      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setMessage('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setMessage('Task updated successfully');
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      setMessage('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setMessage('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
        setMessage('Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h1>My Tasks</h1>
        <Link to="/tasks/create" className="btn btn-primary">
          Create New Task
        </Link>
      </div>
      
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      
      <div className="task-filters">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>No tasks found. <Link to="/tasks/create">Create your first task</Link></p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
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
              
              <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
              
              <div className="task-actions">
                {task.status !== 'completed' && (
                  <>
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                        className="btn btn-primary"
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => handleStatusUpdate(task._id, 'completed')}
                        className="btn btn-success"
                      >
                        Complete
                      </button>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => handleDelete(task._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;