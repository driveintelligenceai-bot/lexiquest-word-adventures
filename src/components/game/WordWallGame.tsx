import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Trophy, RefreshCw, Zap } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { CURRICULUM } from '@/lib/curriculum';
import { PHONEMES, getWilson11Phonemes } from '@/data/phonemes';
import { Whisper } from './Whisper';
import { Button } from '@/components/ui/button';

/**
 * WordWallGame - Wilson Reading System Core Learning Module
 * 
 * This is the PRIMARY educational component of the app. The Word Wall is
 * central to Wilson methodology - it's not just a game, it's the foundation
 * of reading mastery for dyslexic learners.
 * 
 * Educational Features:
 * - Wilson substep locking (only shows words from current curriculum step)
 * - Audio-on-tap for every word (multi-sensory: visual + auditory)
 * - Keyword images with emoji anchors (memory association)
 * - Color-coded phonemes (consonants blue, vowels red - Wilson standard)
 * - "Falling words" that return with progressive hints if missed
 * - 95% mastery tracking before advancing (evidence-based threshold)
 * - Spaced repetition through retry mechanism
 * - Multi-sensory engagement: see → hear → type → verify
 * 
 * Wilson Reading System Integration:
 * - Words are sourced from CURRICULUM data matching Wilson steps
 * - Phoneme breakdown follows Wilson color-coding standards
 * - Mastery requirements align with Wilson progression model
 */

interface WordWallGameProps {
  wilsonStep?: number;
  wilsonSubstep?: string;
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number; masteryPercent: number }) => void;
  onBack: () => void;
}

interface WordCard {
  id: string;
  word: string;
  isRevealed: boolean;
  attempts: number;
  mastered: boolean;
  hintLevel: number; // 0=none, 1=first letter, 2=phonemes, 3=full word shown
}

// Get vowel from word for keyword association
const getVowelKeyword = (word: string) => {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  for (const char of word) {
    if (vowels.includes(char)) {
      const phoneme = PHONEMES[`${char}_short`];
      if (phoneme) {
        return { emoji: phoneme.keywordEmoji, keyword: phoneme.keyword };
      }
    }
  }
  return { emoji: '📖', keyword: 'word' };
};

const isVowel = (char: string) => ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());

export const WordWallGame: React.FC<WordWallGameProps> = ({
  wilsonStep = 1,
  wilsonSubstep = '1.1',
  questionsCount = 8,
  onComplete,
  onBack,
}) => {
  const { speak, speakWord, speakPhoneme, playEffect } = useLexiaAudio();
  
  const [phase, setPhase] = useState<'intro' | 'study' | 'test' | 'results'>('intro');
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [fallingWords, setFallingWords] = useState<string[]>([]);

  // Get words from curriculum based on Wilson substep
  const curriculumWords = useMemo(() => {
    const step = CURRICULUM[String(wilsonStep)];
    if (!step || !step.substeps[wilsonSubstep]) {
      // Fallback to 1.1
      return CURRICULUM["1"].substeps["1.1"]?.words || [];
    }
    return step.substeps[wilsonSubstep].words;
  }, [wilsonStep, wilsonSubstep]);

  // Initialize word cards
  useEffect(() => {
    const shuffled = [...curriculumWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionsCount, shuffled.length));
    
    const cards: WordCard[] = selected.map((word, i) => ({
      id: `word-${i}`,
      word,
      isRevealed: false,
      attempts: 0,
      mastered: false,
      hintLevel: 0,
    }));
    
    setWordCards(cards);
  }, [curriculumWords, questionsCount]);

  // Calculate mastery percentage
  const masteredCount = wordCards.filter(w => w.mastered).length;
  const masteryPercent = wordCards.length > 0 
    ? Math.round((masteredCount / wordCards.length) * 100) 
    : 0;
  
  // Current test word
  const currentTestWord = wordCards[currentTestIndex];

  // Handle word tap during study phase
  const handleWordTap = useCallback((card: WordCard) => {
    playEffect('tap');
    speakWord(card.word);
    
    // Mark as revealed
    setWordCards(prev => prev.map(w => 
      w.id === card.id ? { ...w, isRevealed: true } : w
    ));
  }, [playEffect, speakWord]);

  // Handle phoneme tap (for hints)
  const handlePhonemeTap = useCallback((phoneme: string) => {
    playEffect('tap');
    speakPhoneme(phoneme);
  }, [playEffect, speakPhoneme]);

  // Start study phase
  const handleStartStudy = () => {
    playEffect('tap');
    speak("Tap each word to hear it. Study them well!");
    setPhase('study');
  };

  // Start test phase
  const handleStartTest = () => {
    const revealedCount = wordCards.filter(w => w.isRevealed).length;
    if (revealedCount < wordCards.length) {
      speak("Tap all the words first to study them!");
      return;
    }
    
    playEffect('tap');
    speak("Now let's see how many you remember! Listen and type the word.");
    setPhase('test');
    setCurrentTestIndex(0);
    
    // Play first word after delay
    setTimeout(() => {
      if (wordCards[0]) {
        speakWord(wordCards[0].word);
      }
    }, 1000);
  };

  // Handle test submission
  const handleSubmit = () => {
    if (!currentTestWord || !userInput.trim()) return;
    
    const isCorrect = userInput.toLowerCase().trim() === currentTestWord.word.toLowerCase();
    
    if (isCorrect) {
      setFeedback('correct');
      playEffect('correct');
      speak("Perfect!");
      
      // Mark as mastered
      setWordCards(prev => prev.map(w => 
        w.id === currentTestWord.id ? { ...w, mastered: true } : w
      ));
      
      // Move to next word
      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        setShowHint(false);
        
        if (currentTestIndex < wordCards.length - 1) {
          setCurrentTestIndex(prev => prev + 1);
          setTimeout(() => speakWord(wordCards[currentTestIndex + 1].word), 500);
        } else {
          // Test complete
          setPhase('results');
          playEffect('complete');
        }
      }, 1200);
    } else {
      setFeedback('incorrect');
      playEffect('tryAgain');
      
      // Increment attempts and hint level
      setWordCards(prev => prev.map(w => 
        w.id === currentTestWord.id 
          ? { ...w, attempts: w.attempts + 1, hintLevel: Math.min(w.hintLevel + 1, 3) } 
          : w
      ));
      
      // Add to falling words (visual indicator)
      setFallingWords(prev => [...prev, currentTestWord.word]);
      
      // Show progressive hint
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      
      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        // Replay word
        speakWord(currentTestWord.word);
      }, 1500);
    }
  };

  // Render hint based on level
  const renderHint = () => {
    if (!currentTestWord || !showHint) return null;
    
    const hintLevel = currentTestWord.hintLevel;
    const vowelInfo = getVowelKeyword(currentTestWord.word);
    
    switch (hintLevel) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-2">Starts with:</p>
            <span className="text-4xl font-black text-primary">{currentTestWord.word[0].toUpperCase()}</span>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-2">Sound it out:</p>
            <div className="flex gap-2 justify-center">
              {currentTestWord.word.split('').map((letter, i) => (
                <button
                  key={i}
                  onClick={() => handlePhonemeTap(letter)}
                  className={`w-12 h-14 rounded-xl border-3 text-2xl font-bold flex items-center justify-center ${
                    isVowel(letter) 
                      ? 'bg-vowel border-vowel-border text-vowel-text'
                      : 'bg-consonant border-consonant-border text-consonant-text'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-2">The word is:</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{vowelInfo.emoji}</span>
              <span className="text-3xl font-black text-foreground">{currentTestWord.word}</span>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Handle completion
  const handleFinish = () => {
    onComplete({
      correct: masteredCount,
      total: wordCards.length,
      hintsUsed,
      masteryPercent,
    });
  };

  // Retry failed words
  const handleRetryFailed = () => {
    const failedWords = wordCards.filter(w => !w.mastered);
    if (failedWords.length === 0) return;
    
    // Reset failed words and restart test
    setWordCards(prev => prev.map(w => ({
      ...w,
      hintLevel: 0,
      attempts: 0,
    })));
    setCurrentTestIndex(wordCards.findIndex(w => !w.mastered));
    setPhase('test');
    setShowHint(false);
    setUserInput('');
    setFallingWords([]);
    
    setTimeout(() => {
      const firstFailed = failedWords[0];
      if (firstFailed) speakWord(firstFailed.word);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-area-inset">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Word Wall</h1>
        <div className="flex items-center gap-1">
          <Star className="text-accent fill-accent" size={18} />
          <span className="font-bold">{masteredCount}/{wordCards.length}</span>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Mastery</span>
          <span className={`font-bold ${masteryPercent >= 95 ? 'text-welded-text' : 'text-foreground'}`}>
            {masteryPercent}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              masteryPercent >= 95 ? 'bg-welded' : 'bg-primary'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${masteryPercent}%` }}
          />
        </div>
        {masteryPercent >= 95 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-welded-text text-center mt-1 font-bold"
          >
            🎉 Mastery achieved! Ready to advance!
          </motion.p>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
            >
              <motion.div 
                className="text-6xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                📚
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Word Wall</h2>
                <p className="text-xs text-primary font-bold uppercase mt-1">Core Learning Module</p>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Master these words with the Wilson method: <strong>See</strong> the word, <strong>Hear</strong> the sounds, <strong>Type</strong> it from memory!
              </p>
              <div className="bg-card border-2 border-primary/30 rounded-2xl p-4 max-w-xs shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="text-primary" size={20} />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-sm block">Wilson Step {wilsonStep}</span>
                    <span className="text-xs text-muted-foreground">Substep {wilsonSubstep}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted rounded-xl p-2">
                    <div className="text-lg font-bold text-foreground">{wordCards.length}</div>
                    <div className="text-[10px] text-muted-foreground">Words</div>
                  </div>
                  <div className="bg-muted rounded-xl p-2">
                    <div className="text-lg font-bold text-primary">95%</div>
                    <div className="text-[10px] text-muted-foreground">To Pass</div>
                  </div>
                  <div className="bg-muted rounded-xl p-2">
                    <div className="text-lg font-bold text-accent">∞</div>
                    <div className="text-[10px] text-muted-foreground">Retries</div>
                  </div>
                </div>
              </div>
              <Button size="lg" onClick={handleStartStudy} className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Begin Learning 📖
              </Button>
            </motion.div>
          )}

          {/* Study Phase - Word Wall Grid */}
          {phase === 'study' && (
            <motion.div
              key="study"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <p className="text-center text-muted-foreground mb-4">
                Tap each word to hear it
              </p>
              
              {/* Word Wall Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {wordCards.map((card) => {
                  const vowelInfo = getVowelKeyword(card.word);
                  
                  return (
                    <motion.button
                      key={card.id}
                      onClick={() => handleWordTap(card)}
                      className={`
                        relative p-4 rounded-2xl border-3 min-h-[80px]
                        flex flex-col items-center justify-center gap-1
                        transition-all active:scale-95
                        ${card.isRevealed 
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-card border-border text-foreground'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl">{vowelInfo.emoji}</span>
                      <span className="text-xl font-bold">{card.word}</span>
                      <Volume2 size={14} className="absolute bottom-2 right-2 opacity-40" />
                      
                      {card.isRevealed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-welded rounded-full flex items-center justify-center"
                        >
                          <span className="text-xs">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Start Test Button */}
              <div className="mt-auto">
                <Button 
                  className="w-full h-14 text-lg"
                  onClick={handleStartTest}
                  disabled={wordCards.filter(w => w.isRevealed).length < wordCards.length}
                >
                  {wordCards.filter(w => w.isRevealed).length < wordCards.length
                    ? `Tap all words first (${wordCards.filter(w => w.isRevealed).length}/${wordCards.length})`
                    : "I'm Ready to Test! 🎯"
                  }
                </Button>
              </div>
            </motion.div>
          )}

          {/* Test Phase */}
          {phase === 'test' && currentTestWord && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center"
            >
              <p className="text-muted-foreground mb-4">
                Word {currentTestIndex + 1} of {wordCards.length}
              </p>

              {/* Play Word Button */}
              <motion.button
                onClick={() => speakWord(currentTestWord.word)}
                className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg mb-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Volume2 className="text-primary-foreground" size={40} />
              </motion.button>

              <p className="text-lg font-medium text-foreground mb-4">
                Type the word you hear:
              </p>

              {/* Input Field */}
              <div className="w-full max-w-xs mb-6">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.toLowerCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className={`
                    w-full h-16 text-center text-3xl font-bold rounded-2xl border-4
                    bg-card outline-none transition-all
                    ${feedback === 'correct' ? 'border-welded bg-welded/20' : ''}
                    ${feedback === 'incorrect' ? 'border-destructive bg-destructive/20 animate-shake' : ''}
                    ${!feedback ? 'border-border focus:border-primary' : ''}
                  `}
                  placeholder="___"
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </div>

              {/* Hint Area */}
              <div className="min-h-[100px] mb-4">
                {renderHint()}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!userInput.trim() || feedback === 'correct'}
                className="w-full max-w-xs h-14 text-lg"
              >
                Check ✓
              </Button>
            </motion.div>
          )}

          {/* Results Phase */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-7xl mb-4"
              >
                {masteryPercent >= 95 ? '🏆' : masteryPercent >= 70 ? '⭐' : '💪'}
              </motion.div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {masteryPercent >= 95 
                  ? 'Amazing Mastery!' 
                  : masteryPercent >= 70 
                    ? 'Great Progress!' 
                    : 'Keep Practicing!'
                }
              </h2>

              <p className="text-muted-foreground mb-6">
                You mastered {masteredCount} of {wordCards.length} words!
              </p>

              {/* Stats */}
              <div className="bg-card border-2 border-border rounded-2xl p-4 w-full max-w-xs mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Mastery</span>
                  <span className="font-bold">{masteryPercent}%</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Hints Used</span>
                  <span className="font-bold">{hintsUsed}</span>
                </div>
                {fallingWords.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Words to practice:</p>
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(fallingWords)].map((word, i) => (
                        <span key={i} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-bold">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full max-w-xs">
                {masteryPercent < 95 && (
                  <Button variant="outline" onClick={handleRetryFailed} className="flex-1">
                    <RefreshCw size={18} className="mr-2" />
                    Retry
                  </Button>
                )}
                <Button onClick={handleFinish} className="flex-1">
                  <Trophy size={18} className="mr-2" />
                  Continue
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WordWallGame;
