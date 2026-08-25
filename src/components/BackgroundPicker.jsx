import React, { useState, useRef } from 'react';
import { 
  X, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Upload, 
  Link2, 
  Image as ImageIcon, 
  Trash2,
  Sliders
} from 'lucide-react';
import { WALLPAPER_CATEGORIES } from '../data/wallpapers';

export default function BackgroundPicker({
  isOpen,
  onClose,
  currentWallpaper,
  onSelectWallpaper,
  onResetDefault,
  isDailyRefresh,
  setIsDailyRefresh,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customUrlError, setCustomUrlError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle local file upload (converts image to DataURL for immediate local display)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const customItem = {
        id: `custom_upload_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: dataUrl,
        isCustom: true
      };
      onSelectWallpaper(customItem);
    };
    reader.readAsDataURL(file);
  };

  // Handle custom image link input
  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    try {
      new URL(customUrlInput.trim());
      const customItem = {
        id: `custom_url_${Date.now()}`,
        title: 'Custom Web Wallpaper',
        url: customUrlInput.trim(),
        isCustom: true
      };
      onSelectWallpaper(customItem);
      setCustomUrlInput('');
      setCustomUrlError('');
    } catch {
      setCustomUrlError('Please enter a valid HTTP/HTTPS image URL.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content wallpaper-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          {selectedCategory ? (
            <div className="sub-gallery-header">
              <button 
                className="back-btn" 
                onClick={() => setSelectedCategory(null)}
                title="Back to categories"
              >
                <ArrowLeft size={18} />
              </button>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {selectedCategory.title}
              </h3>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={19} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Customize Background
              </h3>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="modal-close-btn" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scroll">
          {/* Top Quick Actions: Upload Image from Device & Paste URL */}
          {!selectedCategory && (
            <div className="custom-upload-section">
              <h4 className="upload-section-title">Use Your Own Image</h4>
              
              <div className="upload-actions-grid">
                {/* 1. Upload from Computer */}
                <div 
                  className="upload-drop-card" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload picture from your PC / Phone"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div className="upload-icon-circle">
                    <Upload size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <div className="upload-main-text">Upload from Device</div>
                    <div className="upload-sub-text">PNG, JPG, WEBP, GIF</div>
                  </div>
                </div>

                {/* 2. Paste Web Image URL */}
                <form onSubmit={handleCustomUrlSubmit} className="url-paste-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <Link2 size={15} color="var(--primary)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-main)' }}>Paste Image URL</span>
                  </div>
                  <div className="url-input-row">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={customUrlInput}
                      onChange={(e) => {
                        setCustomUrlInput(e.target.value);
                        if (customUrlError) setCustomUrlError('');
                      }}
                    />
                    <button type="submit" className="url-apply-btn">Apply</button>
                  </div>
                  {customUrlError && (
                    <span style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>
                      {customUrlError}
                    </span>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Active Wallpaper Preview & Clear */}
          {currentWallpaper && !selectedCategory && (
            <div className="current-active-wallpaper-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div 
                  className="active-wp-preview-thumb"
                  style={{
                    backgroundColor: currentWallpaper.isColor ? currentWallpaper.value : 'transparent',
                    backgroundImage: currentWallpaper.url ? `url(${currentWallpaper.url})` : 'none'
                  }}
                ></div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Active Wallpaper: {currentWallpaper.title || 'Custom Image'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Custom background is applied to your workspace.
                  </div>
                </div>
              </div>
              <button 
                className="clear-wp-btn" 
                onClick={onResetDefault}
                title="Restore default clean theme"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            </div>
          )}

          {/* VIEW 1: Category Gallery Overview */}
          {!selectedCategory ? (
            <div className="categories-gallery-section">
              <h4 className="upload-section-title">Curated Gallery & Themes</h4>
              <div className="gallery-categories-grid">
                {WALLPAPER_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="gallery-cat-card"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div 
                      className="cat-preview-thumb" 
                      style={{ 
                        backgroundImage: `url(${cat.cover})`,
                        backgroundColor: cat.type === 'color' ? '#9b87c4' : 'transparent'
                      }}
                    ></div>
                    <span className="cat-card-name">{cat.title}</span>
                  </div>
                ))}
              </div>

              {/* Restore Default Button */}
              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <button className="restore-default-link-btn" onClick={onResetDefault}>
                  <Sparkles size={14} />
                  <span>Restore Clean Minimalist Default</span>
                </button>
              </div>
            </div>
          ) : (
            /* VIEW 2: Sub-gallery items grid */
            <div className="subgallery-items-grid">
              {selectedCategory.items.map((item) => {
                const isSelected = 
                  (item.isColor && currentWallpaper?.value === item.value) ||
                  (!item.isColor && currentWallpaper?.url === item.url);

                return (
                  <div
                    key={item.id}
                    className={`subgallery-thumb-card ${isSelected ? 'active-thumb' : ''}`}
                    onClick={() => onSelectWallpaper(item)}
                    title={item.title}
                  >
                    {item.isColor ? (
                      <div 
                        className="thumb-color-fill" 
                        style={{ backgroundColor: item.value }}
                      >
                        {isSelected && <Check size={18} color="#ffffff" className="check-badge-icon" />}
                      </div>
                    ) : (
                      <div 
                        className="thumb-image-fill" 
                        style={{ backgroundImage: `url(${item.url})` }}
                      >
                        {isSelected && <Check size={18} color="#ffffff" className="check-badge-icon" />}
                      </div>
                    )}
                    <span className="thumb-item-label">{item.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
