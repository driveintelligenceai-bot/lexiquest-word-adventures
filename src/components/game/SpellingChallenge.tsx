import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft, HelpCircle, Delete } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';

interface SpellingChallengeProps {
  questionsCount?: number;
  wilsonStep?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

// Spelling words with picture hints and audio
// Wilson 1.1 ONLY - CVC words with short 'a' and consonants f, l, m, n, r, s (+ t, p for endings)
// Avoiding welded sounds like "am" which belong to Wilson 1.5
const SPELLING_WORDS = {
  easy: [
    { word: 'sat', hint: '🪑 Past tense of sit', letters: ['s', 'a', 't', 'r', 'l'] },
    { word: 'mat', hint: '🧹 You wipe your feet on it', letters: ['m', 'a', 't', 'f', 'n'] },
    { word: 'rat', hint: '🐀 A small animal with a long tail', letters: ['r', 'a', 't', 's', 'l'] },
    { word: 'fat', hint: '🍔 The opposite of thin', letters: ['f', 'a', 't', 'm', 'n'] },
    { word: 'fan', hint: '💨 Keeps you cool', letters: ['f', 'a', 'n', 't', 's'] },
    { word: 'ran', hint: '🏃 Past tense of run', letters: ['r', 'a', 'n', 't', 'l'] },
    { word: 'tan', hint: '🌞 A brown color from the sun', letters: ['t', 'a', 'n', 's', 'f'] },
    { word: 'lap', hint: '🏃 A trip around a track', letters: ['l', 'a', 'p', 't', 's'] },
    { word: 'nap', hint: '😴 A short sleep', letters: ['n', 'a', 'p', 't', 'r'] },
    { word: 'sap', hint: '🌲 Sticky stuff from trees', letters: ['s', 'a', 'p', 'l', 'n'] },
  ],
  medium: [
    { word: 'raft', hint: '🚣 Floats on water', letters: ['r', 'a', 'f', 't', 's', 'l'] },
    { word: 'fast', hint: '🏎️ The opposite of slow', letters: ['f', 'a', 's', 't', 'r', 'n'] },
    { word: 'last', hint: '🏁 At the end', letters: ['l', 'a', 's', 't', 'f', 'm'] },
    { word: 'mast', hint: '⛵ Tall pole on a boat', letters: ['m', 'a', 's', 't', 'r', 'l'] },
    { word: 'past', hint: '⏰ Already happened', letters: ['p', 'a', 's', 't', 'f', 'n'] },
    { word: 'lass', hint: '👧 A young girl', letters: ['l', 'a', 's', 's', 't', 'r'] },
    { word: 'mass', hint: '⛪ A church service', letters: ['m', 'a', 's', 's', 'l', 't'] },
    { word: 'pass', hint: '🎫 A ticket to get in', letters: ['p', 'a', 's', 's', 'f', 'l'] },
  ],
  hard: [
    { word: 'staff', hint: '👥 Workers at a place', letters: ['s', 't', 'a', 'f', 'f', 'r', 'l'] },
    { word: 'raft', hint: '🚣 Float on the water', letters: ['r', 'a', 'f', 't', 's', 'l', 'n'] },
    { word: 'raft', hint: '🚣 A flat boat', letters: ['r', 'a', 'f', 't', 'm', 's', 'l'] },
    { word: 'last', hint: '🔚 Final one', letters: ['l', 'a', 's', 't', 'f', 'm', 'n'] },
    { word: 'fast', hint: '⚡ Very quick', letters: ['f', 'a', 's', 't', 'r', 'l', 'n'] },
  ],
};

export const SpellingChallenge: React.FC<SpellingChallengeProps> = ({
  questionsCount = 5,
  wilsonStep = 1,
  onComplete,
  onBack,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userSpelling, setUserSpelling] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'tryAgain' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  
  const { speak, playEffect } = useLexiaAudio();

  // Select words based on difficulty
  const questions = useMemo(() => {
    const difficulty = wilsonStep <= 1 ? 'easy' : wilsonStep <= 2 ? 'medium' : 'hard';
    const wordPool = SPELLING_WORDS[difficulty];
    return [...wordPool].sort(() => Math.random() - 0.5).slice(0, questionsCount);
  }, [questionsCount, wilsonStep]);

  const currentQuestion = questions[questionIndex];

  // Initialize available letters for current question
  useEffect(() => {
    if (currentQuestion) {
      setUserSpelling([]);
      setFeedback(null);
      setShowHint(false);
      setAvailableLetters([...currentQuestion.letters].sort(() => Math.random() - 0.5));
      setTimeout(() => {
        speak(`Spell the word: ${currentQuestion.word}. ${currentQuestion.hint}`);
      }, 300);
    }
  }, [questionIndex, currentQuestion]);

  const handleLetterTap = (letter: string, index: number) => {
    if (feedback === 'correct') return;
    
    playEffect('tap');
    speak(letter);
    
    // Add letter to spelling
    setUserSpelling([...userSpelling, letter]);
    
    // Remove from available (by index to handle duplicates)
    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);
  };

  const handleRemoveLetter = () => {
    if (userSpelling.length === 0 || feedback === 'correct') return;
    
    playEffect('tap');
    const removed = userSpelling[userSpelling.length - 1];
    setUserSpelling(userSpelling.slice(0, -1));
    setAvailableLetters([...availableLetters, removed]);
  };

  const handleCheck = () => {
    const spelled = userSpelling.join('').toLowerCase();
    const isCorrect = spelled === currentQuestion.word;

    if (isCorrect) {
      setFeedback('correct');
      playEffect('correct');
      setCorrectCount(prev => prev + 1);
      speak(`Amazing! You spelled ${currentQuestion.word} correctly!`);

      setTimeout(() => {
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(prev => prev + 1);
        } else {
          onComplete({
            correct: correctCount + 1,
            total: questions.length,
            hintsUsed,
          });
        }
      }, 1500);
    } else {
      setFeedback('tryAgain');
      playEffect('tryAgain');
      setShowHint(true);
      
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    
    // Give progressive hints
    const nextLetter = currentQuestion.word[userSpelling.length];
    speak(`The next letter is ${nextLetter}. ${currentQuestion.word} starts with ${currentQuestion.word[0]}`);
  };

  const handleSpeakWord = () => {
    speak(currentQuestion.word);
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="h-12 w-12 min-h-[44px] min-w-[44px] bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Spelling Challenge</h1>
          <p className="text-xs text-muted-foreground">
            {questionIndex + 1} of {questions.length}
          </p>
        </div>

        <button
          onClick={handleHint}
          className="h-12 w-12 min-h-[44px] min-w-[44px] bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Get a hint"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(questionIndex / questions.length) * 100}%` }}
        />
      </div>

      {/* Listen to word */}
      <div className="text-center mb-6">
        <p className="text-muted-foreground mb-3">Listen and spell:</p>
        <motion.button
          onClick={handleSpeakWord}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-lg"
          whileTap={{ scale: 0.95 }}
          aria-label={`Listen to the word ${currentQuestion.word}`}
        >
          <Volume2 size={28} />
          <span className="text-xl font-bold">🔊 Hear Word</span>
        </motion.button>
      </div>

      {/* Hint with emoji */}
      <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-center">
        <p className="text-lg text-foreground">{currentQuestion.hint}</p>
      </div>

      {/* User's spelling */}
      <div className="bg-card border-4 border-border rounded-2xl p-4 mb-6 min-h-[80px] flex items-center justify-center gap-2 flex-wrap">
        <AnimatePresence mode="popLayout">
          {userSpelling.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`text-4xl font-black px-4 py-2 rounded-xl ${
                feedback === 'correct' 
                  ? 'bg-welded text-welded-text' 
                  : 'bg-vowel text-vowel-text'
              }`}
            >
              {letter}
            </motion.span>
          ))}
        </AnimatePresence>
        {userSpelling.length === 0 && (
          <span className="text-muted-foreground text-lg">Tap letters below</span>
        )}
      </div>

      {/* Delete button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRemoveLetter}
          disabled={userSpelling.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-muted-foreground active:scale-95 transition-transform disabled:opacity-50"
          aria-label="Delete last letter"
        >
          <Delete size={20} />
          <span className="font-bold">Delete</span>
        </button>
      </div>

      {/* Available letters */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {availableLetters.map((letter, i) => (
          <motion.button
            key={`${letter}-${i}`}
            onClick={() => handleLetterTap(letter, i)}
            className="h-16 rounded-2xl text-2xl font-bold bg-card border-4 border-border text-foreground active:scale-95 transition-transform hover:border-primary"
            whileTap={{ scale: 0.9 }}
            disabled={feedback === 'correct'}
            aria-label={`Letter ${letter}`}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {/* Check Button */}
      <button
        onClick={handleCheck}
        disabled={userSpelling.length === 0 || feedback === 'correct'}
        className={`w-full h-16 rounded-2xl font-bold text-lg transition-all active:scale-95 min-h-[44px] ${
          userSpelling.length > 0 && feedback !== 'correct'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        Check My Spelling!
      </button>

      {/* Whisper Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Whisper 
            message={`Sound it out! ${currentQuestion.word} has ${currentQuestion.word.length} letters.`}
            variant="hint" 
          />
        </motion.div>
      )}
    </div>
  );
};
