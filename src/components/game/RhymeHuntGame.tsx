import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft, HelpCircle } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';

interface RhymeHuntGameProps {
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

// Wilson 1.1 Rhyme pairs ONLY - short 'a' with f, l, m, n, r, s consonants
// Avoiding welded sounds like "am", "an" patterns that belong to 1.5
const RHYME_SETS = [
  { target: 'sat', rhymes: ['mat', 'rat', 'fat', 'lat'], nonRhymes: ['lap', 'sap', 'fan', 'ran'] },
  { target: 'rat', rhymes: ['sat', 'mat', 'fat', 'lat'], nonRhymes: ['tap', 'nap', 'tan', 'ran'] },
  { target: 'lap', rhymes: ['nap', 'sap', 'tap', 'rap'], nonRhymes: ['sat', 'mat', 'fat', 'tan'] },
  { target: 'nap', rhymes: ['lap', 'sap', 'tap', 'rap'], nonRhymes: ['rat', 'sat', 'fan', 'ran'] },
  { target: 'tan', rhymes: ['fan', 'ran', 'lan', 'nan'], nonRhymes: ['sat', 'mat', 'lap', 'tap'] },
  { target: 'fan', rhymes: ['tan', 'ran', 'lan', 'nan'], nonRhymes: ['rat', 'fat', 'nap', 'sap'] },
  { target: 'fast', rhymes: ['last', 'mast', 'past', 'rast'], nonRhymes: ['sat', 'lap', 'fan', 'tap'] },
  { target: 'raft', rhymes: ['raft', 'aft', 'daft', 'laft'], nonRhymes: ['mat', 'nap', 'tan', 'sap'] },
];

export const RhymeHuntGame: React.FC<RhymeHuntGameProps> = ({
  questionsCount = 5,
  onComplete,
  onBack,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'tryAgain' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const { speak, playEffect } = useLexiaAudio();

  // Select random rhyme sets
  const questions = useMemo(() => {
    return [...RHYME_SETS].sort(() => Math.random() - 0.5).slice(0, questionsCount);
  }, [questionsCount]);

  const currentQuestion = questions[questionIndex];

  // Build options: 2 rhymes + 2 non-rhymes
  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const rhymes = currentQuestion.rhymes.slice(0, 2);
    const nonRhymes = currentQuestion.nonRhymes.slice(0, 2);
    return [...rhymes, ...nonRhymes].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const correctAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    return currentQuestion.rhymes.slice(0, 2);
  }, [currentQuestion]);

  useEffect(() => {
    if (currentQuestion) {
      setSelected([]);
      setFeedback(null);
      setShowHint(false);
      setTimeout(() => {
        speak(`Find the words that rhyme with ${currentQuestion.target}`);
      }, 300);
    }
  }, [questionIndex, currentQuestion]);

  const handleSelect = (word: string) => {
    if (feedback === 'correct') return;
    
    playEffect('tap');
    speak(word);

    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else if (selected.length < 2) {
      setSelected([...selected, word]);
    }
  };

  const handleCheck = () => {
    const isCorrect = selected.length === 2 && 
      selected.every(s => correctAnswers.includes(s));

    if (isCorrect) {
      setFeedback('correct');
      playEffect('correct');
      setCorrectCount(prev => prev + 1);
      speak('Perfect! Those words rhyme!');

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
        setSelected([]);
      }, 1000);
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    speak(`Words that rhyme sound the same at the end. ${currentQuestion.target} rhymes with ${correctAnswers[0]}`);
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Rhyme Hunt</h1>
          <p className="text-xs text-muted-foreground">
            {questionIndex + 1} of {questions.length}
          </p>
        </div>

        <button
          onClick={handleHint}
          className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95"
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

      {/* Target Word */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground mb-2">Find words that rhyme with:</p>
        <motion.button
          onClick={() => speak(currentQuestion.target)}
          className="inline-flex items-center gap-3 bg-vowel border-4 border-vowel-border text-vowel-text px-8 py-4 rounded-2xl"
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-4xl font-black">{currentQuestion.target}</span>
          <Volume2 size={24} />
        </motion.button>
      </div>

      <p className="text-center text-muted-foreground mb-6">
        Tap 2 words that rhyme with "{currentQuestion.target}"
      </p>

      {/* Word Options */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {options.map((word) => {
          const isSelected = selected.includes(word);
          const isCorrectAnswer = correctAnswers.includes(word);
          const showAsCorrect = feedback === 'correct' && isCorrectAnswer;

          return (
            <motion.button
              key={word}
              onClick={() => handleSelect(word)}
              className={`h-20 rounded-2xl text-2xl font-bold border-4 transition-all ${
                showAsCorrect
                  ? 'bg-welded border-welded-border text-welded-text'
                  : isSelected
                  ? 'bg-primary/20 border-primary text-foreground scale-105'
                  : 'bg-card border-border text-foreground hover:border-primary/50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      {/* Check Button */}
      <button
        onClick={handleCheck}
        disabled={selected.length !== 2 || feedback === 'correct'}
        className={`w-full h-16 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
          selected.length === 2 && feedback !== 'correct'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        Check My Answer!
      </button>

      {/* Whisper Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Whisper 
            message="Rhyming words sound the same at the end!" 
            variant="hint" 
          />
        </motion.div>
      )}
    </div>
  );
};
