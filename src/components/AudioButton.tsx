import React from 'react';
import { Volume2 } from 'lucide-react';

interface AudioButtonProps {
  text: string;
  size?: number;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ text, size = 24, className = '' }) => {
  const speak = (e: React.MouseEvent) => {
    e?.stopPropagation();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slower for processing
    utterance.pitch = 1.1; // Slightly higher for clarity
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      onClick={speak} 
      className={`audio-btn ${className}`}
      aria-label={`Read aloud: ${text}`}
    >
      <Volume2 size={size} />
    </button>
  );
};
