import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';

interface WhisperProps {
  message?: string;
  isVisible?: boolean;
  variant?: 'idle' | 'hint' | 'celebrate' | 'encourage';
  onTap?: () => void;
}

const WHISPER_MESSAGES = {
  idle: "I'm here to help!",
  hint: "Hmm, let me give you a hint...",
  celebrate: "Amazing work! You did it!",
  encourage: "You're doing great! Keep trying!",
};

export const Whisper: React.FC<WhisperProps> = ({
  message,
  isVisible = true,
  variant = 'idle',
  onTap,
}) => {
  const { speak, playEffect } = useLexiaAudio();

  const handleTap = () => {
    playEffect('tap');
    const textToSpeak = message || WHISPER_MESSAGES[variant];
    speak(textToSpeak);
    onTap?.();
  };

  if (!isVisible) return null;

  const bounceAnimation = {
    idle: { y: [0, -5, 0], transition: { duration: 2, repeat: Infinity } },
    hint: { rotate: [-5, 5, -5], transition: { duration: 0.5, repeat: Infinity } },
    celebrate: { scale: [1, 1.1, 1], transition: { duration: 0.3, repeat: 3 } },
    encourage: { y: [0, -8, 0], transition: { duration: 1, repeat: Infinity } },
  };

  return (
    <motion.button
      onClick={handleTap}
      className="relative flex items-center gap-3 p-3 bg-card rounded-2xl shadow-lg border-2 border-accent/30 hover:border-accent transition-colors"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Whisper the Owl */}
      <motion.div
        className="text-5xl"
        animate={bounceAnimation[variant]}
      >
        🦉
      </motion.div>

      {/* Speech bubble */}
      {message && (
        <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl max-w-[200px]">
          <p className="text-sm font-medium text-foreground leading-snug">
            {message}
          </p>
          <Volume2 size={16} className="text-accent shrink-0" />
        </div>
      )}

      {/* Pulsing ring when hint available */}
      {variant === 'hint' && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-accent"
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

// Floating Whisper button for quest screens
export const WhisperHintButton: React.FC<{
  hintsUsed: number;
  onRequestHint: () => void;
}> = ({ hintsUsed, onRequestHint }) => {
  const { playEffect } = useLexiaAudio();

  const handleClick = () => {
    playEffect('hint');
    onRequestHint();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-24 right-4 z-50 w-16 h-16 bg-card rounded-full shadow-lg border-2 border-accent/30 flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="text-4xl">🦉</span>
      {hintsUsed > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full text-xs font-bold text-white flex items-center justify-center">
          {hintsUsed}
        </span>
      )}
    </motion.button>
  );
};
