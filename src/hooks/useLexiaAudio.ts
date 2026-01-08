import { useCallback, useRef } from 'react';

// Web Speech API audio system
interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
}

class LexiaAudioEngine {
  private audioContext: AudioContext | null = null;
  private speechRate = 0.9; // Slightly slower for dyslexic learners
  private enabled = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setSpeechRate(rate: number) {
    this.speechRate = rate;
  }

  // Text-to-Speech using Web Speech API
  speak(text: string, options: SpeakOptions = {}): Promise<void> {
    return new Promise((resolve) => {
      if (!this.enabled || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? this.speechRate;
      utterance.pitch = options.pitch ?? 1.0;
      
      // Try to use a friendly voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Google US English') ||
        v.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  // Speak a phoneme sound
  speakPhoneme(phoneme: string): Promise<void> {
    // For phonemes, we speak them clearly and slowly
    const phonemeText = this.getPhonemeSound(phoneme);
    return this.speak(phonemeText, { rate: 0.7, pitch: 1.1 });
  }

  // Speak a word with emphasis
  speakWord(word: string): Promise<void> {
    return this.speak(word, { rate: 0.8 });
  }

  // Get phoneme pronunciation guide
  private getPhonemeSound(phoneme: string): string {
    const phonemeGuide: Record<string, string> = {
      'a': 'ah',
      'e': 'eh',
      'i': 'ih',
      'o': 'oh',
      'u': 'uh',
      'sh': 'shh',
      'ch': 'chh',
      'th': 'thh',
      'wh': 'whh',
      'ck': 'ck',
    };
    return phonemeGuide[phoneme.toLowerCase()] || phoneme;
  }

  // Sound effects using Web Audio API
  playEffect(effect: 'tap' | 'correct' | 'tryAgain' | 'complete' | 'levelUp' | 'hint') {
    if (!this.enabled) return;
    const ctx = this.getContext();

    switch (effect) {
      case 'tap':
        this.playTap(ctx);
        break;
      case 'correct':
        this.playCorrect(ctx);
        break;
      case 'tryAgain':
        this.playTryAgain(ctx);
        break;
      case 'complete':
        this.playComplete(ctx);
        break;
      case 'levelUp':
        this.playLevelUp(ctx);
        break;
      case 'hint':
        this.playHint(ctx);
        break;
    }
  }

  private playTap(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }

  private playCorrect(ctx: AudioContext) {
    // Happy ascending arpeggio
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15);
      
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.15);
    });
  }

  private playTryAgain(ctx: AudioContext) {
    // Gentle descending - NOT harsh
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }

  private playComplete(ctx: AudioContext) {
    // Triumphant fanfare
    const melody = [392, 523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.35);
      
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.35);
    });
  }

  private playLevelUp(ctx: AudioContext) {
    // Epic level up with sparkles
    const melody = [262, 330, 392, 523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.4);
      
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.4);
    });

    // Sparkle overlay
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(2000 + Math.random() * 2000, ctx.currentTime + i * 0.05);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.1);
      
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.1);
    }
  }

  private playHint(ctx: AudioContext) {
    // Gentle bell for hint
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  }
}

// Singleton instance
export const lexiaAudio = new LexiaAudioEngine();

// React hook for audio
export function useLexiaAudio() {
  const speak = useCallback((text: string, options?: SpeakOptions) => {
    return lexiaAudio.speak(text, options);
  }, []);

  const speakPhoneme = useCallback((phoneme: string) => {
    return lexiaAudio.speakPhoneme(phoneme);
  }, []);

  const speakWord = useCallback((word: string) => {
    return lexiaAudio.speakWord(word);
  }, []);

  const playEffect = useCallback((effect: 'tap' | 'correct' | 'tryAgain' | 'complete' | 'levelUp' | 'hint') => {
    lexiaAudio.playEffect(effect);
  }, []);

  return {
    speak,
    speakPhoneme,
    speakWord,
    playEffect,
    setRate: (rate: number) => lexiaAudio.setSpeechRate(rate),
    setEnabled: (enabled: boolean) => lexiaAudio.setEnabled(enabled),
  };
}
