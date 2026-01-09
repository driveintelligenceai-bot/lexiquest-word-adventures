import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export type NPCCharacter = 'whisper' | 'fox' | 'wizard' | 'fairy';
export type NPCMood = 'idle' | 'hint' | 'celebrate' | 'encourage' | 'thinking' | 'muted';

interface NPCGuideProps {
  character?: NPCCharacter;
  mood?: NPCMood;
  message?: string;
  autoSpeak?: boolean;
  onSpeak?: (message: string) => void;
  isVisible?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  streakReminderInterval?: number; // Minutes between streak reminders (default 5)
}

const NPC_DATA: Record<NPCCharacter, { emoji: string; name: string; defaultMessage: string }> = {
  whisper: { 
    emoji: '🦉', 
    name: 'Whisper', 
    defaultMessage: "Hoo! Need a hint? Tap me!" 
  },
  fox: { 
    emoji: '🦊', 
    name: 'Whiskers', 
    defaultMessage: "You're doing great! Keep going!" 
  },
  wizard: { 
    emoji: '🧙', 
    name: 'Merlin', 
    defaultMessage: "Magic is in the letters!" 
  },
  fairy: { 
    emoji: '🧚', 
    name: 'Sparkle', 
    defaultMessage: "Believe in yourself!" 
  },
};

const MOOD_ANIMATIONS: Record<NPCMood, { scale: number[]; rotate: number[]; y: number[] }> = {
  idle: { scale: [1, 1.02, 1], rotate: [0, 0, 0], y: [0, -3, 0] },
  hint: { scale: [1, 1.1, 1], rotate: [-5, 5, -5], y: [0, -5, 0] },
  celebrate: { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0], y: [0, -15, 0] },
  encourage: { scale: [1, 1.05, 1], rotate: [0, 3, -3, 0], y: [0, -4, 0] },
  thinking: { scale: [1, 1, 1], rotate: [0, -5, 5, 0], y: [0, 0, 0] },
  muted: { scale: [1, 0.98, 1], rotate: [0, 0, 0], y: [0, 0, 0] },
};

const SIZE_CLASSES = {
  sm: 'text-4xl',
  md: 'text-5xl',
  lg: 'text-7xl',
};

export const NPCGuide: React.FC<NPCGuideProps> = ({
  character = 'whisper',
  mood = 'idle',
  message,
  autoSpeak = false,
  onSpeak,
  isVisible = true,
  position = 'bottom-left',
  size = 'md',
  streakReminderInterval = 5,
}) => {
  const [showBubble, setShowBubble] = useState(!!message);
  const [isMuted, setIsMuted] = useState(false);
  const lastReminderRef = useRef<number>(0);
  const npc = NPC_DATA[character];
  const displayMessage = message || npc.defaultMessage;
  const animation = MOOD_ANIMATIONS[isMuted ? 'muted' : mood];
  
  // Check if this is a streak reminder and if enough time has passed
  const isStreakReminder = message?.toLowerCase().includes('streak');

  useEffect(() => {
    if (message) {
      const now = Date.now();
      const minInterval = streakReminderInterval * 60 * 1000; // Convert to ms
      
      // For streak reminders, check if enough time has passed
      if (isStreakReminder) {
        if (now - lastReminderRef.current < minInterval) {
          // Not enough time passed, don't show
          return;
        }
        lastReminderRef.current = now;
        setIsMuted(true); // Show muted icon for streak reminders
      } else {
        setIsMuted(false);
      }
      
      setShowBubble(true);
      if (autoSpeak && onSpeak && !isMuted) {
        onSpeak(message);
      }
    }
  }, [message, autoSpeak, onSpeak, streakReminderInterval, isStreakReminder]);

  useEffect(() => {
    if (showBubble && message) {
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showBubble, message]);

  const handleTap = () => {
    setShowBubble(true);
    if (onSpeak) {
      onSpeak(displayMessage);
    }
  };

  const positionClasses = {
    'bottom-left': 'fixed bottom-24 left-4 z-40',
    'bottom-right': 'fixed bottom-24 right-4 z-40',
    'floating': 'relative',
  };

  if (!isVisible) return null;

  return (
    <div className={positionClasses[position]}>
      <AnimatePresence>
        {/* Speech Bubble */}
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-0 mb-2 w-56 sm:w-64"
          >
            <div className="bg-card rounded-2xl p-3 shadow-lg border-2 border-border relative">
              <div className="flex items-start gap-2">
                <p className="text-sm font-medium text-foreground flex-1">
                  {displayMessage}
                </p>
                <button
                  onClick={() => onSpeak?.(displayMessage)}
                  className="h-8 w-8 bg-muted rounded-full flex items-center justify-center shrink-0 active:scale-95"
                >
                  {isMuted ? <VolumeX size={14} className="text-muted-foreground" /> : <Volume2 size={14} />}
                </button>
              </div>
              {/* Tail */}
              <div className="absolute -bottom-2 left-4 w-4 h-4 bg-card border-r-2 border-b-2 border-border transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NPC Character */}
      <motion.button
        onClick={handleTap}
        className={`${SIZE_CLASSES[size]} cursor-pointer active:scale-95 transition-transform`}
        animate={{
          scale: animation.scale,
          rotate: animation.rotate,
          y: animation.y,
        }}
        transition={{
          repeat: Infinity,
          duration: mood === 'celebrate' ? 0.5 : 2,
          ease: 'easeInOut',
        }}
        whileTap={{ scale: 0.9 }}
      >
        {npc.emoji}
      </motion.button>

      {/* Mood particles */}
      {mood === 'celebrate' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 60,
                y: -40 - Math.random() * 30,
                opacity: 0,
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              ⭐
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// Hook to get NPC dialogue based on context
export function useNPCDialogue(character: NPCCharacter = 'whisper') {
  const [dialogue, setDialogue] = useState<{ message: string; mood: NPCMood }>({
    message: '',
    mood: 'idle',
  });

  const hint = (customMessage?: string) => {
    const hints = [
      "Try sounding it out slowly!",
      "Listen to each letter sound!",
      "You're so close! Try again!",
      "Think about the sounds you know!",
    ];
    setDialogue({
      message: customMessage || hints[Math.floor(Math.random() * hints.length)],
      mood: 'hint',
    });
  };

  const celebrate = (customMessage?: string) => {
    const celebrations = [
      "Amazing job! 🎉",
      "You're a word wizard! ✨",
      "Brilliant! Keep going!",
      "That was perfect! 🌟",
    ];
    setDialogue({
      message: customMessage || celebrations[Math.floor(Math.random() * celebrations.length)],
      mood: 'celebrate',
    });
  };

  const encourage = (customMessage?: string) => {
    const encouragements = [
      "You can do it!",
      "Don't give up!",
      "Try one more time!",
      "You're learning so much!",
    ];
    setDialogue({
      message: customMessage || encouragements[Math.floor(Math.random() * encouragements.length)],
      mood: 'encourage',
    });
  };

  const idle = (customMessage?: string) => {
    setDialogue({
      message: customMessage || NPC_DATA[character].defaultMessage,
      mood: 'idle',
    });
  };

  return {
    dialogue,
    hint,
    celebrate,
    encourage,
    idle,
  };
}
