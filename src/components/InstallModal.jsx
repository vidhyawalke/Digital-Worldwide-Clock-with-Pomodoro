import { X, Download, Monitor, CheckCircle, Smartphone } from 'lucide-react';
import timoraLogo from '../assets/timora-logo.jpg';

/**
 * InstallModal Component
 * 
 * Beginner React Concepts:
 * 1. Handling PWA `beforeinstallprompt` event objects in React state.
 * 2. Providing native app install actions and platform-specific guides.
 */
export default function InstallModal({
  isOpen,
  onClose,
  installPrompt,
  onInstallSuccess
}) {
  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        if (onInstallSuccess) onInstallSuccess();
        onClose();
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card install-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Monitor size={20} color="var(--accent-cyan)" />
            <h2>Download Desktop App</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ textAlign: 'center' }}>
          <img 
            src={timoraLogo} 
            alt="Timora Brand" 
            className="install-brand-img"
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.75rem' }}>Timora</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Focus. Time. Anywhere.
          </p>

          {/* Quick Install Action (If browser supports native prompt) */}
          {installPrompt ? (
            <button 
              className="btn-primary-action install-action-btn"
              onClick={handleNativeInstall}
            >
              <Download size={18} />
              <span>Install to Desktop / Taskbar</span>
            </button>
          ) : (
            <div className="install-notice-badge">
              <CheckCircle size={16} color="var(--accent-emerald)" />
              <span>Quick Install Guide for Chrome, Edge & Safari</span>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div className="install-steps-container">
            <div className="install-step-card">
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>Chrome or Edge on PC/Mac</strong>
                <p>Click the <strong>Install icon</strong> in your browser address bar (top right) or open menu &rarr; <strong>Install Timora</strong>.</p>
              </div>
            </div>

            <div className="install-step-card">
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>macOS Dock / Safari</strong>
                <p>Open <strong>File</strong> menu &rarr; <strong>Add to Dock</strong> to run Timora as a dedicated window.</p>
              </div>
            </div>

            <div className="install-step-card">
              <div className="step-num">3</div>
              <div className="step-text">
                <strong>iPhone or Android</strong>
                <p>Tap Share &rarr; <strong>Add to Home Screen</strong> to install Timora instantly on your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
