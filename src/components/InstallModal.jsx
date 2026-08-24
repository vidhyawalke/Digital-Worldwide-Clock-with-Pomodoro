import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Monitor, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Layers, 
  BellRing, 
  Share2, 
  PlusSquare,
  ArrowRight,
  ExternalLink,
  Laptop,
  Check
} from 'lucide-react';
import timoraLogo from '../assets/timora-logo.jpg';

export default function InstallModal({
  isOpen,
  onClose,
  installPrompt,
  onInstallSuccess
}) {
  const [selectedPlatform, setSelectedPlatform] = useState('windows');
  const [isStandalone, setIsStandalone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBrowserTip, setShowBrowserTip] = useState(false);

  useEffect(() => {
    // Detect if already installed & running in standalone mode
    const isRunningStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;
    setIsStandalone(!!isRunningStandalone);

    // Auto-detect user's OS
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setSelectedPlatform('ios');
    } else if (/android/.test(ua)) {
      setSelectedPlatform('android');
    } else if (/macintosh|mac os x/.test(ua)) {
      setSelectedPlatform('mac');
    } else {
      setSelectedPlatform('windows');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        if (onInstallSuccess) onInstallSuccess();
        onClose();
      }
    } else {
      // Direct user attention to the browser install bar & open guide
      setShowBrowserTip(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content install-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <Download size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                Download Timora App
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Native desktop & mobile experience with zero installation overhead
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.25rem' }}>
          {/* App Branding & 1-Click Install Card */}
          <div className="install-hero-card">
            <div className="install-hero-left">
              <img 
                src={timoraLogo} 
                alt="Timora Logo" 
                className="install-hero-logo"
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>Timora</h4>
                  <span className="install-version-pill">v1.0 &bull; PWA</span>
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Focus. Time. Anywhere.
                </p>
              </div>
            </div>

            {/* Direct 1-Click Install Button Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {isStandalone ? (
                <div className="install-status-pill success">
                  <CheckCircle2 size={15} />
                  <span>Installed & Running</span>
                </div>
              ) : (
                <button 
                  className="primary-btn install-direct-btn"
                  onClick={handleInstallClick}
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  <Download size={16} />
                  <span>Install App Now</span>
                </button>
              )}

              <button 
                className="secondary-btn"
                onClick={handleCopyLink}
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                title="Copy direct app link to clipboard"
              >
                {copied ? <Check size={14} color="var(--success)" /> : <Share2 size={14} />}
                <span>{copied ? 'Copied!' : 'Share Link'}</span>
              </button>
            </div>
          </div>

          {/* Browser Address Bar Quick Tip Banner if native prompt is pending */}
          {showBrowserTip && !isStandalone && (
            <div style={{ 
              background: 'var(--primary-light)', 
              border: '1px solid rgba(255, 77, 109, 0.3)', 
              borderRadius: '8px', 
              padding: '0.75rem 1rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.825rem',
              color: 'var(--primary)',
              fontWeight: '500'
            }}>
              <Sparkles size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Direct Browser Install:</strong> Look at the <strong>top-right of your address bar</strong> and click the <strong>Install Timora icon (⊕ / 📥)</strong>, or open browser menu &rarr; <strong>"Install Timora"</strong>.
              </div>
            </div>
          )}

          {/* Key Native App Features */}
          <div className="install-features-grid">
            <div className="install-feature-item">
              <Zap size={15} color="var(--primary)" />
              <div>
                <strong>Instant Launch</strong>
                <p>Loads in under 1s with offline cache</p>
              </div>
            </div>
            <div className="install-feature-item">
              <Layers size={15} color="#0284C7" />
              <div>
                <strong>Distraction-Free</strong>
                <p>Runs in clean window without browser tabs</p>
              </div>
            </div>
            <div className="install-feature-item">
              <BellRing size={15} color="#059669" />
              <div>
                <strong>Taskbar & Dock</strong>
                <p>Pins directly to desktop and home screen</p>
              </div>
            </div>
          </div>

          {/* Platform Guide Tabs */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Select Your Device Platform:
              </span>
            </div>

            <div className="install-platform-tabs">
              <button 
                type="button"
                className={`install-tab-btn ${selectedPlatform === 'windows' ? 'active' : ''}`}
                onClick={() => setSelectedPlatform('windows')}
              >
                <Monitor size={14} />
                <span>Windows / PC</span>
              </button>
              <button 
                type="button"
                className={`install-tab-btn ${selectedPlatform === 'mac' ? 'active' : ''}`}
                onClick={() => setSelectedPlatform('mac')}
              >
                <Laptop size={14} />
                <span>macOS</span>
              </button>
              <button 
                type="button"
                className={`install-tab-btn ${selectedPlatform === 'ios' ? 'active' : ''}`}
                onClick={() => setSelectedPlatform('ios')}
              >
                <Smartphone size={14} />
                <span>iPhone / iPad</span>
              </button>
              <button 
                type="button"
                className={`install-tab-btn ${selectedPlatform === 'android' ? 'active' : ''}`}
                onClick={() => setSelectedPlatform('android')}
              >
                <Smartphone size={14} />
                <span>Android</span>
              </button>
            </div>

            {/* Platform Specific Instructions */}
            <div className="install-guide-box">
              {selectedPlatform === 'windows' && (
                <div className="guide-steps-list">
                  <div className="guide-step">
                    <span className="step-badge">1</span>
                    <p>In <strong>Chrome, Edge, or Brave</strong>, look at the right side of the address bar at the top.</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">2</span>
                    <p>Click the <strong>Install Timora</strong> icon (or menu &rarr; <strong>"Install Timora"</strong> / <strong>"Apps &rarr; Install"</strong>).</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">3</span>
                    <p>Click <strong>Install</strong> to add Timora to your Windows Start Menu and Taskbar.</p>
                  </div>
                </div>
              )}

              {selectedPlatform === 'mac' && (
                <div className="guide-steps-list">
                  <div className="guide-step">
                    <span className="step-badge">1</span>
                    <p>In <strong>Safari</strong> (macOS Sonoma or later): Click <strong>File &rarr; Add to Dock</strong>.</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">2</span>
                    <p>In <strong>Chrome or Edge</strong>: Click the <strong>Install icon</strong> in the top address bar.</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">3</span>
                    <p>Timora will open as a standalone macOS app in your Dock and Launchpad.</p>
                  </div>
                </div>
              )}

              {selectedPlatform === 'ios' && (
                <div className="guide-steps-list">
                  <div className="guide-step">
                    <span className="step-badge">1</span>
                    <p>Open this page in <strong>Safari</strong> on your iPhone or iPad.</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">2</span>
                    <p>Tap the <strong>Share button</strong> <Share2 size={13} style={{ verticalAlign: 'middle', display: 'inline' }} /> at the bottom toolbar.</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">3</span>
                    <p>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={13} style={{ verticalAlign: 'middle', display: 'inline' }} />, then tap <strong>Add</strong>.</p>
                  </div>
                </div>
              )}

              {selectedPlatform === 'android' && (
                <div className="guide-steps-list">
                  <div className="guide-step">
                    <span className="step-badge">1</span>
                    <p>Open this page in <strong>Chrome</strong> or <strong>Samsung Internet</strong> on Android.</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">2</span>
                    <p>Tap the <strong>three dots menu (⋮)</strong> in the top right corner.</p>
                  </div>
                  <div className="guide-step">
                    <span className="step-badge">3</span>
                    <p>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> to install immediately.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

