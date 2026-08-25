import React, { useRef, useEffect, useState } from 'react';
import { Download, Copy, Check, X, Camera, Sparkles } from 'lucide-react';

export default function SessionSnapshotModal({
  isOpen,
  onClose,
  sessionTag = 'SESSION_01/04',
  modeLabel = 'WORK',
  activeMinutes = 25,
  isDarkMode = false
}) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Draw the high-resolution session receipt image on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 500;
    
    // Scale for crisp retina display
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // 1. Background
    const bgColor = isDarkMode ? '#171412' : '#FAF8F5';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(208, 90, 63, 0.07)';
    const textColor = isDarkMode ? '#FBF9F5' : '#1F1D1B';
    const mutedColor = isDarkMode ? '#9E968D' : '#7D7871';
    const primaryColor = isDarkMode ? '#E26D4B' : '#D05A3F';
    const borderColor = isDarkMode ? '#2E2722' : '#E8E1D5';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Blueprint Graph Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Outer Frame Border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, width - 56, height - 56);

    // 4. Corner Technical Brackets ⌜ ⌝ ⌞ ⌟
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    const bracketSize = 18;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(40, 40 + bracketSize);
    ctx.lineTo(40, 40);
    ctx.lineTo(40 + bracketSize, 40);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - 40 - bracketSize, 40);
    ctx.lineTo(width - 40, 40);
    ctx.lineTo(width - 40, 40 + bracketSize);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(40, height - 40 - bracketSize);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(40 + bracketSize, height - 40);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - 40 - bracketSize, height - 40);
    ctx.lineTo(width - 40, height - 40);
    ctx.lineTo(width - 40, height - 40 - bracketSize);
    ctx.stroke();

    // 5. Header: Brand & Protocol
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = primaryColor;
    ctx.fillText('TIMORA // ANALOG_LAB', 60, 72);

    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = mutedColor;
    ctx.textAlign = 'right';
    ctx.fillText('STATUS: VERIFIED FOCUS RECEIPT', width - 60, 72);
    ctx.textAlign = 'left';

    // Divider Line
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(60, 90);
    ctx.lineTo(width - 60, 90);
    ctx.stroke();

    // 6. Session Monospace Tag Badge
    ctx.fillStyle = isDarkMode ? 'rgba(226, 109, 75, 0.2)' : 'rgba(208, 90, 63, 0.12)';
    ctx.fillRect(60, 115, 140, 26);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 115, 140, 26);

    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.fillStyle = primaryColor;
    ctx.fillText(`• ${sessionTag}`, 72, 133);

    // 7. Mode & Duration Main Title
    ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText(`${modeLabel} SESSION`, 60, 190);

    // 8. Focus Duration Display (Big Numbers)
    ctx.font = '700 52px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = primaryColor;
    ctx.fillText(`${activeMinutes}:00`, 60, 265);

    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillStyle = mutedColor;
    ctx.fillText('MINUTES OF UNBROKEN FOCUS', 230, 240);

    ctx.font = '500 13px "JetBrains Mono", monospace';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    ctx.fillText(`COMPLETED ON ${dateStr.toUpperCase()} @ ${timeStr}`, 230, 265);

    // 9. Motivational Quote Box
    ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(60, 310, width - 120, 70);
    ctx.strokeStyle = borderColor;
    ctx.strokeRect(60, 310, width - 120, 70);

    ctx.font = 'italic 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText('“Discipline is choosing between what you want now and what you want most.”', 80, 342);

    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = primaryColor;
    ctx.fillText('— FOCUS PROTOCOL // ZERO DISTRACTIONS', 80, 364);

    // 10. Footer Details & Verification Stamp
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = mutedColor;
    ctx.fillText('SYSTEM_VERIFICATION: PASS [100%]', 60, 435);

    ctx.textAlign = 'right';
    ctx.fillText('timora.focus // session-based prototype', width - 60, 435);
    ctx.textAlign = 'left';

    // Generate preview URL
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setImageUrl(dataUrl);
    } catch {
      // ignore
    }
  }, [isOpen, sessionTag, modeLabel, activeMinutes, isDarkMode]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `timora-${sessionTag.toLowerCase().replace('/', '-')}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // fallback download
      handleDownload();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content session-snapshot-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Session Receipt Image</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Canvas Preview */}
        <div className="session-snapshot-body">
          <div className="canvas-preview-wrapper">
            <canvas 
              ref={canvasRef} 
              className="session-snapshot-canvas" 
              style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="session-snapshot-footer">
          <button className="snapshot-action-btn secondary" onClick={handleCopy}>
            {copied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
          </button>

          <button className="snapshot-action-btn primary" onClick={handleDownload}>
            <Download size={15} />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
