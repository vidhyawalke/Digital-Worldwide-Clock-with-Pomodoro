import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, CheckCircle2, ListTodo } from 'lucide-react';

const INITIAL_TASKS = [
  { id: '1', title: 'Focus on primary project sprint', completed: true },
  { id: '2', title: 'Review pull requests and comments', completed: true },
  { id: '3', title: 'Plan 45-min deep focus session', completed: false },
  { id: '4', title: 'Hydrate and take short break', completed: false },
];

export default function CleanTasksCard() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('timora_tasks_list');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('timora_tasks_list', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
    setIsAdding(false);
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="clean-tasks-card">
      {/* Header */}
      <div className="clean-tasks-header">
        <div className="clean-tasks-title-wrap">
          <ListTodo size={15} color="var(--primary)" />
          <h3 className="clean-tasks-title">Session Tasks</h3>
          <span className="clean-tasks-badge">
            {completedCount}/{tasks.length} done
          </span>
        </div>
        <button 
          className="clean-add-task-btn"
          onClick={() => setIsAdding(!isAdding)}
          title="Add a new task"
        >
          <Plus size={13} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Add Task Form */}
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
        {tasks.length === 0 ? (
          <div className="clean-tasks-empty">
            <span>No tasks added yet. Create one to get started!</span>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`clean-task-row ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              {/* Checkbox */}
              <div className={`clean-task-checkbox ${task.completed ? 'checked' : ''}`}>
                {task.completed && <Check size={12} strokeWidth={3} />}
              </div>

              {/* Title */}
              <span className="clean-task-label">{task.title}</span>

              {/* Delete Button */}
              <button 
                className="clean-task-del-btn" 
                onClick={(e) => deleteTask(task.id, e)}
                title="Delete task"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
