import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';

const DEFAULT_TASKS = [
  { id: '1', title: 'Read project requirements', completed: true },
  { id: '2', title: 'Team standup meeting', completed: true },
  { id: '3', title: 'Reply to emails', completed: true },
  { id: '4', title: 'Design homepage wireframe', completed: false },
];

export default function CleanTasksCard() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('timora_clean_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const saveTasks = (newTaskList) => {
    setTasks(newTaskList);
    localStorage.setItem('timora_clean_tasks', JSON.stringify(newTaskList));
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const updated = [...tasks, { id: Date.now().toString(), title: newTitle.trim(), completed: false }];
    saveTasks(updated);
    setNewTitle('');
    setIsAdding(false);
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  return (
    <div className="clean-tasks-card">
      {/* Header */}
      <div className="clean-tasks-header">
        <h3 className="clean-tasks-title">Tasks</h3>
        <button 
          className="clean-add-task-btn"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={13} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Add Task Inline Form */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="clean-task-inline-form">
          <input
            type="text"
            placeholder="Type task and press Enter..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" className="clean-btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="clean-btn-add">Add</button>
          </div>
        </form>
      )}

      {/* Checklist */}
      <div className="clean-tasks-list">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`clean-task-row ${task.completed ? 'completed' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            {/* Square Checkbox */}
            <div className={`clean-task-checkbox ${task.completed ? 'checked' : ''}`}>
              {task.completed && <Check size={12} strokeWidth={3} />}
            </div>

            {/* Title */}
            <span className="clean-task-label">{task.title}</span>

            {/* Delete */}
            <button 
              className="clean-task-del-btn" 
              onClick={(e) => deleteTask(task.id, e)}
              title="Delete task"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
