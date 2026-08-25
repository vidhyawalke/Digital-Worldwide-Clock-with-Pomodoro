import React, { useState } from 'react';
import { Link2 } from 'lucide-react';

export default function CleanYouTubeCard() {
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
    <div className="clean-right-widget-card clean-youtube-widget">
      {/* Header */}
      <div className="clean-widget-header">
        <h3 className="clean-widget-title">YouTube Study Player</h3>
        <button 
          className="clean-header-link-btn"
          onClick={() => setShowInput(!showInput)}
        >
          <Link2 size={12} />
          <span>Custom</span>
        </button>
      </div>

      {/* Custom Link Input (toggled on demand) */}
      {showInput && (
        <form onSubmit={handleCustomSubmit} className="clean-yt-input-row">
          <input
            type="text"
            placeholder="Paste YouTube video link..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            autoFocus
          />
          <button type="submit">Play</button>
        </form>
      )}

      {/* 16:9 iFrame Player */}
      <div className="clean-youtube-iframe-box">
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
          title="YouTube study player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
