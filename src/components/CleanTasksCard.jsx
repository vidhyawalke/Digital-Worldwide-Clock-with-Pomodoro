import React, { useState } from 'react';
import { Check, Plus, Trash2, Pencil, ListTodo, X } from 'lucide-react';

export default function CleanTasksCard() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('timora_clean_tasks_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Inline edit state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const saveTasks = (newTaskList) => {
    setTasks(newTaskList);
    localStorage.setItem('timora_clean_tasks_v2', JSON.stringify(newTaskList));
  };

  const toggleTask = (id) => {
    if (editingTaskId === id) return;
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

  const handleStartEdit = (task, e) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  const handleSaveEdit = (taskId, e) => {
    e?.preventDefault();
    if (!editingText.trim()) return;
    const updated = tasks.map(t => t.id === taskId ? { ...t, title: editingText.trim() } : t);
    saveTasks(updated);
    setEditingTaskId(null);
    setEditingText('');
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
    if (editingTaskId === id) {
      setEditingTaskId(null);
    }
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
              className={`clean-task-row ${task.completed ? 'completed' : ''} ${editingTaskId === task.id ? 'editing' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              {/* Square Checkbox */}
              <div className={`clean-task-checkbox ${task.completed ? 'checked' : ''}`}>
                {task.completed && <Check size={12} strokeWidth={3} />}
              </div>

              {/* Title / Inline Edit Form */}
              {editingTaskId === task.id ? (
                <form 
                  onSubmit={(e) => handleSaveEdit(task.id, e)} 
                  className="clean-task-edit-form"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setEditingTaskId(null);
                    }}
                  />
                  <button type="submit" className="clean-task-action-btn save" title="Save">
                    <Check size={12} />
                  </button>
                  <button 
                    type="button" 
                    className="clean-task-action-btn cancel" 
                    onClick={() => setEditingTaskId(null)}
                    title="Cancel"
                  >
                    <X size={12} />
                  </button>
                </form>
              ) : (
                <>
                  <span className="clean-task-label">{task.title}</span>

                  {/* Actions (Pencil Edit & Trash Delete) */}
                  <div className="clean-task-actions">
                    <button 
                      className="clean-task-action-btn edit" 
                      onClick={(e) => handleStartEdit(task, e)}
                      title="Edit task"
                      aria-label="Edit task"
                    >
                      <Pencil size={12} />
                    </button>
                    <button 
                      className="clean-task-action-btn delete" 
                      onClick={(e) => deleteTask(task.id, e)}
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
