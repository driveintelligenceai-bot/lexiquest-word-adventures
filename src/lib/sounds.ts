// Web Audio API Sound Effects System - Gentle, kid-friendly sounds
class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  private volume = 0.3; // Lower default volume for gentle sounds

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    // Persist to localStorage
    try {
      localStorage.setItem('lexia_sound_enabled', JSON.stringify(enabled));
    } catch (e) {}
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('lexia_sound_enabled');
      if (saved !== null) {
        this.enabled = JSON.parse(saved);
      }
    } catch (e) {}
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Soft tap sound - gentle click
  tap() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }

  // Soft pop for selections
  pop() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(this.volume * 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  // Success sound - gentle ascending chime
  success() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    const notes = [523, 659, 784]; // C5, E5, G5 - major chord
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(this.volume * 0.6, ctx.currentTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
      
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.25);
    });
  }

  // Quest complete - warm fanfare
  questComplete() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    const notes = [392, 523, 659, 784]; // G4, C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      osc.type = 'triangle';
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(this.volume * 0.5, ctx.currentTime + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
      
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.35);
    });
  }

  // Achievement unlock - magical sparkle
  achievement() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    // Sparkle notes
    const sparkles = [1047, 1319, 1568, 2093]; // C6, E6, G6, C7
    sparkles.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
      
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });

    // Add a gentle shimmer
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(2500 + Math.random() * 1500, ctx.currentTime + 0.3 + i * 0.04);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime + 0.3 + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3 + i * 0.04 + 0.1);
      
      osc.start(ctx.currentTime + 0.3 + i * 0.04);
      osc.stop(ctx.currentTime + 0.3 + i * 0.04 + 0.1);
    }
  }

  // Level up - triumphant but gentle
  levelUp() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    const melody = [262, 330, 392, 523, 659, 784];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, ctx.currentTime + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.4);
      
      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.4);
    });
  }

  // Treasure found - magical discovery
  treasure() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    // Descending then ascending sparkle
    const notes = [1047, 880, 784, 880, 1047, 1319];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(this.volume * 0.45, ctx.currentTime + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
      
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.25);
    });
  }

  // Gentle encouragement - soft hint
  hint() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(523, ctx.currentTime + 0.15);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(this.volume * 0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  // Soft error - gentle "oops"
  error() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.15);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  // Purchase/collect - coin chime
  purchase() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(1047, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.1);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  // Streak - fire crackle
  streak() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(600 + i * 150, ctx.currentTime + i * 0.1);
      osc.type = 'triangle';
      
      gain.gain.setValueAtTime(this.volume * 0.35, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
      
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.15);
    }
  }
}

export const sounds = new SoundEngine();

// Initialize on load
sounds.loadSettings();
