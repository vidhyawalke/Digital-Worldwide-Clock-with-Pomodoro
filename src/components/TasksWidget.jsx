import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, CheckSquare, Sparkles } from 'lucide-react';

const INITIAL_TASKS = [
  { id: '1', title: 'Review project brief', completed: true, active: false },
  { id: '2', title: 'Team standup call', completed: true, active: false },
  { id: '3', title: 'Respond to urgent client emails', completed: true, active: false },
  { id: '4', title: 'Design homepage mockup', completed: false, active: true },
  { id: '5', title: 'Write blog post draft (25-min sprint)', completed: false, active: false },
  { id: '6', title: 'Update client presentation deck', completed: false, active: false },
  { id: '7', title: 'Run code review on pull requests', completed: false, active: false },
];

export default function TasksWidget({ onTasksChange }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('timora_daily_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('timora_daily_tasks', JSON.stringify(tasks));
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleSetActive = (id, e) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => ({
      ...t,
      active: t.id === id ? !t.active : false
    })));
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTaskText.trim(),
      completed: false,
      active: false
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
    setIsAdding(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="tasks-card-container">
      {/* Header */}
      <div className="tasks-card-header">
        <div>
          <div className="tasks-category-badge">DAILY ROUTINE</div>
          <h2 className="tasks-card-title">Today's Tasks</h2>
        </div>
        <div className="tasks-count-pill">
          {completedCount} of {totalCount} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="tasks-progress-track">
        <div 
          className="tasks-progress-fill" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Task Checklist Items */}
      <div className="tasks-checklist">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`task-row-item ${task.completed ? 'completed' : ''} ${task.active ? 'is-active-task' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            {/* Custom Checkbox */}
            <div className={`task-custom-checkbox ${task.completed ? 'checked' : ''}`}>
              {task.completed && <Check size={12} strokeWidth={3} />}
            </div>

            {/* Task Label */}
            <span className="task-title-text">{task.title}</span>

            {/* Active Tag or Action */}
            <div className="task-item-actions">
              {task.active && (
                <span 
                  className="task-active-badge"
                  onClick={(e) => handleSetActive(task.id, e)}
                  title="Currently active focus task"
                >
                  ACTIVE
                </span>
              )}
              {!task.active && !task.completed && (
                <button 
                  className="task-set-active-btn"
                  onClick={(e) => handleSetActive(task.id, e)}
                  title="Mark as current active task"
                >
                  Set Active
                </button>
              )}
              <button 
                className="task-delete-btn"
                onClick={(e) => deleteTask(task.id, e)}
                title="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Task Inline Input */}
      {isAdding ? (
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            className="add-task-input"
            placeholder="Type task name & press Enter..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" className="task-cancel-btn" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
            <button type="submit" className="task-submit-btn">
              Add
            </button>
          </div>
        </form>
      ) : (
        <button 
          className="add-task-trigger-btn"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={14} />
          <span>Add a new task...</span>
        </button>
      )}
    </div>
  );
}
