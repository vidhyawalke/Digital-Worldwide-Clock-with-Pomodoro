import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

/**
 * ShortcutsModal Component
 * 
 * Beginner React Concepts:
 * 1. Global Keyboard Listeners (`window.addEventListener('keydown', ...)`).
 * 2. Visual table/list of keybindings.
 */
export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Start / Pause Pomodoro timer' },
    { key: 'R', desc: 'Reset Pomodoro timer' },
    { key: 'S', desc: 'Skip to next session' },
    { key: 'B', desc: 'Open Background wallpaper picker' },
    { key: 'D', desc: 'Open Desktop App download guide' },
    { key: 'F', desc: 'Toggle Fullscreen focus mode' },
    { key: '1', desc: 'Switch to Dashboard view' },
    { key: '2', desc: 'Switch to World Clock view' },
    { key: '3', desc: 'Switch to Pomodoro focus view' },
    { key: '?', desc: 'Toggle this keyboard shortcuts guide' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Keyboard size={20} color="var(--accent-cyan)" />
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="shortcuts-list">
            {shortcuts.map((item, idx) => (
              <div key={idx} className="shortcut-row">
                <span className="shortcut-desc">{item.desc}</span>
                <kbd className="shortcut-key">{item.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
