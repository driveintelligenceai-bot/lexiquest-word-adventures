import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Volume2, VolumeX, Music, MicOff, Mic, 
  Type, Eye, Palette, Zap, Moon, Sun,
  ChevronRight
} from 'lucide-react';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { sounds } from '@/lib/sounds';

export interface SoundSettings {
  masterVolume: boolean;       // Master toggle - overrides all
  voiceEnabled: boolean;       // Text-to-speech narration
  soundEffectsEnabled: boolean; // UI sounds, success/error
  musicEnabled: boolean;       // Background ambient music
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  dyslexiaFont: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  speechRate: number;
}

interface SettingsPanelProps {
  soundSettings: SoundSettings;
  accessibilitySettings: AccessibilitySettings;
  onSoundChange: (settings: Partial<SoundSettings>) => void;
  onAccessibilityChange: (settings: Partial<AccessibilitySettings>) => void;
  onClose: () => void;
  onTestVoice: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  soundSettings,
  accessibilitySettings,
  onSoundChange,
  onAccessibilityChange,
  onClose,
  onTestVoice,
}) => {
  const handleMasterToggle = (enabled: boolean) => {
    onSoundChange({ masterVolume: enabled });
    
    // Apply to all sound systems
    if (!enabled) {
      sounds.setEnabled(false);
      backgroundMusic.stop();
    } else {
      sounds.setEnabled(soundSettings.soundEffectsEnabled);
      if (soundSettings.musicEnabled) {
        backgroundMusic.start();
      }
    }
  };

  const handleMusicToggle = (enabled: boolean) => {
    onSoundChange({ musicEnabled: enabled });
    if (enabled && soundSettings.masterVolume) {
      backgroundMusic.start();
    } else {
      backgroundMusic.stop();
    }
  };

  const handleEffectsToggle = (enabled: boolean) => {
    onSoundChange({ soundEffectsEnabled: enabled });
    if (soundSettings.masterVolume) {
      sounds.setEnabled(enabled);
    }
  };

  const fontSizes = [
    { value: 'small' as const, label: 'A', size: 'text-sm' },
    { value: 'medium' as const, label: 'A', size: 'text-lg' },
    { value: 'large' as const, label: 'A', size: 'text-2xl' },
  ];

  const speechRates = [
    { value: 0.7, label: '🐢', name: 'Slow' },
    { value: 0.85, label: '🚶', name: 'Normal' },
    { value: 1.0, label: '🏃', name: 'Fast' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border-4 border-border"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card p-6 pb-4 border-b-2 border-border flex justify-between items-center z-10">
            <h2 className="text-2xl font-black text-foreground">Settings</h2>
            <button
              onClick={onClose}
              className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* === SOUND CONTROLS === */}
            <section>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Volume2 size={16} />
                Sound Controls
              </h3>

              {/* Master Sound Toggle */}
              <div className="bg-muted/50 rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {soundSettings.masterVolume ? (
                      <Volume2 className="text-primary" size={28} />
                    ) : (
                      <VolumeX className="text-muted-foreground" size={28} />
                    )}
                    <div>
                      <div className="font-bold text-lg">All Sounds</div>
                      <div className="text-sm text-muted-foreground">
                        Master volume control
                      </div>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={soundSettings.masterVolume}
                    onChange={handleMasterToggle}
                    size="lg"
                  />
                </div>
              </div>

              {/* Individual Sound Controls */}
              <div className={`space-y-2 ${!soundSettings.masterVolume ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Voice Narration */}
                <div className="bg-card rounded-xl p-4 border-2 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {soundSettings.voiceEnabled ? (
                        <Mic className="text-accent" size={22} />
                      ) : (
                        <MicOff className="text-muted-foreground" size={22} />
                      )}
                      <div>
                        <div className="font-bold">Voice Reading</div>
                        <div className="text-xs text-muted-foreground">Read text aloud</div>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={soundSettings.voiceEnabled}
                      onChange={(enabled) => onSoundChange({ voiceEnabled: enabled })}
                    />
                  </div>
                </div>

                {/* Sound Effects */}
                <div className="bg-card rounded-xl p-4 border-2 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔊</span>
                      <div>
                        <div className="font-bold">Sound Effects</div>
                        <div className="text-xs text-muted-foreground">Taps, wins, errors</div>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={soundSettings.soundEffectsEnabled}
                      onChange={handleEffectsToggle}
                    />
                  </div>
                </div>

                {/* Background Music */}
                <div className="bg-card rounded-xl p-4 border-2 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Music className={soundSettings.musicEnabled ? 'text-primary' : 'text-muted-foreground'} size={22} />
                      <div>
                        <div className="font-bold">Calm Music</div>
                        <div className="text-xs text-muted-foreground">Soothing background</div>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={soundSettings.musicEnabled}
                      onChange={handleMusicToggle}
                    />
                  </div>
                </div>
              </div>

              {/* Test Voice Button */}
              {soundSettings.masterVolume && soundSettings.voiceEnabled && (
                <motion.button
                  onClick={onTestVoice}
                  className="w-full mt-4 h-12 bg-accent text-accent-foreground rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Volume2 size={18} />
                  Test Voice
                </motion.button>
              )}
            </section>

            {/* === SPEECH SETTINGS === */}
            {soundSettings.voiceEnabled && soundSettings.masterVolume && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Mic size={16} />
                  Voice Speed
                </h3>
                <div className="flex gap-2">
                  {speechRates.map((rate) => (
                    <button
                      key={rate.value}
                      onClick={() => onAccessibilityChange({ speechRate: rate.value })}
                      className={`flex-1 py-4 rounded-xl font-bold transition-all flex flex-col items-center gap-1 ${
                        accessibilitySettings.speechRate === rate.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className="text-2xl">{rate.label}</span>
                      <span className="text-xs">{rate.name}</span>
                    </button>
                  ))}
                </div>
              </motion.section>
            )}

            {/* === READING SETTINGS === */}
            <section>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Eye size={16} />
                Reading & Focus
              </h3>

              {/* Text Size */}
              <div className="bg-card rounded-xl p-4 border-2 border-border mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <Type size={20} className="text-primary" />
                  <span className="font-bold">Text Size</span>
                </div>
                <div className="flex gap-2">
                  {fontSizes.map((fs) => (
                    <button
                      key={fs.value}
                      onClick={() => onAccessibilityChange({ fontSize: fs.value })}
                      className={`flex-1 h-14 rounded-xl font-black transition-all active:scale-95 ${fs.size} ${
                        accessibilitySettings.fontSize === fs.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dyslexia Font */}
              <div className="bg-card rounded-xl p-4 border-2 border-border mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type size={22} className="text-accent" />
                    <div>
                      <div className="font-bold">Dyslexia Font</div>
                      <div className="text-xs text-muted-foreground">Easier to read letters</div>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={accessibilitySettings.dyslexiaFont}
                    onChange={(enabled) => onAccessibilityChange({ dyslexiaFont: enabled })}
                  />
                </div>
              </div>

              {/* Reduce Motion */}
              <div className="bg-card rounded-xl p-4 border-2 border-border mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap size={22} className="text-yellow-500" />
                    <div>
                      <div className="font-bold">Reduce Motion</div>
                      <div className="text-xs text-muted-foreground">Less animations</div>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={accessibilitySettings.reduceMotion}
                    onChange={(enabled) => onAccessibilityChange({ reduceMotion: enabled })}
                  />
                </div>
              </div>

              {/* High Contrast */}
              <div className="bg-card rounded-xl p-4 border-2 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Sun size={22} className="text-foreground" />
                    </div>
                    <div>
                      <div className="font-bold">High Contrast</div>
                      <div className="text-xs text-muted-foreground">Stronger colors</div>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={accessibilitySettings.highContrast}
                    onChange={(enabled) => onAccessibilityChange({ highContrast: enabled })}
                  />
                </div>
              </div>
            </section>

            {/* Quick Mute Button */}
            <button
              onClick={() => handleMasterToggle(!soundSettings.masterVolume)}
              className={`w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all ${
                soundSettings.masterVolume
                  ? 'bg-destructive/10 text-destructive border-2 border-destructive/20'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {soundSettings.masterVolume ? (
                <>
                  <VolumeX size={24} />
                  Mute Everything
                </>
              ) : (
                <>
                  <Volume2 size={24} />
                  Turn Sound On
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Toggle Switch Component
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ enabled, onChange, size = 'md' }) => {
  const sizes = {
    sm: { track: 'w-10 h-6', thumb: 'w-4 h-4', translate: enabled ? 18 : 4 },
    md: { track: 'w-14 h-8', thumb: 'w-6 h-6', translate: enabled ? 28 : 4 },
    lg: { track: 'w-16 h-9', thumb: 'w-7 h-7', translate: enabled ? 32 : 4 },
  };

  const s = sizes[size];

  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`${s.track} rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-muted-foreground/30'
      }`}
    >
      <motion.div
        className={`${s.thumb} bg-white rounded-full shadow-md`}
        animate={{ x: s.translate }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

// Default settings exports
export const defaultSoundSettings: SoundSettings = {
  masterVolume: true,
  voiceEnabled: true,
  soundEffectsEnabled: true,
  musicEnabled: false,
};

export const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: 'medium',
  dyslexiaFont: true,
  reduceMotion: false,
  highContrast: false,
  speechRate: 0.85,
};
