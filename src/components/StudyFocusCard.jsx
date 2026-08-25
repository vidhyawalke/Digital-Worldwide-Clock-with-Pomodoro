import React, { useState } from 'react';
import { Play, Link2, Volume2, Sparkles, Music2, ExternalLink } from 'lucide-react';

const STUDY_PRESETS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Girl Live' },
  { id: 'lTRuBLICdyw', title: 'Lofi Beats' },
  { id: 'e_KxYn22u4k', title: 'Chill Study' },
  { id: 'A65aJ9L8O5A', title: 'Deep Focus' },
  { id: 'P697j6o1a-U', title: 'Peaceful Piano' },
  { id: 'nMfPqeZjc2c', title: 'Rain & Thunder' },
];

export default function StudyFocusCard({ onOpenFullYouTube }) {
  const [videoId, setVideoId] = useState('jfKfPfyJRdk');
  const [customUrl, setCustomUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

  const extractVideoId = (url) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = cleanUrl.match(regExp);
    return match ? match[1] : null;
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const extracted = extractVideoId(customUrl);
    if (extracted) {
      setVideoId(extracted);
      setCustomUrl('');
      setShowInput(false);
    }
  };

  return (
    <div className="study-focus-banner-card">
      {/* Category Tag */}
      <div className="study-banner-header">
        <span className="study-badge-dot"></span>
        <span className="study-badge-text">STUDY WITH FOCUS</span>
      </div>

      <div className="study-split-layout">
        {/* Left Side: Embedded Video Player */}
        <div className="study-player-col">
          <div className="study-iframe-wrapper">
            <iframe
              key={videoId}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
              title="YouTube focus study player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* Quick presets pills */}
          <div className="study-presets-row">
            {STUDY_PRESETS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                className={`study-preset-chip ${videoId === p.id ? 'active' : ''}`}
                onClick={() => setVideoId(p.id)}
              >
                {p.title}
              </button>
            ))}
            <button 
              className="study-preset-chip custom-trigger"
              onClick={() => setShowInput(!showInput)}
            >
              + Custom
            </button>
          </div>

          {showInput && (
            <form onSubmit={handleCustomSubmit} className="study-custom-url-form">
              <input
                type="text"
                placeholder="Paste YouTube link..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                autoFocus
              />
              <button type="submit">Play</button>
            </form>
          )}
        </div>

        {/* Right Side: Copy & CTA */}
        <div className="study-copy-col">
          <h3 className="study-copy-title">
            Study better with<br />focus music
          </h3>
          <p className="study-copy-desc">
            Play calming lo-fi beats on YouTube while you work. It helps improve concentration and keeps distractions away.
          </p>

          <div className="study-action-row">
            <button 
              className="study-open-btn"
              onClick={onOpenFullYouTube}
            >
              <Play size={14} fill="currentColor" />
              <span>Open Study Player</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
