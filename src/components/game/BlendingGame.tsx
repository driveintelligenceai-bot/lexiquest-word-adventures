import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Sparkles, RotateCcw } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';
import { FingerTapping } from './FingerTapping';
import { motion, AnimatePresence } from 'framer-motion';

interface BlendingGameProps {
  wilsonStep?: number;
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

// Wilson 1.1 CVC words - short 'a' with consonants f, l, m, n, r, s, t, p
const BLENDING_WORDS = [
  'mat', 'sat', 'rat', 'fat', 'pat',
  'map', 'sap', 'rap', 'tap', 'nap', 'lap',
  'raft', 'last', 'fast', 'past', 'mast'
];

const isVowel = (char: string) => ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());

export const BlendingGame: React.FC<BlendingGameProps> = ({
  questionsCount = 5,
  onComplete,
  onBack
}) => {
  const { speak, speakPhoneme, playEffect } = useLexiaAudio();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'tap' | 'blend' | 'check'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [whisperMessage, setWhisperMessage] = useState('');
  const [sweepIndex, setSweepIndex] = useState(-1);
  const [isBlending, setIsBlending] = useState(false);

  const words = useMemo(() => {
    const shuffled = [...BLENDING_WORDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(questionsCount, shuffled.length));
  }, [questionsCount]);

  const currentWord = words[questionIndex] || 'mat';
  const letters = currentWord.split('');

  const options = useMemo(() => {
    const otherWords = BLENDING_WORDS.filter(w => w !== currentWord);
    const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 2);
    return [currentWord, ...shuffled].sort(() => Math.random() - 0.5);
  }, [currentWord]);

  useEffect(() => {
    if (phase === 'intro') {
      speak("Let's blend sounds! First, tap each sound with your fingers.");
    }
  }, [phase]);

  // Visual sweep animation during blending
  const handleBlendWithSweep = async () => {
    setIsBlending(true);
    playEffect('correct');
    
    // Sweep through each letter with visual indicator
    for (let i = 0; i < letters.length; i++) {
      setSweepIndex(i);
      await new Promise(resolve => setTimeout(resolve, 500));
      speakPhoneme(letters[i]);
    }
    
    // Final blend
    setSweepIndex(-1);
    await new Promise(resolve => setTimeout(resolve, 400));
    speak(currentWord);
    
    setIsBlending(false);
    setPhase('check');
  };

  const handleTapComplete = () => {
    setPhase('blend');
  };

  const handleSelectAnswer = (word: string) => {
    if (feedback) return;
    
    setSelectedAnswer(word);
    
    if (word === currentWord) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      playEffect('correct');
      speak(`Yes! The word is ${currentWord}!`);
      
      setTimeout(() => {
        if (questionIndex < words.length - 1) {
          setQuestionIndex(prev => prev + 1);
          resetRound();
        } else {
          onComplete({ correct: correctCount + 1, total: words.length, hintsUsed });
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      playEffect('tryAgain');
      setHintsUsed(prev => prev + 1);
      setWhisperMessage(`Listen again! Blend the sounds: ${letters.join(' - ')}`);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        setPhase('blend');
      }, 1500);
    }
  };

  const resetRound = () => {
    setPhase('tap');
    setSelectedAnswer(null);
    setFeedback(null);
    setWhisperMessage('');
    setSweepIndex(-1);
  };

  const handleStart = () => {
    playEffect('tap');
    setPhase('tap');
  };

  const progress = (questionIndex / words.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Minimal Header - Focus Mode */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {questionIndex + 1}/{words.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content - One focus per screen */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-4">✋</div>
              <h2 className="text-2xl font-bold text-foreground">Finger Tapping</h2>
              <p className="text-lg text-muted-foreground max-w-xs mx-auto">
                Tap each finger to sound out the word!
              </p>
              <Button size="lg" onClick={handleStart} className="text-xl px-8 py-6">
                Let's Go! 🎵
              </Button>
            </motion.div>
          )}

          {phase === 'tap' && (
            <motion.div
              key="tap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <FingerTapping
                word={currentWord}
                phonemes={letters}
                onComplete={handleTapComplete}
                showWord={true}
              />
            </motion.div>
          )}

          {phase === 'blend' && (
            <motion.div
              key="blend"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-8 w-full max-w-md"
            >
              <p className="text-lg text-muted-foreground">
                Now blend the sounds together!
              </p>

              {/* Letter tiles with sweep indicator */}
              <div className="relative flex justify-center gap-4">
                {letters.map((letter, idx) => (
                  <motion.div
                    key={idx}
                    className={`
                      w-20 h-24 rounded-2xl text-4xl font-bold
                      flex items-center justify-center border-4 shadow-lg
                      ${isVowel(letter) 
                        ? 'bg-vowel border-vowel-border text-vowel-text' 
                        : 'bg-consonant border-consonant-border text-consonant-text'
                      }
                      ${sweepIndex === idx ? 'ring-4 ring-accent scale-110' : ''}
                    `}
                    animate={sweepIndex === idx ? { y: -10 } : { y: 0 }}
                  >
                    {letter}
                  </motion.div>
                ))}
                
                {/* Sweep arrow indicator */}
                {isBlending && sweepIndex >= 0 && (
                  <motion.div
                    className="absolute -bottom-8 text-2xl text-accent"
                    initial={{ x: 0 }}
                    animate={{ x: sweepIndex * 96 }}
                    transition={{ duration: 0.3 }}
                  >
                    👆
                  </motion.div>
                )}
              </div>

              <Button
                size="lg"
                onClick={handleBlendWithSweep}
                disabled={isBlending}
                className="text-xl px-8 py-6 bg-gradient-to-r from-primary to-accent"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                {isBlending ? 'Blending...' : 'Blend Together!'}
              </Button>
            </motion.div>
          )}

          {phase === 'check' && (
            <motion.div
              key="check"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6 w-full max-w-md"
            >
              <p className="text-xl text-foreground font-medium">
                What word did you hear?
              </p>

              <div className="grid gap-3">
                {options.map((word) => (
                  <motion.button
                    key={word}
                    onClick={() => handleSelectAnswer(word)}
                    disabled={feedback !== null}
                    className={`
                      p-5 rounded-2xl text-2xl font-bold border-3 transition-all
                      ${selectedAnswer === word
                        ? feedback === 'correct'
                          ? 'bg-welded/30 border-welded-border text-welded-text'
                          : feedback === 'incorrect'
                            ? 'bg-destructive/20 border-destructive'
                            : 'bg-primary/20 border-primary'
                        : 'bg-card border-border hover:border-primary'
                      }
                    `}
                  >
                    {word}
                    {selectedAnswer === word && feedback === 'correct' && ' ✓'}
                  </motion.button>
                ))}
              </div>

              <Button variant="outline" onClick={handleBlendWithSweep} disabled={isBlending}>
                <Volume2 className="w-5 h-5 mr-2" /> Hear Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {whisperMessage && <Whisper message={whisperMessage} />}
    </div>
  );
};
