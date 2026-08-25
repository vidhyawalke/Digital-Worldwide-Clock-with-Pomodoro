import React from 'react';
import { X, ArrowRight, Play } from 'lucide-react';
import { 
  BigCloudTitleSticker,
  SetTasksSticker,
  ClockTimerSticker,
  WorkLaptopSticker,
  BobaTeaSticker,
  OpenJournalSticker,
  PencilSticker,
  PaperclipSticker,
  CrownSticker,
  SparkleStarSticker,
  CoilDoodleSticker
} from './PomodoroStickers';

export default function MethodModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content method-sticker-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button 
          className="modal-sticker-close-btn" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Sticker Poster Board */}
        <div className="pomodoro-poster-board">
          {/* Ambient Background Doodles */}
          <div className="board-decor-dots top-right"></div>
          <div className="board-decor-dots top-left"></div>
          <div className="board-squiggle-left"></div>

          {/* 1. Top Central Cloud Sticker Header */}
          <div className="poster-header-center">
            <BigCloudTitleSticker title="Optimizing Your Time with the Pomodoro Technique" />
          </div>

          {/* 2. Stickers 5-Step Grid */}
          <div className="poster-stickers-grid">
            {/* Step 1: Set the tasks */}
            <div className="sticker-item-block step-1">
              <div className="sticker-badge-container">
                <SetTasksSticker size={105} />
              </div>
              <span className="sticker-caption-handwritten">Set the tasks</span>
            </div>

            {/* Step 2: Set the 25-minute timer */}
            <div className="sticker-item-block step-2">
              <div className="sticker-badge-container">
                <ClockTimerSticker size={108} />
              </div>
              <span className="sticker-caption-handwritten">Set the 25-minute timer.</span>
            </div>

            {/* Step 3: Use the timer while working */}
            <div className="sticker-item-block step-3">
              <div className="sticker-badge-container">
                <WorkLaptopSticker size={105} />
              </div>
              <span className="sticker-caption-handwritten">Use the timer while working</span>
            </div>

            {/* Step 4: Take a 5 minute breaks */}
            <div className="sticker-item-block step-4">
              <div className="sticker-badge-container">
                <BobaTeaSticker size={105} />
              </div>
              <span className="sticker-caption-handwritten">Take a 5 minute breaks</span>
            </div>

            {/* Step 5: Take a notes */}
            <div className="sticker-item-block step-5">
              <div className="sticker-badge-container">
                <OpenJournalSticker size={105} />
              </div>
              <span className="sticker-caption-handwritten">Take a notes</span>
            </div>
          </div>

          {/* 3. Floating Accent Stickers */}
          <div className="floating-sticker pencil-pos" title="Pencil Sticker">
            <PencilSticker size={32} />
          </div>

          <div className="floating-sticker paperclip-pos" title="Paperclip Sticker">
            <PaperclipSticker size={28} />
          </div>

          <div className="floating-sticker coil-pos" title="Coil Doodle">
            <CoilDoodleSticker size={42} />
          </div>

          <div className="floating-sticker sparkle-pos" title="Sparkle Star">
            <SparkleStarSticker size={26} />
          </div>
        </div>

        {/* Footer Action */}
        <div className="sticker-modal-footer">
          <button className="primary-btn sticker-start-btn" onClick={onClose}>
            <span>Start My 25-Min Sprint</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
