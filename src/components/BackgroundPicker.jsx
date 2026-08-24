import React, { useState } from 'react';
import { X, ArrowLeft, Check, Sparkles, RefreshCw } from 'lucide-react';
import { WALLPAPER_CATEGORIES } from '../data/wallpapers';

/**
 * BackgroundPicker Component
 * 
 * Beginner React Concepts:
 * 1. Modal Dialog & Portals/Overlays.
 * 2. Multi-View Navigation within a component (`selectedCategory` state: null for list, category object for details).
 * 3. Conditional Rendering based on view level.
 * 4. Callback functions passed down from parent to update background styles.
 */
export default function BackgroundPicker({
  isOpen,
  onClose,
  currentWallpaper,
  onSelectWallpaper,
  onResetDefault,
  isDailyRefresh,
  setIsDailyRefresh,
}) {
  // If null -> shows category overview. If set -> shows sub-gallery.
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          {selectedCategory ? (
            <div className="sub-gallery-header">
              <button 
                className="back-btn" 
                onClick={() => setSelectedCategory(null)}
                title="Back to categories"
              >
                <ArrowLeft size={20} />
              </button>
              <h2>{selectedCategory.title}</h2>
            </div>
          ) : (
            <h2>Customize background</h2>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {selectedCategory && (
              <div className="daily-refresh-toggle" title="Auto change background periodically">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Refresh daily</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isDailyRefresh}
                    onChange={(e) => setIsDailyRefresh(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            )}
            <button className="modal-close-btn" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* VIEW 1: Category Overview Cards (matching reference screenshots) */}
          {!selectedCategory ? (
            <div>
              <div className="category-grid">
                {WALLPAPER_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="category-card"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div 
                      className="category-preview" 
                      style={{ 
                        backgroundImage: `url(${cat.cover})`,
                        backgroundColor: cat.type === 'color' ? '#9b87c4' : 'transparent'
                      }}
                    ></div>
                    <span className="category-name">{cat.title}</span>
                  </div>
                ))}
              </div>

              {/* Reset to Default Button */}
              <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                <button className="control-btn" onClick={onResetDefault} style={{ margin: '0 auto' }}>
                  <Sparkles size={15} />
                  <span>Restore Default Dark Background</span>
                </button>
              </div>
            </div>
          ) : (
            /* VIEW 2: Sub-gallery items grid (3 columns matching reference screenshot 4) */
            <div className="wallpaper-items-grid">
              {selectedCategory.items.map((item) => {
                const isSelected = 
                  (item.isColor && currentWallpaper?.value === item.value) ||
                  (!item.isColor && currentWallpaper?.url === item.url);

                return (
                  <div
                    key={item.id}
                    className={`wallpaper-thumb-card ${isSelected ? 'active-thumb' : ''}`}
                    onClick={() => onSelectWallpaper(item)}
                    title={item.title}
                  >
                    {item.isColor ? (
                      <div 
                        className="thumb-color" 
                        style={{ backgroundColor: item.value }}
                      >
                        {isSelected && <Check size={20} color="#ffffff" className="check-badge" />}
                      </div>
                    ) : (
                      <div 
                        className="thumb-image" 
                        style={{ backgroundImage: `url(${item.url})` }}
                      >
                        {isSelected && <Check size={20} color="#ffffff" className="check-badge" />}
                      </div>
                    )}
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
