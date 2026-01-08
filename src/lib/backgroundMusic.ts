// Soothing procedural background music for dyslexic children
// Uses Web Audio API to create gentle, calming ambient sounds

class BackgroundMusicEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private enabled = true;
  private volume = 0.15; // Very low default for background ambiance
  private oscillators: OscillatorNode[] = [];
  private intervalIds: number[] = [];
  
  // Soothing pentatonic scale notes (no dissonance)
  private readonly CALM_NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private getMasterGain(): GainNode {
    if (!this.masterGain) {
      const ctx = this.getContext();
      this.masterGain = ctx.createGain();
      this.masterGain.connect(ctx.destination);
      this.masterGain.gain.value = this.volume;
    }
    return this.masterGain;
  }

  loadSettings() {
    try {
      const savedEnabled = localStorage.getItem('lexia_music_enabled');
      const savedVolume = localStorage.getItem('lexia_music_volume');
      
      if (savedEnabled !== null) {
        this.enabled = JSON.parse(savedEnabled);
      }
      if (savedVolume !== null) {
        this.volume = JSON.parse(savedVolume);
      }
    } catch (e) {}
  }

  saveSettings() {
    try {
      localStorage.setItem('lexia_music_enabled', JSON.stringify(this.enabled));
      localStorage.setItem('lexia_music_volume', JSON.stringify(this.volume));
    } catch (e) {}
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
    
    if (enabled && !this.isPlaying) {
      this.start();
    } else if (!enabled && this.isPlaying) {
      this.stop();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(0.3, vol)); // Cap at 0.3 to keep gentle
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.getContext().currentTime, 0.1);
    }
    this.saveSettings();
  }

  getVolume(): number {
    return this.volume;
  }

  // Create a gentle, evolving pad sound
  private createPad(frequency: number, duration: number) {
    const ctx = this.getContext();
    const master = this.getMasterGain();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Soft sine wave
    osc.type = 'sine';
    osc.frequency.value = frequency;
    
    // Low-pass filter for warmth
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;
    
    // Smooth envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + duration * 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    
    this.oscillators.push(osc);
    
    // Cleanup
    osc.onended = () => {
      const idx = this.oscillators.indexOf(osc);
      if (idx > -1) this.oscillators.splice(idx, 1);
    };
  }

  // Create ambient nature-like shimmer
  private createShimmer() {
    const ctx = this.getContext();
    const master = this.getMasterGain();
    
    const frequency = this.CALM_NOTES[Math.floor(Math.random() * this.CALM_NOTES.length)] * 2; // Higher octave
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = frequency;
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    
    osc.connect(gain);
    gain.connect(master);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2);
    
    this.oscillators.push(osc);
  }

  // Create deep, warm bass drone
  private createBassDrone() {
    const ctx = this.getContext();
    const master = this.getMasterGain();
    
    const baseFreq = this.CALM_NOTES[0] / 2; // Low C
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.value = baseFreq;
    
    // Very subtle frequency wobble for organic feel
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1; // Very slow
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    gain.gain.value = 0.4;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    
    osc.start();
    
    this.oscillators.push(osc);
    this.oscillators.push(lfo);
    
    return osc;
  }

  start() {
    if (this.isPlaying || !this.enabled) return;
    
    // Resume context if suspended
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    this.isPlaying = true;
    
    // Start bass drone
    this.createBassDrone();
    
    // Schedule pad notes
    const padInterval = window.setInterval(() => {
      if (!this.isPlaying) return;
      
      const note = this.CALM_NOTES[Math.floor(Math.random() * this.CALM_NOTES.length)];
      this.createPad(note, 4 + Math.random() * 3);
      
      // Sometimes play a harmony
      if (Math.random() > 0.6) {
        const harmonyIdx = Math.floor(Math.random() * this.CALM_NOTES.length);
        setTimeout(() => {
          if (this.isPlaying) {
            this.createPad(this.CALM_NOTES[harmonyIdx], 3 + Math.random() * 2);
          }
        }, 500 + Math.random() * 1000);
      }
    }, 3000);
    
    // Schedule shimmer
    const shimmerInterval = window.setInterval(() => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.4) {
        this.createShimmer();
      }
    }, 2000);
    
    this.intervalIds.push(padInterval, shimmerInterval);
    
    // Initial notes
    this.createPad(this.CALM_NOTES[0], 5);
    setTimeout(() => {
      if (this.isPlaying) this.createPad(this.CALM_NOTES[4], 4);
    }, 1500);
  }

  stop() {
    this.isPlaying = false;
    
    // Clear intervals
    this.intervalIds.forEach(id => window.clearInterval(id));
    this.intervalIds = [];
    
    // Stop all oscillators gracefully
    const ctx = this.getContext();
    this.oscillators.forEach(osc => {
      try {
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        // Already stopped
      }
    });
    this.oscillators = [];
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      this.enabled = false;
    } else {
      this.enabled = true;
      this.start();
    }
    this.saveSettings();
    return this.isPlaying;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

export const backgroundMusic = new BackgroundMusicEngine();

// Initialize on load
backgroundMusic.loadSettings();
