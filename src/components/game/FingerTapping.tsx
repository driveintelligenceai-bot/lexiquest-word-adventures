import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';

/**
 * FingerTapping Component
 * 
 * Wilson Reading System's signature "sound-tapping" technique.
 * Students tap thumb-to-finger for each phoneme before blending.
 * 
 * - Index finger = 1st sound
 * - Middle finger = 2nd sound  
 * - Ring finger = 3rd sound
 * - Pinky = 4th sound (for CCVC/CVCC words)
 * 
 * This builds phonological awareness through multisensory engagement.
 */

interface FingerTappingProps {
  /** The word to segment into phonemes */
  word: string;
  /** Phonemes array (e.g., ['m', 'a', 't'] for "mat") */
  phonemes: string[];
  /** Called when all phonemes have been tapped */
  onComplete: () => void;
  /** Whether to auto-advance after tapping all */
  autoAdvance?: boolean;
  /** Delay before auto-advance in ms */
  autoAdvanceDelay?: number;
  /** Show the word being built */
  showWord?: boolean;
}

// Finger positions for visual hand representation
const FINGER_CONFIG = [
  { id: 'index', label: '1st', x: 25, y: 10, rotation: -15 },
  { id: 'middle', label: '2nd', x: 45, y: 0, rotation: -5 },
  { id: 'ring', label: '3rd', x: 65, y: 5, rotation: 5 },
  { id: 'pinky', label: '4th', x: 82, y: 18, rotation: 15 },
];

// Thumb position (where fingers tap)
const THUMB_POSITION = { x: 10, y: 70 };

export const FingerTapping: React.FC<FingerTappingProps> = ({
  word,
  phonemes,
  onComplete,
  autoAdvance = true,
  autoAdvanceDelay = 1500,
  showWord = true,
}) => {
  const [tappedIndex, setTappedIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const { speakPhoneme, playEffect, speak } = useLexiaAudio();

  // Reset when word changes
  useEffect(() => {
    setTappedIndex(-1);
    setIsComplete(false);
  }, [word]);

  // Handle auto-advance after completion
  useEffect(() => {
    if (isComplete && autoAdvance) {
      const timer = setTimeout(() => {
        onComplete();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [isComplete, autoAdvance, autoAdvanceDelay, onComplete]);

  const handleFingerTap = useCallback((index: number) => {
    // Must tap in order
    if (index !== tappedIndex + 1) {
      playEffect('tryAgain');
      return;
    }

    // Tap this phoneme
    setTappedIndex(index);
    playEffect('tap');
    speakPhoneme(phonemes[index]);

    // Check if complete
    if (index === phonemes.length - 1) {
      setTimeout(() => {
        setIsComplete(true);
        playEffect('correct');
        speak(word);
      }, 600);
    }
  }, [tappedIndex, phonemes, word, speakPhoneme, playEffect, speak]);

  const handleReset = useCallback(() => {
    setTappedIndex(-1);
    setIsComplete(false);
    playEffect('tap');
  }, [playEffect]);

  // Determine vowel status for each phoneme
  const isVowel = (char: string) => ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Instructions */}
      <motion.p 
        className="text-lg font-medium text-muted-foreground mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isComplete 
          ? "Great! You tapped all the sounds! 🎉" 
          : "Tap each finger to sound out the word"
        }
      </motion.p>

      {/* Visual Hand with Tappable Fingers */}
      <div className="relative w-72 h-48 mb-6">
        {/* Palm background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-[60%] rounded-b-3xl opacity-60" />
        
        {/* Thumb (tap target indicator) */}
        <motion.div
          className="absolute w-12 h-16 bg-gradient-to-br from-amber-300 to-amber-200 rounded-full border-2 border-amber-400 flex items-center justify-center shadow-md"
          style={{ 
            left: `${THUMB_POSITION.x}%`, 
            top: `${THUMB_POSITION.y}%`,
            transform: 'rotate(-30deg)',
          }}
          animate={tappedIndex >= 0 && !isComplete ? { 
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <span className="text-lg font-bold text-amber-800 rotate-[30deg]">👍</span>
        </motion.div>

        {/* Fingers */}
        {phonemes.slice(0, 4).map((phoneme, index) => {
          const finger = FINGER_CONFIG[index];
          const isTapped = index <= tappedIndex;
          const isNext = index === tappedIndex + 1;
          const vowel = isVowel(phoneme);

          return (
            <motion.button
              key={`${word}-${index}`}
              onClick={() => handleFingerTap(index)}
              disabled={isComplete}
              className={`
                absolute w-14 h-20 rounded-t-full rounded-b-lg
                flex flex-col items-center justify-center
                border-4 shadow-lg transition-all
                ${isTapped 
                  ? vowel 
                    ? 'bg-vowel border-vowel-border' 
                    : 'bg-consonant border-consonant-border'
                  : 'bg-gradient-to-b from-amber-100 to-amber-200 border-amber-300'
                }
                ${isNext && !isComplete ? 'ring-4 ring-accent animate-pulse' : ''}
                ${isComplete ? 'cursor-default' : 'cursor-pointer active:scale-95'}
              `}
              style={{
                left: `${finger.x}%`,
                top: `${finger.y}%`,
                transform: `rotate(${finger.rotation}deg)`,
              }}
              whileHover={!isComplete ? { y: -5 } : undefined}
              whileTap={!isComplete ? { scale: 0.9 } : undefined}
              aria-label={`Tap for sound ${index + 1}: ${phoneme}`}
            >
              {/* Phoneme display when tapped */}
              <AnimatePresence>
                {isTapped && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-2xl font-black ${
                      vowel ? 'text-vowel-text' : 'text-consonant-text'
                    }`}
                    style={{ transform: `rotate(${-finger.rotation}deg)` }}
                  >
                    {phoneme}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Finger number when not tapped */}
              {!isTapped && (
                <span 
                  className="text-sm font-bold text-amber-700"
                  style={{ transform: `rotate(${-finger.rotation}deg)` }}
                >
                  {finger.label}
                </span>
              )}
            </motion.button>
          );
        })}

        {/* Connection lines showing tap-to-thumb motion */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {phonemes.slice(0, 4).map((_, index) => {
            const finger = FINGER_CONFIG[index];
            const isTapped = index <= tappedIndex;
            
            return isTapped ? (
              <motion.line
                key={`line-${index}`}
                x1={finger.x + 7}
                y1={finger.y + 20}
                x2={THUMB_POSITION.x + 6}
                y2={THUMB_POSITION.y + 8}
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                strokeDasharray="4 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.3 }}
              />
            ) : null;
          })}
        </svg>
      </div>

      {/* Built word display */}
      {showWord && (
        <div className="flex gap-2 mb-6 min-h-[4rem]">
          {phonemes.map((phoneme, index) => {
            const isTapped = index <= tappedIndex;
            const vowel = isVowel(phoneme);

            return (
              <motion.div
                key={`built-${index}`}
                className={`
                  w-14 h-16 rounded-xl border-4 flex items-center justify-center
                  text-3xl font-black transition-all
                  ${isTapped 
                    ? vowel 
                      ? 'bg-vowel border-vowel-border text-vowel-text' 
                      : 'bg-consonant border-consonant-border text-consonant-text'
                    : 'bg-muted border-border text-muted-foreground/30'
                  }
                `}
                animate={isTapped ? { scale: [1, 1.1, 1] } : {}}
              >
                {isTapped ? phoneme : '?'}
              </motion.div>
            );
          })}

          {/* Completion checkmark */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-14 h-16 flex items-center justify-center text-3xl"
              >
                ✓
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Reset button */}
      {tappedIndex >= 0 && !isComplete && (
        <motion.button
          onClick={handleReset}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-muted text-muted-foreground rounded-xl font-medium text-sm"
        >
          Start Over
        </motion.button>
      )}
    </div>
  );
};

export default FingerTapping;
