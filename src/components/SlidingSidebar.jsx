import React from 'react';

// Stripped-down sidebar: no calendar, no nav tabs, just Today's Focus stats
export default function SlidingSidebar({
  completedSessions = 4,
  totalTargetSessions = 8,
}) {
  const focusPercent = Math.min(100, Math.round((completedSessions / totalTargetSessions) * 100));

  return null; // Sidebar removed — single static page layout
}
