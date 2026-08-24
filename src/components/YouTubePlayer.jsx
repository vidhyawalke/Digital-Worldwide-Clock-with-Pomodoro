import React, { useState, useEffect } from 'react';
import { Play, Link2, Minimize2, Maximize2 } from 'lucide-react';

/**
 * YouTubePlayer Component
 * 
 * Beginner React Concepts:
 * 1. String Parsing & Regular Expressions (Regex) in React state handlers.
 * 2. Continuous Video Looping via YouTube Embed API params (`loop=1&playlist=VIDEO_ID`).
 * 3. LocalStorage persistence for user preferences.
 */

// Popular study presets
const STUDY_PRESETS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Girl Live' },
  { id: '5qap5aO4i9A', title: 'Lofi Hip Hop' },
  { id: '4xDzrJKXOOY', title: 'Synthwave Radio' },
  { id: 'lTRiuFIWV54', title: 'Peaceful Piano' },
  { id: '1fueZCTYkpA', title: 'Coffee Shop Study' },
];

export default function YouTubePlayer() {
  const [inputUrl, setInputUrl] = useState('');
  const [videoId, setVideoId] = useState(() => {
    return localStorage.getItem('custom_yt_video_id') || 'jfKfPfyJRdk';
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (videoId) {
      localStorage.setItem('custom_yt_video_id', videoId);
    }
  }, [videoId]);

  const extractVideoId = (url) => {
    if (!url) return null;
    const cleanUrl = url.trim();

    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = cleanUrl.match(regExp);

    return match && match[1] ? match[1] : null;
  };

  const handleLoadVideo = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const extracted = extractVideoId(inputUrl);
    if (extracted) {
      setVideoId(extracted);
      setInputUrl('');
    } else {
      setErrorMsg('Please enter a valid YouTube video or stream link.');
    }
  };

  const handleSelectPreset = (presetId) => {
    setVideoId(presetId);
    setErrorMsg('');
  };

  return (
    <section className="glass-card yt-player-card">
      {/* Player Header */}
      <div className="section-header" style={{ marginBottom: '0.75rem' }}>
        <div className="section-title" style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#e11d48">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>YouTube Study Audio & Video</span>
        </div>

        <button 
          className="btn-icon-action" 
          style={{ width: '32px', height: '32px' }}
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? 'Expand Video' : 'Minimize Video'}
        >
          {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
        </button>
      </div>

      {/* Video URL Input Form */}
      <form onSubmit={handleLoadVideo} className="yt-input-group">
        <div className="yt-input-wrapper">
          <Link2 size={15} className="yt-input-icon" />
          <input
            type="text"
            className="yt-url-input"
            placeholder="Paste any YouTube video or playlist link..."
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </div>
        <button type="submit" className="btn-primary-action" style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}>
          <Play size={14} />
          <span>Play</span>
        </button>
      </form>

      {errorMsg && (
        <p style={{ color: 'var(--primary)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
          {errorMsg}
        </p>
      )}

      {/* Quick Study Presets */}
      <div className="yt-presets-row">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Presets:</span>
        {STUDY_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`yt-preset-chip ${videoId === preset.id ? 'active' : ''}`}
            onClick={() => handleSelectPreset(preset.id)}
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Responsive 16:9 Video Embed Player with Auto-Loop */}
      {!isMinimized && videoId && (
        <div className="yt-iframe-container">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {isMinimized && videoId && (
        <div className="yt-minimized-banner">
          <span>Audio playing in background. Click expand icon to view video.</span>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${videoId}`}
            title="YouTube background audio"
            style={{ display: 'none' }}
          ></iframe>
        </div>
      )}
    </section>
  );
}
