import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft, Star } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper, WhisperHintButton } from './Whisper';
import { SoundMatchChallenge, generateSoundMatchChallenge, isVowel } from '@/data/phonemes';

interface SoundMatchGameProps {
  wilsonStep?: number;
  questionsCount?: number;
  onComplete: (results: GameResults) => void;
  onBack: () => void;
}

interface GameResults {
  correct: number;
  total: number;
  hintsUsed: number;
  timeSeconds: number;
}

export const SoundMatchGame: React.FC<SoundMatchGameProps> = ({
  wilsonStep = 1,
  questionsCount = 5,
  onComplete,
  onBack,
}) => {
  const { speak, speakPhoneme, playEffect } = useLexiaAudio();
  
  const [challenges, setChallenges] = useState<SoundMatchChallenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());

  // Generate challenges on mount
  useEffect(() => {
    const generated = Array.from({ length: questionsCount }, () => 
      generateSoundMatchChallenge(wilsonStep)
    );
    setChallenges(generated);
    
    // Welcome message
    speak("Listen to the sound and tap the matching letter!");
  }, [wilsonStep, questionsCount]);

  // Auto-play sound when challenge changes
  useEffect(() => {
    if (challenges[currentIndex]) {
      setTimeout(() => {
        speakPhoneme(challenges[currentIndex].targetPhoneme);
      }, 500);
    }
  }, [currentIndex, challenges]);

  const currentChallenge = challenges[currentIndex];

  const handlePlaySound = useCallback(() => {
    if (currentChallenge) {
      playEffect('tap');
      speakPhoneme(currentChallenge.targetPhoneme);
    }
  }, [currentChallenge, speakPhoneme, playEffect]);

  const handleSelect = useCallback((letter: string) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelected(letter);
    speakPhoneme(letter);

    if (letter === currentChallenge?.correctAnswer) {
      // Correct!
      setIsCorrect(true);
      setCorrectCount(c => c + 1);
      playEffect('correct');
      speak("Great job!", { rate: 1.1 });

      // Move to next after celebration
      setTimeout(() => {
        if (currentIndex < questionsCount - 1) {
          setCurrentIndex(i => i + 1);
          setSelected(null);
          setIsCorrect(null);
          setAttempts(0);
          setShowHint(false);
        } else {
          // Game complete!
          const timeSeconds = Math.round((Date.now() - startTime) / 1000);
          playEffect('complete');
          onComplete({
            correct: correctCount + 1,
            total: questionsCount,
            hintsUsed,
            timeSeconds,
          });
        }
      }, 1500);
    } else {
      // Try again
      setAttempts(a => a + 1);
      playEffect('tryAgain');
      
      // Shake animation feedback
      setTimeout(() => setSelected(null), 500);

      // Show hint after 2 wrong attempts
      if (attempts >= 1) {
        setShowHint(true);
      }
    }
  }, [currentChallenge, currentIndex, questionsCount, correctCount, hintsUsed, startTime, attempts]);

  const handleHint = useCallback(() => {
    setHintsUsed(h => h + 1);
    setShowHint(true);
    speak(`The sound is ${currentChallenge?.targetSound}. Listen again!`);
    setTimeout(() => speakPhoneme(currentChallenge?.targetPhoneme || ''), 1500);
  }, [currentChallenge, speak, speakPhoneme]);

  if (!currentChallenge) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-2xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="h-12 w-12 rounded-full bg-muted flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
        
        {/* Progress */}
        <div className="flex items-center gap-2">
          {Array.from({ length: questionsCount }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < currentIndex ? 'bg-primary' : 
                i === currentIndex ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Stars earned */}
        <div className="flex items-center gap-1">
          <Star className="text-accent fill-accent" size={20} />
          <span className="font-bold">{correctCount}</span>
        </div>
      </div>

      {/* Whisper intro */}
      <AnimatePresence mode="wait">
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Whisper 
              message={`Try the letter "${currentChallenge.correctAnswer}"!`}
              variant="hint"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tap the letter that makes this sound:
        </h2>
      </div>

      {/* Sound Play Button */}
      <motion.button
        onClick={handlePlaySound}
        className="mx-auto mb-12 w-32 h-32 bg-primary rounded-3xl flex flex-col items-center justify-center shadow-lg border-b-4 border-primary/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Volume2 className="text-primary-foreground mb-2" size={48} />
        <span className="text-primary-foreground font-bold text-sm">Play Sound</span>
      </motion.button>

      {/* Letter Options */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {currentChallenge.options.map((letter) => {
          const vowel = isVowel(letter);
          const isSelected = selected === letter;
          const correct = isCorrect && isSelected;
          const wrong = isSelected && isCorrect === false;

          return (
            <motion.button
              key={letter}
              onClick={() => handleSelect(letter)}
              disabled={isCorrect !== null}
              className={`
                h-24 rounded-2xl text-4xl font-bold
                flex items-center justify-center
                border-b-4 shadow-lg
                transition-all active:scale-95 active:border-b-0
                ${vowel 
                  ? 'bg-vowel border-vowel-border text-vowel-text' 
                  : 'bg-consonant border-consonant-border text-consonant-text'
                }
                ${correct ? 'bg-primary border-primary text-primary-foreground ring-4 ring-accent' : ''}
                ${wrong ? 'animate-shake' : ''}
                ${showHint && letter === currentChallenge.correctAnswer ? 'ring-2 ring-accent animate-pulse' : ''}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {letter.toUpperCase()}
            </motion.button>
          );
        })}
      </div>

      {/* Whisper Hint Button */}
      <WhisperHintButton
        hintsUsed={hintsUsed}
        onRequestHint={handleHint}
      />
    </div>
  );
};
