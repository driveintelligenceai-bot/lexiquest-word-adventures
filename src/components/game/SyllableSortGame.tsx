import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft, HelpCircle } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';

interface SyllableSortGameProps {
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

// Words sorted by syllable count
const SYLLABLE_WORDS = {
  1: ['cat', 'dog', 'sun', 'hat', 'map', 'bed', 'cup', 'pig', 'run', 'hop'],
  2: ['happy', 'kitten', 'rabbit', 'basket', 'butter', 'penny', 'ladder', 'mitten', 'puppet', 'button'],
  3: ['elephant', 'banana', 'butterfly', 'dinosaur', 'umbrella', 'tomato', 'potato', 'hamburger', 'animal', 'bicycle'],
};

export const SyllableSortGame: React.FC<SyllableSortGameProps> = ({
  questionsCount = 6,
  onComplete,
  onBack,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedBucket, setSelectedBucket] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'tryAgain' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [clapCount, setClapCount] = useState(0);
  
  const { speak, playEffect } = useLexiaAudio();

  // Generate questions
  const questions = useMemo(() => {
    const result: { word: string; syllables: number }[] = [];
    
    Object.entries(SYLLABLE_WORDS).forEach(([count, words]) => {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      shuffled.slice(0, 2).forEach(word => {
        result.push({ word, syllables: parseInt(count) });
      });
    });

    return result.sort(() => Math.random() - 0.5).slice(0, questionsCount);
  }, [questionsCount]);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    if (currentQuestion) {
      setSelectedBucket(null);
      setFeedback(null);
      setShowHint(false);
      setClapCount(0);
      setTimeout(() => {
        speak(`How many syllables in ${currentQuestion.word}? Clap it out!`);
      }, 300);
    }
  }, [questionIndex, currentQuestion]);

  const handleClap = () => {
    playEffect('tap');
    setClapCount(prev => Math.min(prev + 1, 3));
  };

  const handleBucketSelect = (syllables: number) => {
    if (feedback === 'correct') return;
    
    playEffect('tap');
    setSelectedBucket(syllables);
  };

  const handleCheck = () => {
    if (selectedBucket === null) return;

    if (selectedBucket === currentQuestion.syllables) {
      setFeedback('correct');
      playEffect('correct');
      setCorrectCount(prev => prev + 1);
      speak(`Yes! ${currentQuestion.word} has ${currentQuestion.syllables} syllable${currentQuestion.syllables > 1 ? 's' : ''}!`);

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
        setSelectedBucket(null);
        setClapCount(0);
      }, 1000);
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    
    // Speak the word broken into syllables
    const word = currentQuestion.word;
    speak(`Clap along: ${word}. It has ${currentQuestion.syllables} part${currentQuestion.syllables > 1 ? 's' : ''}.`);
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
          <h1 className="text-xl font-bold text-foreground">Syllable Sort</h1>
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
          animate={{ width: `${(questionIndex / questions.length) * 100}%` }}
        />
      </div>

      {/* Word to Sort */}
      <div className="text-center mb-6">
        <p className="text-muted-foreground mb-2">How many syllables?</p>
        <motion.button
          onClick={() => speak(currentQuestion.word)}
          className="inline-flex items-center gap-3 bg-digraph border-4 border-digraph-border text-digraph-text px-8 py-4 rounded-2xl"
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-4xl font-black">{currentQuestion.word}</span>
          <Volume2 size={24} />
        </motion.button>
      </div>

      {/* Clap Counter */}
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground mb-3">Tap to clap it out:</p>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                i <= clapCount ? 'bg-accent text-white' : 'bg-muted'
              }`}
              animate={i <= clapCount ? { scale: [1, 1.2, 1] } : {}}
            >
              👏
            </motion.div>
          ))}
        </div>
        <button
          onClick={handleClap}
          className="px-6 py-3 bg-accent text-white rounded-xl font-bold active:scale-95"
        >
          👏 Clap!
        </button>
      </div>

      {/* Syllable Buckets */}
      <p className="text-center text-muted-foreground mb-4">
        Now pick the right bucket:
      </p>
      <div className="flex gap-3 justify-center mb-8">
        {[1, 2, 3].map((syllables) => {
          const isSelected = selectedBucket === syllables;
          const isCorrect = feedback === 'correct' && syllables === currentQuestion.syllables;

          return (
            <motion.button
              key={syllables}
              onClick={() => handleBucketSelect(syllables)}
              className={`flex-1 max-w-24 aspect-square rounded-2xl font-bold text-lg border-4 transition-all flex flex-col items-center justify-center gap-1 ${
                isCorrect
                  ? 'bg-welded border-welded-border text-welded-text'
                  : isSelected
                  ? 'bg-primary/20 border-primary text-foreground scale-105'
                  : 'bg-card border-border text-foreground hover:border-primary/50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl font-black">{syllables}</span>
              <span className="text-xs">clap{syllables > 1 ? 's' : ''}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Check Button */}
      <button
        onClick={handleCheck}
        disabled={selectedBucket === null || feedback === 'correct'}
        className={`w-full h-16 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
          selectedBucket !== null && feedback !== 'correct'
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
            message="Clap each part of the word as you say it!" 
            variant="hint" 
          />
        </motion.div>
      )}
    </div>
  );
};
