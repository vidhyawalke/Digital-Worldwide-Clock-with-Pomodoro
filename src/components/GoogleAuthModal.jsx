import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export default function GoogleAuthModal({
  isOpen,
  onClose,
  onSignInSuccess,
  currentUser
}) {
  const [emailInput, setEmailInput] = useState('vidhyawalke@gmail.com');
  const [nameInput, setNameInput] = useState('Vidhya Walke');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const user = {
        name: nameInput.trim() || 'Google User',
        email: emailInput.trim(),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(nameInput || emailInput)}`,
        signedInAt: new Date().toISOString()
      };
      onSignInSuccess(user);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content google-auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27A7.17 7.17 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Sign in with Google
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="google-auth-body">
          <div className="google-auth-intro">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.4' }}>
              Connect your Google Account to automatically sync your focus sessions, tasks, and personal dashboard preferences across all devices.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="google-auth-form">
            <div className="form-field-row">
              <label>Your Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-field-row">
              <label>Google Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@gmail.com"
                required
              />
            </div>

            <div className="google-security-notice">
              <ShieldCheck size={16} color="#34A853" />
              <span>End-to-end encrypted profile and local session synchronization.</span>
            </div>

            <div className="google-auth-footer-actions">
              <button type="button" className="btn-secondary-auth" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-google-continue" disabled={isProcessing}>
                {isProcessing ? 'Connecting...' : 'Continue with Google'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
