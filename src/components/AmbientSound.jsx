import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Coffee } from 'lucide-react';

/**
 * AmbientSound Component
 * 
 * Beginner React Concepts:
 * 1. useRef: Holds references to active Web Audio nodes without triggering component re-renders.
 * 2. Effect cleanup: Stops audio generators when component unmounts.
 */
export default function AmbientSound() {
  const [activeSound, setActiveSound] = useState(null);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  const stopCurrentSound = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      sourceNodeRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCurrentSound();
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const playAmbientNoise = (type) => {
    stopCurrentSound();

    if (activeSound === type) {
      setActiveSound(null);
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    const bufferSize = ctx.sampleRate * 2; // 2 seconds looping buffer
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate White / Pink / Brown noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain' || type === 'stream') {
        // Pink-ish noise filter
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else if (type === 'waves') {
        // Brown noise filter
        lastOut = (lastOut + 0.02 * white) / 1.02;
        output[i] = lastOut * 3.5;
      } else {
        // White noise
        output[i] = white * 0.3;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter frequency based on ambient sound mode
    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
    } else if (type === 'stream') {
      filter.type = 'bandpass';
      filter.frequency.value = 600;
    } else if (type === 'waves') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 8000;
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    sourceNodeRef.current = whiteNoise;
    gainNodeRef.current = gain;
    setActiveSound(type);
  };

  const soundOptions = [
    { id: 'rain', label: 'Rain Focus', icon: CloudRain },
    { id: 'stream', label: 'River Stream', icon: Wind },
    { id: 'waves', label: 'Ocean Waves', icon: Waves },
    { id: 'white', label: 'White Noise', icon: Coffee },
  ];

  return (
    <section className="glass-card ambient-card">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h3 className="section-title" style={{ fontSize: '1.05rem' }}>
          {activeSound ? <Volume2 size={18} color="var(--accent-cyan)" /> : <VolumeX size={18} />}
          <span>Focus Ambient Sound</span>
        </h3>
        {activeSound && (
          <button 
            className="city-toggle-btn" 
            onClick={() => { stopCurrentSound(); setActiveSound(null); }}
            style={{ fontSize: '0.8rem', color: 'var(--accent-rose)' }}
          >
            Mute Sound
          </button>
        )}
      </div>

      <div className="sound-buttons">
        {soundOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = activeSound === opt.id;
          return (
            <button
              key={opt.id}
              className={`sound-btn ${isSelected ? 'playing' : ''}`}
              onClick={() => playAmbientNoise(opt.id)}
            >
              <Icon size={20} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
