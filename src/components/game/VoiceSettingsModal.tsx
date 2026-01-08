import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Play, Check } from 'lucide-react';
import { VoiceSettings } from '@/hooks/useVoiceSettings';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onUpdateSettings: (updates: Partial<VoiceSettings>) => void;
  onSelectVoice: (voiceURI: string) => void;
  onPreview: (voice: SpeechSynthesisVoice) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  voices,
  selectedVoice,
  onUpdateSettings,
  onSelectVoice,
  onPreview,
}) => {
  if (!isOpen) return null;

  const handleRateChange = (value: number) => {
    onUpdateSettings({ rate: value });
  };

  const handlePitchChange = (value: number) => {
    onUpdateSettings({ pitch: value });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-card rounded-3xl p-6 shadow-2xl border-4 border-border max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Volume2 className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">Voice Settings</h2>
                <p className="text-sm text-muted-foreground">Choose your reading friend!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 bg-muted rounded-full flex items-center justify-center active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Voice Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔊</span>
                <div>
                  <div className="font-bold">Voice On/Off</div>
                  <div className="text-sm text-muted-foreground">
                    {settings.enabled ? 'Voice is ON' : 'Voice is OFF'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ enabled: !settings.enabled })}
                className={`w-16 h-9 rounded-full transition-all ${
                  settings.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <motion.div
                  className="w-7 h-7 bg-white rounded-full shadow-md"
                  animate={{ x: settings.enabled ? 32 : 4 }}
                />
              </button>
            </div>

            {/* Voice Selection */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>🎤</span> Pick Your Voice Friend
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {voices.slice(0, 10).map((voice) => (
                  <button
                    key={voice.voiceURI}
                    onClick={() => onSelectVoice(voice.voiceURI)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between border-2 transition-all ${
                      selectedVoice?.voiceURI === voice.voiceURI
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-sm truncate max-w-[200px]">
                        {voice.name.replace(/Microsoft|Google|Apple/gi, '').trim()}
                      </div>
                      <div className="text-xs text-muted-foreground">{voice.lang}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreview(voice);
                        }}
                        className="h-8 w-8 bg-muted rounded-full flex items-center justify-center active:scale-95"
                      >
                        <Play size={14} />
                      </button>
                      {selectedVoice?.voiceURI === voice.voiceURI && (
                        <Check className="text-primary" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Slider */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>🐢🐇</span> Speaking Speed
              </h3>
              <div className="flex gap-2">
                {[
                  { value: 0.7, label: '🐢 Slow', desc: 'Take your time' },
                  { value: 0.9, label: '🚶 Normal', desc: 'Just right' },
                  { value: 1.1, label: '🐇 Fast', desc: 'Speed reader' },
                ].map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() => handleRateChange(speed.value)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      Math.abs(settings.rate - speed.value) < 0.05
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div className="text-xl mb-1">{speed.label.split(' ')[0]}</div>
                    <div className="text-xs font-bold">{speed.label.split(' ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Slider */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>🎵</span> Voice Pitch
              </h3>
              <div className="flex gap-2">
                {[
                  { value: 0.9, label: 'Low' },
                  { value: 1.0, label: 'Normal' },
                  { value: 1.2, label: 'High' },
                ].map((pitch) => (
                  <button
                    key={pitch.value}
                    onClick={() => handlePitchChange(pitch.value)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all font-bold ${
                      Math.abs(settings.pitch - pitch.value) < 0.05
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    {pitch.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full h-14 mt-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-[0_4px_0] shadow-primary/50 active:translate-y-1 active:shadow-none transition-all"
          >
            Done ✓
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
