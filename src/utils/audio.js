/**
 * Audio Synthesizer using Web Audio API.
 * This runs natively in the browser without requiring external audio files.
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
  }

  // Initialize or resume the audio context on user interaction
  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Plays a gentle bell chime when a Pomodoro timer finishes
  playChime(type = 'complete') {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (type === 'complete') {
        // Multi-frequency harmonic bell tone
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        freqs.forEach((freq, index) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.12);

          gain.gain.setValueAtTime(0, now + index * 0.12);
          gain.gain.linearRampToValueAtTime(0.18, now + index * 0.12 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 1.6);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + index * 0.12);
          osc.stop(now + index * 0.12 + 1.8);
        });
      } else if (type === 'tick') {
        // Soft wooden click for second or button feedback
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'start') {
        // Upward energetic tone
        const notes = [440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      }
    } catch (err) {
      console.warn('Audio synthesis error:', err);
    }
  }
}

export const soundFx = new SoundSynthesizer();
