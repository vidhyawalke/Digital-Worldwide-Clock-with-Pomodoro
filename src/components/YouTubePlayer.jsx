import React, { useState, useEffect } from 'react';
import { Play, Link2, Minimize2, Maximize2, Volume2 } from 'lucide-react';

// Popular, reliable study & focus live streams/tracks
const STUDY_PRESETS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Girl Live' },
  { id: '5qap5aO4i9A', title: 'Lofi Hip Hop' },
  { id: '4xDzrJKXOOY', title: 'Synthwave Radio' },
  { id: 'lTRiuFIWV54', title: 'Peaceful Piano' },
  { id: 'M5QY2_8704o', title: 'Rain & Thunder' },
  { id: '1fueZCTYkpA', title: 'Coffee Shop' },
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

    // Direct 11-char video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    // Handles standard, share, embed, shorts, live URLs
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = cleanUrl.match(regExp);

    if (match && match[1]) {
      return match[1];
    }

    // Check for query param ?v=
    try {
      const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      const v = urlObj.searchParams.get('v');
      if (v && v.length === 11) return v;
    } catch {
      // ignore
    }

    return null;
  };

  const handleLoadVideo = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const extracted = extractVideoId(inputUrl);
    if (extracted) {
      setVideoId(extracted);
      setInputUrl('');
    } else {
      setErrorMsg('Please enter a valid YouTube video link (e.g., https://youtu.be/...)');
    }
  };

  const handleSelectPreset = (presetId) => {
    setVideoId(presetId);
    setErrorMsg('');
  };

  const getEmbedUrl = () => {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
  };

  return (
    <section className="glass-card yt-player-card">
      {/* Player Header */}
      <div className="section-header" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="section-title" style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4D6D">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>Focus Study Audio & Music</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Minimize / Maximize */}
          <button 
            type="button"
            className="btn-icon-action" 
            style={{ 
              width: '32px', 
              height: '32px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand Video Player' : 'Minimize to Background Audio'}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Video URL Input Form */}
      <form onSubmit={handleLoadVideo} className="yt-input-group" style={{ marginBottom: '0.65rem' }}>
        <div className="yt-input-wrapper">
          <Link2 size={15} className="yt-input-icon" />
          <input
            type="text"
            className="yt-url-input"
            placeholder="Paste any YouTube video or music link..."
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </div>
        <button type="submit" className="primary-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', borderRadius: '8px' }}>
          <Play size={13} />
          <span>Play</span>
        </button>
      </form>

      {errorMsg && (
        <p style={{ color: 'var(--primary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          {errorMsg}
        </p>
      )}

      {/* Quick Study Presets */}
      <div className="yt-presets-row" style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Presets:</span>
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

      {/* Responsive 16:9 Video Embed Player */}
      {!isMinimized && videoId && (
        <div className="yt-iframe-container" style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <iframe
            key={videoId}
            src={getEmbedUrl()}
            title="YouTube study player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {isMinimized && videoId && (
        <div className="yt-minimized-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'var(--bg-card-subtle)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Volume2 size={15} color="var(--primary)" />
            <span>Audio playing in background</span>
          </div>
          <button 
            type="button"
            className="secondary-btn"
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setIsMinimized(false)}
          >
            Show Video
          </button>
          <iframe
            key={`${videoId}-bg`}
            src={getEmbedUrl()}
            title="YouTube background audio"
            style={{ display: 'none' }}
            frameBorder="0"
            allow="autoplay"
          ></iframe>
        </div>
      )}
    </section>
  );
}
