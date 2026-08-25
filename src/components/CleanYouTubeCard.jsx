import React, { useState } from 'react';
import { 
  Headphones, 
  Link2, 
  Sparkles, 
  Radio, 
  Coffee,
  Check,
  Music
} from 'lucide-react';

const PRESET_STREAMS = [
  { id: 'TURbeWK2wwg', name: 'Lofi Chillhop', icon: Headphones },
  { id: '4xDzrJKXOOY', name: 'Synth Chill', icon: Radio },
  { id: 'WPni755-Krg', name: 'Coffee Rain', icon: Coffee },
  { id: '1fueZCTYkpA', name: 'Deep Piano', icon: Music },
];

export default function CleanYouTubeCard() {
  const [videoId, setVideoId] = useState('TURbeWK2wwg');
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
        <div className="clean-widget-title-wrap">
          <Headphones size={15} color="var(--primary)" />
          <h3 className="clean-widget-title">Study & Focus Audio</h3>
        </div>
        <button 
          className="clean-header-link-btn"
          onClick={() => setShowInput(!showInput)}
          title="Paste custom YouTube link"
        >
          <Link2 size={12} />
          <span>{showInput ? 'Presets' : 'Custom'}</span>
        </button>
      </div>

      {/* Preset Stream Buttons */}
      {!showInput ? (
        <div className="clean-yt-presets-row">
          {PRESET_STREAMS.map((preset) => {
            const Icon = preset.icon;
            const isActive = videoId === preset.id;
            return (
              <button
                key={preset.id}
                className={`clean-yt-preset-btn ${isActive ? 'active' : ''}`}
                onClick={() => setVideoId(preset.id)}
              >
                <Icon size={12} />
                <span>{preset.name}</span>
                {isActive && <Check size={10} strokeWidth={3} className="preset-check" />}
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleCustomSubmit} className="clean-yt-input-row">
          <input
            type="text"
            placeholder="Paste YouTube video link or ID..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            autoFocus
          />
          <button type="submit">Load</button>
        </form>
      )}

      {/* 16:9 Player Box */}
      <div className="clean-youtube-iframe-box">
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
          title="YouTube study ambient stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
