import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Volume2, RefreshCw, Sparkles, ArrowLeft, HelpCircle } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { CURRICULUM, isVowel, getTileStyle } from '@/lib/curriculum';
import { Whisper } from './Whisper';

interface WordBuilderGameProps {
  wilsonStep: number;
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

interface LetterTile {
  id: string;
  char: string;
  type: 'c' | 'v';
}

export const WordBuilderGame: React.FC<WordBuilderGameProps> = ({
  wilsonStep = 1,
  questionsCount = 5,
  onComplete,
  onBack,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [built, setBuilt] = useState<LetterTile[]>([]);
  const [pool, setPool] = useState<LetterTile[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'tryAgain' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [whisperMessage, setWhisperMessage] = useState('');
  
  const { speak, speakPhoneme, playEffect } = useLexiaAudio();

  // Get words from curriculum
  const words = useMemo(() => {
    const step = CURRICULUM["1"];
    const allWords: string[] = [];
    Object.values(step.substeps).forEach(sub => {
      allWords.push(...sub.words);
    });
    // Shuffle and pick
    return allWords.sort(() => Math.random() - 0.5).slice(0, questionsCount);
  }, [questionsCount, wilsonStep]);

  const currentWord = words[questionIndex] || '';

  // Generate letter pool
  useEffect(() => {
    if (!currentWord) return;

    // Create tiles from word
    const wordTiles: LetterTile[] = currentWord.split('').map((char, i) => ({
      id: `word-${i}`,
      char,
      type: isVowel(char) ? 'v' : 'c',
    }));

    // Add 2-3 distractors
    const distractors = ['s', 't', 'n', 'r', 'p', 'm'].filter(
      c => !currentWord.includes(c)
    ).slice(0, 3);

    const distractorTiles: LetterTile[] = distractors.map((char, i) => ({
      id: `dist-${i}`,
      char,
      type: isVowel(char) ? 'v' : 'c',
    }));

    // Shuffle all tiles
    const allTiles = [...wordTiles, ...distractorTiles].sort(() => Math.random() - 0.5);
    setPool(allTiles);
    setBuilt([]);
    setFeedback(null);
    setAttempts(0);
    setShowHint(false);

    // Announce word
    setTimeout(() => {
      speak(`Build the word: ${currentWord}`);
    }, 300);
  }, [currentWord]);

  const handleTileTap = (tile: LetterTile) => {
    if (feedback === 'correct') return;
    
    playEffect('tap');
    speakPhoneme(tile.char);

    // Move from pool to built
    setPool(prev => prev.filter(t => t.id !== tile.id));
    setBuilt(prev => [...prev, tile]);
  };

  const handleBuiltTileTap = (tile: LetterTile) => {
    if (feedback === 'correct') return;

    playEffect('tap');

    // Move back to pool
    setBuilt(prev => prev.filter(t => t.id !== tile.id));
    setPool(prev => [...prev, tile]);
  };

  const handleCheck = () => {
    const builtWord = built.map(t => t.char).join('');

    if (builtWord === currentWord) {
      // Correct!
      setFeedback('correct');
      playEffect('correct');
      setCorrectCount(prev => prev + 1);
      speak(`Great job! ${currentWord}!`);

      setTimeout(() => {
        if (questionIndex < words.length - 1) {
          setQuestionIndex(prev => prev + 1);
        } else {
          onComplete({
            correct: correctCount + 1,
            total: words.length,
            hintsUsed,
          });
        }
      }, 1500);
    } else {
      // Try again
      setFeedback('tryAgain');
      playEffect('tryAgain');
      setAttempts(prev => prev + 1);

      // Progressive hints
      if (attempts >= 1) {
        setShowHint(true);
        if (attempts === 1) {
          setWhisperMessage(`Listen carefully... the word starts with "${currentWord[0]}"`);
        } else if (attempts >= 2) {
          setWhisperMessage(`The word is "${currentWord}". Let me help you!`);
          setHintsUsed(prev => prev + 1);
        }
      }

      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const handleReset = () => {
    // Move all built tiles back to pool
    setPool(prev => [...prev, ...built].sort(() => Math.random() - 0.5));
    setBuilt([]);
    setFeedback(null);
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    setWhisperMessage(`The word is "${currentWord}". It has ${currentWord.length} letters!`);
    speak(currentWord);
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="h-12 w-12 min-h-[44px] min-w-[44px] bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
          role="button"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Word Builder</h1>
          <p className="text-xs text-muted-foreground">
            {questionIndex + 1} of {words.length}
          </p>
        </div>

        <button
          onClick={handleHint}
          className="h-12 w-12 min-h-[44px] min-w-[44px] bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Get hint"
          role="button"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((questionIndex) / words.length) * 100}%` }}
        />
      </div>

      {/* Sound Play Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          onClick={() => speak(currentWord)}
          className="h-24 w-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.9 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Volume2 size={40} />
        </motion.button>
      </div>

      <p className="text-center text-muted-foreground mb-4 font-medium">
        Tap to hear the word, then build it!
      </p>

      {/* Build Zone */}
      <div
        className={`min-h-24 rounded-3xl border-4 mb-6 flex items-center justify-center gap-2 p-4 transition-all ${
          feedback === 'correct'
            ? 'bg-welded/30 border-welded-border'
            : feedback === 'tryAgain'
            ? 'bg-accent/20 border-accent animate-shake'
            : 'bg-card border-border border-dashed'
        }`}
      >
        {built.length > 0 ? (
          <div className="flex gap-2 flex-wrap justify-center">
            {built.map((tile) => (
              <motion.button
                key={tile.id}
                onClick={() => handleBuiltTileTap(tile)}
                className={`w-16 h-20 letter-tile ${getTileStyle(tile.type)} ${
                  feedback === 'correct' ? 'cursor-default' : ''
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={feedback !== 'correct' ? { scale: 0.9 } : undefined}
              >
                {tile.char}
              </motion.button>
            ))}
            {feedback === 'correct' && (
              <div className="flex items-center ml-2">
                <Sparkles className="text-accent animate-spin-slow" size={32} />
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground font-bold text-lg opacity-50">
            Tap letters to build the word
          </span>
        )}
      </div>

      {/* Letter Pool */}
      <div className="flex justify-center gap-3 flex-wrap mb-8">
        <AnimatePresence>
          {pool.map((tile) => (
            <motion.button
              key={tile.id}
              onClick={() => handleTileTap(tile)}
              className={`w-16 h-20 letter-tile ${getTileStyle(tile.type)}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
            >
              {tile.char}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => speak(currentWord)}
          className="h-14 w-14 min-h-[44px] min-w-[44px] bg-consonant text-consonant-text rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Hear word"
          role="button"
        >
          <Volume2 size={24} />
        </button>
        <button
          onClick={handleReset}
          className="h-14 w-14 min-h-[44px] min-w-[44px] bg-muted text-muted-foreground rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Reset letters"
          role="button"
        >
          <RefreshCw size={24} />
        </button>
        <button
          onClick={handleCheck}
          disabled={built.length === 0 || feedback === 'correct'}
          className={`h-14 px-8 min-h-[44px] rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
            built.length > 0 && feedback !== 'correct'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          }`}
          aria-label="Check your answer"
          role="button"
        >
          Check!
        </button>
      </div>

      {/* Whisper Hint */}
      {showHint && whisperMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Whisper message={whisperMessage} variant="hint" />
        </motion.div>
      )}
    </div>
  );
};
