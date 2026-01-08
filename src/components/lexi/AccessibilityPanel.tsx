import React from 'react';
import { X, Type, Volume2, Eye } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  dyslexiaFont: boolean;
  speechRate: number;
}

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onChange: (settings: AccessibilitySettings) => void;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  settings,
  onChange,
  onClose,
}) => {
  const fontSizes = [
    { value: 'small' as const, label: 'A', size: 'text-sm' },
    { value: 'medium' as const, label: 'A', size: 'text-lg' },
    { value: 'large' as const, label: 'A', size: 'text-2xl' },
  ];

  const handleTest = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('Hello! This is a test of the speech rate.');
    utterance.rate = settings.speechRate;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-card rounded-3xl p-6 w-full max-w-sm shadow-2xl border-4 border-border">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Eye className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-foreground">Accessibility</h2>
          </div>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close accessibility panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            <Type size={16} />
            Text Size
          </label>
          <div className="flex gap-2">
            {fontSizes.map((fs) => (
              <button
                key={fs.value}
                onClick={() => onChange({ ...settings, fontSize: fs.value })}
                className={`flex-1 h-14 rounded-xl font-black transition-all active:scale-95 ${fs.size} ${
                  settings.fontSize === fs.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dyslexia Font Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            <Type size={16} />
            Dyslexia-Friendly Font
          </label>
          <button
            onClick={() => onChange({ ...settings, dyslexiaFont: !settings.dyslexiaFont })}
            className={`w-full h-14 rounded-xl font-bold text-lg transition-all active:scale-95 ${
              settings.dyslexiaFont
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {settings.dyslexiaFont ? 'OpenDyslexic ON' : 'Lexend (Default)'}
          </button>
        </div>

        {/* Speech Rate Slider */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            <Volume2 size={16} />
            Speech Speed: {settings.speechRate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.speechRate}
            onChange={(e) => onChange({ ...settings, speechRate: parseFloat(e.target.value) })}
            className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={handleTest}
          className="w-full h-12 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          <Volume2 size={18} />
          Test Speech
        </button>
      </div>
    </div>
  );
};

export const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: 'medium',
  dyslexiaFont: false,
  speechRate: 0.85,
};

export type { AccessibilitySettings };
