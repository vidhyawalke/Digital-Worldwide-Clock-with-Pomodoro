import React, { useState, useEffect } from 'react';

// Landing screen with dissolve animation into main app
export default function LandingScreen({ onComplete }) {
  const [phase, setPhase] = useState('visible'); // 'visible' | 'dissolving'

  useEffect(() => {
    // Show logo for 1.8s, then dissolve over 0.8s, then unmount
    const showTimer = setTimeout(() => setPhase('dissolving'), 1800);
    const doneTimer = setTimeout(() => onComplete(), 2600);
    return () => { clearTimeout(showTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <div className={`timora-landing-screen ${phase === 'dissolving' ? 'dissolving' : ''}`}>
      <div className="landing-content">
        <img
          src="./Timora_Logo_landing.png"
          alt="Timora"
          className="landing-logo"
        />
        <div className="landing-brand-text">Timora</div>
        <div className="landing-tagline">Focus. Flow. Finish.</div>
      </div>
    </div>
  );
}
