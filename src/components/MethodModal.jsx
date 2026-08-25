import React from 'react';
import { X, Flame, Clock, Coffee, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MethodModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Pick a Single Task',
      desc: 'Select one clear priority from your daily task list. Eliminate distractions before starting.',
      icon: <CheckCircle2 size={20} color="var(--primary)" />
    },
    {
      num: '02',
      title: 'Focus for 25 Minutes',
      desc: 'Set the Pomodoro timer and work with deep focus until the gentle chime rings.',
      icon: <Clock size={20} color="var(--primary)" />
    },
    {
      num: '03',
      title: 'Take a 5-Minute Break',
      desc: 'Step away from your screen. Stretch, hydrate, and give your mind time to refresh.',
      icon: <Coffee size={20} color="var(--primary)" />
    },
    {
      num: '04',
      title: 'Repeat & Long Rest',
      desc: 'After 4 focus sessions, take an extended 15-30 minute break to recharge completely.',
      icon: <Sparkles size={20} color="var(--primary)" />
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content method-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="method-badge-icon">
              <Flame size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                The Pomodoro Technique
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                A time-tested science-backed framework for deep focus and productivity.
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="method-modal-body">
          <div className="method-steps-grid">
            {steps.map((step) => (
              <div key={step.num} className="method-step-card">
                <div className="method-step-top">
                  <span className="method-step-num">{step.num}</span>
                  {step.icon}
                </div>
                <h4 className="method-step-title">{step.title}</h4>
                <p className="method-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="method-tip-box">
            <div className="method-tip-title">💡 Pro Tip for Flow State:</div>
            <p className="method-tip-text">
              Pair your 25-minute sprints with our built-in Lo-fi focus radio. Instrumental soundscapes lower cortisol and prevent mind wandering.
            </p>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="primary-btn" onClick={onClose} style={{ padding: '0.6rem 1.4rem' }}>
            <span>Start Focusing Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
