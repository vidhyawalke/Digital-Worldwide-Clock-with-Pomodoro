import React from 'react';

// ── 1. Scalloped Badge Frame Helper ──────────────────────────────────────────
export function ScallopedBadge({ children, size = 110, className = '' }) {
  return (
    <div 
      className={`scalloped-badge-wrapper ${className}`}
      style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Scalloped Flower / Cookie Shape Path */}
        <path
          d="M 60 4 
             C 67 4, 72 9, 78 8 
             C 85 7, 89 14, 95 16 
             C 101 19, 103 27, 108 31 
             C 112 36, 112 44, 114 50 
             C 116 57, 113 64, 112 70 
             C 110 77, 106 84, 102 89 
             C 97 95, 90 99, 84 103 
             C 78 107, 70 108, 63 111 
             C 56 113, 49 110, 42 110 
             C 35 109, 29 105, 23 101 
             C 17 97, 12 91, 8 85 
             C 5 79, 7 71, 5 64 
             C 4 58, 6 50, 9 44 
             C 12 38, 17 32, 22 28 
             C 28 23, 34 18, 41 14 
             C 47 11, 53 4, 60 4 Z"
          fill="#F3E7DC"
          stroke="#C8B3A0"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner subtle decorative ring */}
        <path
          d="M 60 10 
             C 66 10, 70 14, 76 13 
             C 82 12, 86 18, 91 20 
             C 96 23, 98 29, 102 33 
             C 106 37, 106 43, 107 49 
             C 109 55, 106 61, 105 66 
             C 103 72, 100 78, 96 82 
             C 92 87, 86 91, 80 94 
             C 75 97, 68 98, 62 100 
             C 56 102, 50 99, 44 99 
             C 38 98, 33 95, 28 91 
             C 23 88, 19 83, 15 78 
             C 13 73, 14 66, 13 60 
             C 12 54, 14 48, 16 43 
             C 19 38, 23 33, 27 30 
             C 32 26, 38 22, 44 18 
             C 49 16, 55 10, 60 10 Z"
          fill="#F9F2EB"
          stroke="#DBC8B8"
          strokeWidth="1.2"
          strokeDasharray="3 2"
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// ── 2. Sticker 1: "Set the tasks" (Pinboard / Notebook) ──────────────────────
export function SetTasksSticker({ size = 80 }) {
  return (
    <ScallopedBadge size={size}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 50" fill="none">
        {/* Board outline */}
        <rect x="2" y="2" width="56" height="46" rx="6" fill="#FDFBF7" stroke="#7D6553" strokeWidth="2.5" />
        <line x1="30" y1="6" x2="30" y2="44" stroke="#E6D7CA" strokeWidth="1.5" strokeDasharray="2 2" />
        
        {/* Left pinned sticky note */}
        <rect x="8" y="14" width="16" height="18" rx="2" fill="#B36A4C" transform="rotate(-6 8 14)" />
        {/* Tiny pin */}
        <circle cx="15" cy="14" r="2" fill="#7D6553" />
        {/* Tiny white heart */}
        <path d="M19 23 C19 21.5 17 21 16 22.5 C15 21 13 21.5 13 23 C13 25 16 26.5 16 26.5 C16 26.5 19 25 19 23 Z" fill="#FFFFFF" opacity="0.9" />
        
        {/* Right side checklist lines */}
        <line x1="34" y1="12" x2="50" y2="12" stroke="#7D6553" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="20" x2="52" y2="20" stroke="#A89485" strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="27" x2="48" y2="27" stroke="#A89485" strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="34" x2="44" y2="34" stroke="#A89485" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </ScallopedBadge>
  );
}

// ── 3. Sticker 2: "Set the 25-minute timer" (Vintage Clock) ───────────────────
export function ClockTimerSticker({ size = 80 }) {
  return (
    <ScallopedBadge size={size}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 60" fill="none">
        {/* Outer wooden bezel */}
        <circle cx="30" cy="30" r="26" fill="#EDE4D8" stroke="#7D6553" strokeWidth="3" />
        <circle cx="30" cy="30" r="21" fill="#FDFBF7" stroke="#C8B3A0" strokeWidth="1.5" />
        
        {/* Tick marks */}
        <line x1="30" y1="12" x2="30" y2="15" stroke="#7D6553" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="30" x2="45" y2="30" stroke="#7D6553" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="48" x2="30" y2="45" stroke="#7D6553" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="30" x2="15" y2="30" stroke="#7D6553" strokeWidth="2" strokeLinecap="round" />
        
        {/* 25-minute Clock hands (Pointing to 25 mins) */}
        {/* Hour hand */}
        <line x1="30" y1="30" x2="30" y2="19" stroke="#7D6553" strokeWidth="2.8" strokeLinecap="round" />
        {/* Minute hand pointing to 5 (25 mins mark) */}
        <line x1="30" y1="30" x2="41" y2="41" stroke="#B36A4C" strokeWidth="2.4" strokeLinecap="round" />
        
        {/* Center pivot dot */}
        <circle cx="30" cy="30" r="3" fill="#7D6553" />
      </svg>
    </ScallopedBadge>
  );
}

// ── 4. Sticker 3: "Use the timer while working" (Cozy Laptop) ─────────────────
export function WorkLaptopSticker({ size = 80 }) {
  return (
    <ScallopedBadge size={size}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 52" fill="none">
        {/* Screen Bezel */}
        <rect x="8" y="4" width="44" height="28" rx="4" fill="#FDFBF7" stroke="#7D6553" strokeWidth="2.5" />
        
        {/* Screen Content: Cute Bear with Leaf Sprout */}
        {/* Bear body */}
        <ellipse cx="28" cy="22" rx="10" ry="8" fill="#B59982" />
        <circle cx="21" cy="14" r="3" fill="#B59982" />
        <circle cx="35" cy="14" r="3" fill="#B59982" />
        {/* Cute face */}
        <circle cx="25" cy="19" r="1" fill="#4A3828" />
        <circle cx="31" cy="19" r="1" fill="#4A3828" />
        <ellipse cx="28" cy="21" rx="2" ry="1.5" fill="#E8D5C4" />
        <circle cx="28" cy="21" r="0.8" fill="#4A3828" />
        {/* Plant leaf sprout */}
        <path d="M36 17 Q40 13 41 16 Q39 20 36 18 Z" fill="#6A9955" />
        <line x1="36" y1="18" x2="33" y2="22" stroke="#6A9955" strokeWidth="1.5" />
        
        {/* Laptop Base */}
        <path d="M4 32 L56 32 L52 48 L8 48 Z" fill="#EDE4D8" stroke="#7D6553" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Keyboard keys lines */}
        <rect x="12" y="35" width="36" height="5" rx="1.5" fill="#C8B3A0" />
        {/* Trackpad */}
        <rect x="24" y="42" width="12" height="4" rx="1" fill="#FDFBF7" stroke="#7D6553" strokeWidth="1" />
      </svg>
    </ScallopedBadge>
  );
}

// ── 5. Sticker 4: "Take a 5 minute breaks" (Boba Tea Drink) ───────────────────
export function BobaTeaSticker({ size = 80 }) {
  return (
    <ScallopedBadge size={size}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 50 60" fill="none">
        {/* Straw */}
        <line x1="28" y1="4" x2="25" y2="20" stroke="#B36A4C" strokeWidth="5" strokeLinecap="round" />
        <line x1="28" y1="4" x2="25" y2="20" stroke="#7D4E38" strokeWidth="1" strokeLinecap="round" />
        
        {/* Cup Lid */}
        <ellipse cx="25" cy="18" rx="16" ry="4" fill="#E8D5C4" stroke="#7D6553" strokeWidth="2.2" />
        
        {/* Cup Body */}
        <path d="M11 18 L15 52 Q25 56 35 52 L39 18 Z" fill="#D4B69B" stroke="#7D6553" strokeWidth="2.5" />
        
        {/* Milk Tea Layer Gradient Highlight */}
        <path d="M12 24 L14 42 Q25 46 36 42 L38 24 Z" fill="#EADBC8" opacity="0.6" />
        
        {/* Boba Tapioca Pearls */}
        <circle cx="21" cy="46" r="3.2" fill="#604735" />
        <circle cx="29" cy="47" r="3" fill="#604735" />
        <circle cx="25" cy="41" r="3.2" fill="#604735" />
        <circle cx="18" cy="40" r="2.8" fill="#604735" />
        <circle cx="32" cy="41" r="2.8" fill="#604735" />
      </svg>
    </ScallopedBadge>
  );
}

// ── 6. Sticker 5: "Take a notes" (Open Botanical Journal) ─────────────────────
export function OpenJournalSticker({ size = 80 }) {
  return (
    <ScallopedBadge size={size}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 65 50" fill="none">
        {/* Book cover / shadow */}
        <path d="M4 12 Q32 18 60 12 L58 44 Q32 50 6 44 Z" fill="#C8B3A0" stroke="#7D6553" strokeWidth="2.5" />
        
        {/* Open Pages */}
        <path d="M6 10 Q32 16 32 42 Q19 40 8 42 Z" fill="#FDFBF7" stroke="#7D6553" strokeWidth="2" />
        <path d="M32 16 Q58 10 58 42 Q45 40 32 42 Z" fill="#FDFBF7" stroke="#7D6553" strokeWidth="2" />
        
        {/* Center Spine */}
        <line x1="32" y1="16" x2="32" y2="42" stroke="#7D6553" strokeWidth="2" />
        
        {/* Left page: Botanical fern/leaf illustration */}
        <path d="M14 26 Q18 20 22 28" stroke="#6A9955" strokeWidth="1.8" fill="none" />
        <circle cx="16" cy="22" r="1.5" fill="#6A9955" />
        <circle cx="20" cy="24" r="1.5" fill="#6A9955" />
        <circle cx="18" cy="29" r="1.5" fill="#6A9955" />
        
        {/* Highlight mark */}
        <ellipse cx="20" cy="17" rx="6" ry="1.8" fill="#99D98C" opacity="0.6" />
        
        {/* Right page: Polaroid / note with heart */}
        <rect x="38" y="20" width="14" height="15" rx="1.5" fill="#EDE4D8" stroke="#7D6553" strokeWidth="1.2" />
        <path d="M46 27 C46 25.8 44.5 25.4 43.8 26.5 C43.1 25.4 41.6 25.8 41.6 27 C41.6 28.5 43.8 29.8 43.8 29.8 C43.8 29.8 46 28.5 46 27 Z" fill="#B36A4C" />
      </svg>
    </ScallopedBadge>
  );
}

// ── 7. ACCENT STICKERS: Pencil, Paperclip, Crown, Sparkle, Coil ───────────────

export function PencilSticker({ size = 38, className = '' }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 24 40" fill="none" className={`sticker-anim ${className}`}>
      {/* Wooden Body */}
      <rect x="7" y="10" width="10" height="22" rx="1" fill="#D98A4B" stroke="#7D5329" strokeWidth="1.8" />
      <line x1="12" y1="10" x2="12" y2="32" stroke="#BF7336" strokeWidth="1.5" />
      {/* Ferrule (Metal) */}
      <rect x="7" y="5" width="10" height="5" fill="#C8B3A0" stroke="#7D5329" strokeWidth="1.5" />
      {/* Eraser */}
      <path d="M7 5 Q12 1 17 5 Z" fill="#E8998D" stroke="#7D5329" strokeWidth="1.5" />
      {/* Sharpened tip */}
      <path d="M7 32 L12 39 L17 32 Z" fill="#F4E5D3" stroke="#7D5329" strokeWidth="1.5" />
      {/* Graphite lead */}
      <path d="M10 36.5 L12 39 L14 36.5 Z" fill="#3D3833" />
    </svg>
  );
}

export function PaperclipSticker({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" className={`sticker-anim ${className}`}>
      <path
        d="M9 12 L9 21 C9 24.5 12 27 15 27 C18 27 21 24.5 21 21 L21 8 C21 5 18.5 3 15.5 3 C12.5 3 10 5 10 8 L10 20 C10 22 11.5 23.5 13.5 23.5 C15.5 23.5 17 22 17 20 L17 10"
        stroke="#9E8D7C"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrownSticker({ size = 42, className = '' }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 50 35" fill="none" className={`sticker-anim ${className}`}>
      <path
        d="M5 30 L45 30 L42 12 L30 20 L25 6 L20 20 L8 12 Z"
        fill="#E8D5C4"
        stroke="#A89485"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="12" r="2" fill="#B36A4C" />
      <circle cx="25" cy="6" r="2.5" fill="#B36A4C" />
      <circle cx="42" cy="12" r="2" fill="#B36A4C" />
    </svg>
  );
}

export function SparkleStarSticker({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" className={`sticker-anim ${className}`}>
      <path
        d="M15 2 Q15 15 28 15 Q15 15 15 28 Q15 15 2 15 Q15 15 15 2 Z"
        fill="#B59E8C"
        stroke="#8C7767"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CoilDoodleSticker({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 60 30" fill="none" className={`sticker-anim ${className}`}>
      <path
        d="M6 18 C12 6, 18 6, 18 18 C18 28, 24 28, 24 18 C24 6, 30 6, 30 18 C30 28, 36 28, 36 18 C36 6, 42 6, 42 18 C42 28, 48 28, 48 18 C48 6, 54 6, 54 18"
        stroke="#A89485"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BigCloudTitleSticker({ title = "Optimizing Your Time with the Pomodoro Technique" }) {
  return (
    <div className="pomodoro-cloud-sticker-header">
      <div className="cloud-crown-wrapper">
        <CrownSticker size={46} />
      </div>
      <div className="pomodoro-big-cloud">
        <h2 className="cloud-title-text">{title}</h2>
      </div>
      <div className="cloud-sparkle-wrapper">
        <SparkleStarSticker size={26} />
      </div>
    </div>
  );
}
