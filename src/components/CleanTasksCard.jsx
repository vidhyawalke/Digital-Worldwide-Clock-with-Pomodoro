import React, { useState } from 'react';
import { Check, Plus, Trash2, ListTodo } from 'lucide-react';

export default function CleanTasksCard() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('timora_clean_tasks_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const saveTasks = (newTaskList) => {
    setTasks(newTaskList);
    localStorage.setItem('timora_clean_tasks_v2', JSON.stringify(newTaskList));
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
        <div className="clean-tasks-title-wrap">
          <h3 className="clean-tasks-title">Tasks</h3>
          {tasks.length > 0 && (
            <span className="clean-tasks-badge">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </span>
          )}
        </div>
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

      {/* Checklist or Empty State */}
      {tasks.length === 0 ? (
        <div className="clean-tasks-empty" onClick={() => setIsAdding(true)}>
          <ListTodo size={15} color="var(--primary)" />
          <span>No tasks yet. Click <strong>+ Add Task</strong> to organize your session.</span>
        </div>
      ) : (
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
      )}
    </div>
  );
}
