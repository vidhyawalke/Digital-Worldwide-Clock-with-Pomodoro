import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  Flame, 
  TrendingUp, 
  Cloud, 
  Check, 
  Sparkles,
  Timer
} from 'lucide-react';

export default function SummaryBar({ 
  completedSessions = 4, 
  targetSessions = 8, 
  focusMinutes = 100, 
  taskCompletionPercent = 85,
  streakDays = 12,
  onOpenAnalytics,
  onSaveProgress
}) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = () => {
    setIsSaved(true);
    if (onSaveProgress) {
      onSaveProgress();
    }
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="bottom-summary-banner-card">
      {/* ── 1. SESSION SUMMARY SECTION ── */}
      <div className="summary-col-block">
        <div className="summary-section-label">SESSION SUMMARY</div>
        <div className="summary-metrics-row">
          {/* Metric 1 */}
          <div className="summary-metric-chip">
            <div className="metric-chip-icon">
              <Timer size={16} color="var(--primary)" />
            </div>
            <div className="metric-chip-data">
              <span className="metric-chip-value">{completedSessions} / {targetSessions}</span>
              <span className="metric-chip-name">Sessions Completed</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="summary-metric-chip">
            <div className="metric-chip-icon">
              <Clock size={16} color="var(--primary)" />
            </div>
            <div className="metric-chip-data">
              <span className="metric-chip-value">{focusMinutes}m</span>
              <span className="metric-chip-name">Total Focus Time</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="summary-metric-chip">
            <div className="metric-chip-icon">
              <BarChart3 size={16} color="var(--primary)" />
            </div>
            <div className="metric-chip-data">
              <span className="metric-chip-value">{taskCompletionPercent}%</span>
              <span className="metric-chip-name">Task Completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. FOCUS STREAK SECTION ── */}
      <div className="summary-col-block streak-block">
        <div className="summary-section-label">FOCUS STREAK</div>
        <div className="summary-streak-main">
          <div className="streak-title-row">
            <Flame size={18} color="var(--primary)" fill="var(--primary)" />
            <span className="streak-days-bold">{streakDays} days</span>
          </div>
          <p className="streak-cheer-sub">Keep it up! You're doing great.</p>
        </div>
      </div>

      {/* ── 3. ACTIONS & CLOUD SAVE SECTION ── */}
      <div className="summary-col-block actions-block">
        <div className="summary-buttons-row">
          <button 
            className="summary-btn-outline"
            onClick={onOpenAnalytics}
          >
            <TrendingUp size={14} />
            <span>View Analytics</span>
          </button>

          <button 
            className={`summary-btn-primary ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveClick}
          >
            {isSaved ? <Check size={14} /> : <Cloud size={14} />}
            <span>{isSaved ? 'Progress Saved!' : 'Save Progress'}</span>
          </button>
        </div>
        <p className="summary-cloud-note">
          All progress is saved to your Google account.
        </p>
      </div>
    </div>
  );
}
