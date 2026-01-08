import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Sparkles, RotateCcw } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';
import { motion, AnimatePresence } from 'framer-motion';

interface BlendingGameProps {
  wilsonStep?: number;
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

// Wilson 1.1 CVC words - short 'a' with consonants f, l, m, n, r, s, t, p
// Avoiding welded sounds like 'am', 'an' at the end
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
  const [phase, setPhase] = useState<'intro' | 'listen' | 'blend' | 'check'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [whisperMessage, setWhisperMessage] = useState('');
  const [playedSounds, setPlayedSounds] = useState<number[]>([]);
  const [isBlending, setIsBlending] = useState(false);

  // Shuffle and select words for this session
  const words = useMemo(() => {
    const shuffled = [...BLENDING_WORDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(questionsCount, shuffled.length));
  }, [questionsCount]);

  const currentWord = words[questionIndex] || 'mat';
  const letters = currentWord.split('');

  // Generate wrong options (other 3-letter words)
  const options = useMemo(() => {
    const otherWords = BLENDING_WORDS.filter(w => w !== currentWord);
    const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 2);
    const allOptions = [currentWord, ...shuffled].sort(() => Math.random() - 0.5);
    return allOptions;
  }, [currentWord]);

  useEffect(() => {
    if (phase === 'intro') {
      speak("Let's blend sounds together! Tap each letter to hear its sound, then blend them to make a word.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleTapLetter = (letter: string, index: number) => {
    // Speak the phoneme sound
    speakPhoneme(letter);
    playEffect('tap');
    
    // Track which sounds have been played
    if (!playedSounds.includes(index)) {
      setPlayedSounds(prev => [...prev, index]);
    }
  };

  const handleBlendAll = async () => {
    setIsBlending(true);
    playEffect('correct');
    
    // Slow blend: speak each sound with pause, then the word
    for (let i = 0; i < letters.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      speakPhoneme(letters[i]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    speak(currentWord);
    
    setIsBlending(false);
    setPhase('check');
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
          onComplete({
            correct: correctCount + 1,
            total: words.length,
            hintsUsed
          });
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
        setPhase('listen');
      }, 1500);
    }
  };

  const resetRound = () => {
    setPhase('listen');
    setSelectedAnswer(null);
    setFeedback(null);
    setPlayedSounds([]);
    setWhisperMessage('');
  };

  const handleStart = () => {
    playEffect('tap');
    setPhase('listen');
  };

  const progress = ((questionIndex) / words.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Sound Blending</h1>
        <span className="text-sm font-medium text-muted-foreground">
          {questionIndex + 1}/{words.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content */}
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
              <div className="text-6xl mb-4">🔤</div>
              <h2 className="text-2xl font-bold text-foreground">Sound Blending</h2>
              <p className="text-lg text-muted-foreground max-w-xs mx-auto">
                Tap each letter to hear its sound, then blend them together!
              </p>
              <Button 
                size="lg" 
                onClick={handleStart}
                className="text-xl px-8 py-6"
              >
                Let's Blend! 🎵
              </Button>
            </motion.div>
          )}

          {(phase === 'listen' || phase === 'blend') && (
            <motion.div
              key="listen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-8 w-full max-w-md"
            >
              <p className="text-lg text-muted-foreground">
                Tap each letter to hear its sound
              </p>

              {/* Letter tiles */}
              <div className="flex justify-center gap-4">
                {letters.map((letter, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleTapLetter(letter, idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isBlending ? {
                      scale: [1, 1.2, 1],
                      transition: { delay: idx * 0.4, duration: 0.3 }
                    } : {}}
                    className={`
                      w-20 h-24 rounded-2xl text-4xl font-bold
                      flex items-center justify-center relative
                      border-4 shadow-lg transition-all
                      ${isVowel(letter) 
                        ? 'bg-vowel border-vowel-border text-vowel-text' 
                        : 'bg-consonant border-consonant-border text-consonant-text'
                      }
                      ${playedSounds.includes(idx) ? 'ring-4 ring-primary/50' : ''}
                    `}
                  >
                    {letter}
                    <Volume2 className="w-3 h-3 absolute bottom-1 opacity-50" />
                  </motion.button>
                ))}
              </div>

              {/* Blend button */}
              <div className="space-y-4">
                {playedSounds.length >= letters.length && !isBlending && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      size="lg"
                      onClick={handleBlendAll}
                      className="text-xl px-8 py-6 bg-gradient-to-r from-primary to-accent"
                    >
                      <Sparkles className="w-6 h-6 mr-2" />
                      Blend Together!
                    </Button>
                  </motion.div>
                )}

                {isBlending && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-bold text-primary"
                  >
                    Blending... 🎶
                  </motion.p>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPlayedSounds([])}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
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

              {/* Answer options */}
              <div className="grid gap-3">
                {options.map((word) => (
                  <motion.button
                    key={word}
                    onClick={() => handleSelectAnswer(word)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={feedback !== null}
                    className={`
                      p-5 rounded-2xl text-2xl font-bold
                      border-3 transition-all
                      ${selectedAnswer === word
                        ? feedback === 'correct'
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : feedback === 'incorrect'
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-primary/20 border-primary'
                        : 'bg-card border-border hover:border-primary'
                      }
                    `}
                  >
                    {word}
                    {selectedAnswer === word && feedback === 'correct' && ' ✓'}
                    {selectedAnswer === word && feedback === 'incorrect' && ' ✗'}
                  </motion.button>
                ))}
              </div>

              {/* Hear again button */}
              <Button
                variant="outline"
                onClick={handleBlendAll}
                disabled={isBlending}
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Hear Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Whisper hint */}
      <Whisper message={whisperMessage} />
    </div>
  );
};
