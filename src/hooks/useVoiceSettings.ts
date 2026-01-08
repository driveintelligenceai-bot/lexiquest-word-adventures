import { useState, useEffect, useCallback } from 'react';
import { useStickyState } from './useStickyState';

export interface VoiceSettings {
  enabled: boolean;
  voiceURI: string | null;
  rate: number;
  pitch: number;
  volume: number;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  enabled: true,
  voiceURI: null,
  rate: 0.9,
  pitch: 1.1,
  volume: 1.0,
};

// Popular kid-friendly voices sorted by preference (most popular first)
// Changed default to prioritize natural-sounding female voices for children
const PREFERRED_VOICES = [
  'Samantha',             // iOS/macOS - warm, friendly female voice (BEST for kids)
  'Karen',                // macOS Australian - clear and engaging
  'Moira',                // macOS Irish - gentle and melodic
  'Google UK English Female', // Clear British female voice
  'Microsoft Zira',       // Windows female - friendly tone
  'Google US English',    // Chrome - common but less warm
  'Daniel',               // macOS UK male
  'Microsoft David',      // Windows default male
  'Alex',                 // macOS male
  'Fiona',                // macOS Scottish
  'Google UK English Male',
];

export function useVoiceSettings() {
  const [settings, setSettings] = useStickyState<VoiceSettings>(
    DEFAULT_VOICE_SETTINGS,
    'lexia_voice_settings_v1'
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        // Filter for English voices and sort by preference
        const englishVoices = availableVoices.filter(v => 
          v.lang.startsWith('en') || v.lang === ''
        );
        
        // Sort by preferred voices
        englishVoices.sort((a, b) => {
          const aPreferred = PREFERRED_VOICES.findIndex(p => a.name.includes(p));
          const bPreferred = PREFERRED_VOICES.findIndex(p => b.name.includes(p));
          if (aPreferred === -1 && bPreferred === -1) return 0;
          if (aPreferred === -1) return 1;
          if (bPreferred === -1) return -1;
          return aPreferred - bPreferred;
        });

        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
        
        // Auto-select best voice: saved > preferred > first available
        const voiceList = englishVoices.length > 0 ? englishVoices : availableVoices;
        let bestVoice: SpeechSynthesisVoice | null = null;
        
        // Check for saved voice first
        if (settings.voiceURI) {
          bestVoice = availableVoices.find(v => v.voiceURI === settings.voiceURI) || null;
        }
        
        // If no saved voice, pick the most popular one available
        if (!bestVoice && voiceList.length > 0) {
          // The list is already sorted by preference, so first one is best
          bestVoice = voiceList[0];
          
          // Save this as the default for next time
          if (bestVoice && !settings.voiceURI) {
            setSettings(prev => ({ ...prev, voiceURI: bestVoice!.voiceURI }));
          }
        }
        
        setSelectedVoice(bestVoice);
        
        setIsLoaded(true);
      }
    };

    // Load immediately and on voiceschanged
    loadVoices();
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [settings.voiceURI]);

  // Speak function with current settings
  const speak = useCallback((text: string, overrideRate?: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!settings.enabled || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = overrideRate ?? settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }, [settings, selectedVoice]);

  // Speak phoneme (slower)
  const speakPhoneme = useCallback((phoneme: string): Promise<void> => {
    const phonemeGuide: Record<string, string> = {
      'a': 'ah', 'e': 'eh', 'i': 'ih', 'o': 'oh', 'u': 'uh',
      'sh': 'shh', 'ch': 'chh', 'th': 'thh', 'wh': 'whh', 'ck': 'ck',
    };
    const sound = phonemeGuide[phoneme.toLowerCase()] || phoneme;
    return speak(sound, 0.6);
  }, [speak]);

  // Speak word
  const speakWord = useCallback((word: string): Promise<void> => {
    return speak(word, 0.75);
  }, [speak]);

  // Preview voice
  const previewVoice = useCallback((voice: SpeechSynthesisVoice) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Hello! I'm your reading friend!");
    utterance.voice = voice;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    window.speechSynthesis.speak(utterance);
  }, [settings.rate, settings.pitch]);

  // Update settings
  const updateSettings = useCallback((updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    
    if (updates.voiceURI) {
      const newVoice = voices.find(v => v.voiceURI === updates.voiceURI);
      if (newVoice) setSelectedVoice(newVoice);
    }
  }, [voices, setSettings]);

  // Select voice by URI
  const selectVoice = useCallback((voiceURI: string) => {
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setSelectedVoice(voice);
      setSettings(prev => ({ ...prev, voiceURI }));
      previewVoice(voice);
    }
  }, [voices, setSettings, previewVoice]);

  return {
    settings,
    voices,
    selectedVoice,
    isLoaded,
    speak,
    speakPhoneme,
    speakWord,
    previewVoice,
    updateSettings,
    selectVoice,
  };
}
