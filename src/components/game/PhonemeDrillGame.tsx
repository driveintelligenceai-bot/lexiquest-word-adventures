import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft, Star, Mic, Play, RotateCcw } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper, WhisperHintButton } from './Whisper';

interface PhonemeDrillGameProps {
  onComplete: (results: { correct: number; total: number; hintsUsed: number; timeSeconds: number }) => void;
  onBack: () => void;
  questionsCount?: number;
}

// Wilson 1.1 Phonemes - short 'a' vowel + consonants f, l, m, n, r, s, t, p
const WILSON_1_1_PHONEMES = [
  { letter: 'a', sound: 'ah', type: 'vowel', hint: 'Open your mouth wide and say "ahh" like at the doctor!', example: 'apple' },
  { letter: 'f', sound: 'fff', type: 'consonant', hint: 'Bite your bottom lip and blow air out gently', example: 'fish' },
  { letter: 'l', sound: 'lll', type: 'consonant', hint: 'Put your tongue on the roof of your mouth', example: 'lion' },
  { letter: 'm', sound: 'mmm', type: 'consonant', hint: 'Close your lips and hum like something yummy!', example: 'mouse' },
  { letter: 'n', sound: 'nnn', type: 'consonant', hint: 'Touch your tongue behind your top teeth and hum', example: 'nest' },
  { letter: 'r', sound: 'rrr', type: 'consonant', hint: 'Pull your tongue back and growl like a tiger!', example: 'rabbit' },
  { letter: 's', sound: 'sss', type: 'consonant', hint: 'Put your teeth together and hiss like a snake!', example: 'snake' },
  { letter: 't', sound: 'tuh', type: 'consonant', hint: 'Touch your tongue behind your top teeth, then pop!', example: 'tiger' },
  { letter: 'p', sound: 'puh', type: 'consonant', hint: 'Press your lips together then pop them open!', example: 'pig' },
];

type DrillPhase = 'intro' | 'listen' | 'practice' | 'identify' | 'complete';

interface DrillItem {
  phoneme: typeof WILSON_1_1_PHONEMES[0];
  mastered: boolean;
  attempts: number;
}

export const PhonemeDrillGame: React.FC<PhonemeDrillGameProps> = ({
  onComplete,
  onBack,
  questionsCount = 6,
}) => {
  const [phase, setPhase] = useState<DrillPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drillItems, setDrillItems] = useState<DrillItem[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [identifyOptions, setIdentifyOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [startTime] = useState(Date.now());
  const [practiceCount, setPracticeCount] = useState(0);

  const { speak, speakPhoneme, playEffect } = useLexiaAudio();

  // Initialize drill items
  useEffect(() => {
    const shuffled = [...WILSON_1_1_PHONEMES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionsCount);
    setDrillItems(selected.map(p => ({ phoneme: p, mastered: false, attempts: 0 })));
  }, [questionsCount]);

  const currentItem = drillItems[currentIndex];
  const masteredCount = drillItems.filter(d => d.mastered).length;

  // Generate identify options
  useEffect(() => {
    if (phase === 'identify' && currentItem) {
      const otherPhonemes = WILSON_1_1_PHONEMES
        .filter(p => p.letter !== currentItem.phoneme.letter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [currentItem.phoneme.letter, ...otherPhonemes.map(p => p.letter)]
        .sort(() => Math.random() - 0.5);
      
      setIdentifyOptions(options);
      setSelectedAnswer(null);
      setFeedback(null);
    }
  }, [phase, currentIndex, currentItem]);

  // Play intro
  useEffect(() => {
    if (phase === 'intro') {
      speak("Let's practice letter sounds! Listen carefully and repeat after me.");
    }
  }, [phase]);

  const handleStartDrill = () => {
    setPhase('listen');
    playEffect('tap');
  };

  const handlePlaySound = useCallback(() => {
    if (currentItem) {
      playEffect('tap');
      speakPhoneme(currentItem.phoneme.letter);
    }
  }, [currentItem, speakPhoneme, playEffect]);

  const handlePractice = () => {
    setPhase('practice');
    setPracticeCount(0);
    speak(`Now you try! Say the sound for ${currentItem.phoneme.letter.toUpperCase()}`);
  };

  const handlePracticeAttempt = () => {
    setPracticeCount(prev => prev + 1);
    playEffect('tap');
    
    // After 2 practice attempts, move to identify phase
    if (practiceCount >= 1) {
      speak("Great practice! Now let's test what you learned.");
      setTimeout(() => {
        setPhase('identify');
        speakPhoneme(currentItem.phoneme.letter);
      }, 1500);
    } else {
      speak("Good try! One more time!");
      setTimeout(() => speakPhoneme(currentItem.phoneme.letter), 1000);
    }
  };

  const handleIdentifySelect = (letter: string) => {
    if (feedback) return;
    
    setSelectedAnswer(letter);
    playEffect('tap');
    speakPhoneme(letter);

    if (letter === currentItem.phoneme.letter) {
      // Correct!
      setFeedback('correct');
      playEffect('correct');
      speak("Perfect! You know that sound!");
      
      setDrillItems(prev => prev.map((item, i) => 
        i === currentIndex ? { ...item, mastered: true } : item
      ));

      setTimeout(() => {
        if (currentIndex < drillItems.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setPhase('listen');
          setShowHint(false);
        } else {
          setPhase('complete');
          playEffect('complete');
        }
      }, 1500);
    } else {
      // Wrong
      setFeedback('wrong');
      playEffect('tryAgain');
      setShowHint(true);
      
      setDrillItems(prev => prev.map((item, i) => 
        i === currentIndex ? { ...item, attempts: item.attempts + 1 } : item
      ));

      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        speakPhoneme(currentItem.phoneme.letter);
      }, 1500);
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    speak(currentItem.phoneme.hint);
  };

  const handleComplete = () => {
    const timeSeconds = Math.round((Date.now() - startTime) / 1000);
    onComplete({
      correct: masteredCount,
      total: drillItems.length,
      hintsUsed,
      timeSeconds,
    });
  };

  const handleReplay = () => {
    speakPhoneme(currentItem.phoneme.letter);
  };

  if (!currentItem && phase !== 'intro' && phase !== 'complete') {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-2xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 pb-32 safe-area-inset">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="h-12 w-12 rounded-full bg-muted flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        
        {phase !== 'intro' && phase !== 'complete' && (
          <div className="flex items-center gap-2">
            {drillItems.map((item, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  item.mastered ? 'bg-primary' : 
                  i === currentIndex ? 'bg-accent animate-pulse' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-1">
          <Star className="text-accent fill-accent" size={20} />
          <span className="font-bold">{masteredCount}</span>
        </div>
      </div>

      {/* Intro Phase */}
      {phase === 'intro' && (
        <motion.div 
          className="flex flex-col items-center justify-center min-h-[60vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-8xl mb-6">🔊</div>
          <h1 className="text-3xl font-black text-foreground text-center mb-4">
            Sound Practice
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8 max-w-xs">
            Learn each letter sound step by step!
          </p>
          
          <div className="bg-card border-2 border-border rounded-3xl p-6 mb-8 max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">1️⃣</span>
              </div>
              <p className="font-medium">Listen to the sound</p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">2️⃣</span>
              </div>
              <p className="font-medium">Practice saying it</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-welded/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">3️⃣</span>
              </div>
              <p className="font-medium">Find the matching letter</p>
            </div>
          </div>

          <button
            onClick={handleStartDrill}
            className="w-full max-w-xs h-16 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            Let's Start! 🎯
          </button>
        </motion.div>
      )}

      {/* Listen Phase */}
      {phase === 'listen' && currentItem && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          key={`listen-${currentIndex}`}
        >
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Listen to this sound:
          </h2>

          {/* Big Letter Display */}
          <motion.div
            className={`w-48 h-48 rounded-3xl flex items-center justify-center mb-8 border-4 shadow-xl ${
              currentItem.phoneme.type === 'vowel' 
                ? 'bg-vowel border-vowel-border' 
                : 'bg-consonant border-consonant-border'
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className={`text-8xl font-black ${
              currentItem.phoneme.type === 'vowel' ? 'text-vowel-text' : 'text-consonant-text'
            }`}>
              {currentItem.phoneme.letter.toUpperCase()}
            </span>
          </motion.div>

          {/* Play Sound Button */}
          <motion.button
            onClick={handlePlaySound}
            className="w-32 h-32 bg-primary rounded-full flex flex-col items-center justify-center shadow-lg mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 className="text-primary-foreground mb-2" size={40} />
            <span className="text-primary-foreground font-bold text-sm">Play Sound</span>
          </motion.button>

          <p className="text-muted-foreground text-center mb-8">
            This letter says "{currentItem.phoneme.sound}"
          </p>

          <button
            onClick={handlePractice}
            className="w-full max-w-xs h-14 bg-accent text-accent-foreground rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            I'm Ready to Practice! 🎤
          </button>
        </motion.div>
      )}

      {/* Practice Phase */}
      {phase === 'practice' && currentItem && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-center text-foreground mb-4">
            Your Turn!
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Say the sound for this letter:
          </p>

          {/* Letter Display */}
          <motion.div
            className={`w-40 h-40 rounded-3xl flex items-center justify-center mb-6 border-4 shadow-xl ${
              currentItem.phoneme.type === 'vowel' 
                ? 'bg-vowel border-vowel-border' 
                : 'bg-consonant border-consonant-border'
            }`}
          >
            <span className={`text-7xl font-black ${
              currentItem.phoneme.type === 'vowel' ? 'text-vowel-text' : 'text-consonant-text'
            }`}>
              {currentItem.phoneme.letter.toUpperCase()}
            </span>
          </motion.div>

          {/* Hint text */}
          <div className="bg-card border-2 border-border rounded-2xl p-4 mb-6 max-w-sm text-center">
            <p className="text-sm text-muted-foreground">💡 {currentItem.phoneme.hint}</p>
          </div>

          {/* Practice buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleReplay}
              className="h-14 px-6 bg-muted text-muted-foreground rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw size={20} />
              Hear Again
            </button>
            <motion.button
              onClick={handlePracticeAttempt}
              className="h-14 px-8 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 shadow-lg"
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Mic size={20} />
              I Said It!
            </motion.button>
          </div>

          <p className="text-sm text-muted-foreground">
            Practice {practiceCount + 1} of 2
          </p>
        </motion.div>
      )}

      {/* Identify Phase */}
      {phase === 'identify' && currentItem && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-center text-foreground mb-4">
            Find the Letter!
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Which letter makes this sound?
          </p>

          {/* Play Sound Button */}
          <motion.button
            onClick={handlePlaySound}
            className="w-24 h-24 bg-primary rounded-full flex flex-col items-center justify-center shadow-lg mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 className="text-primary-foreground" size={32} />
          </motion.button>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-xs w-full mb-8">
            {identifyOptions.map((letter) => {
              const phoneme = WILSON_1_1_PHONEMES.find(p => p.letter === letter);
              const isVowel = phoneme?.type === 'vowel';
              const isSelected = selectedAnswer === letter;
              const isCorrect = feedback === 'correct' && letter === currentItem.phoneme.letter;
              const isWrong = feedback === 'wrong' && isSelected;

              return (
                <motion.button
                  key={letter}
                  onClick={() => handleIdentifySelect(letter)}
                  disabled={feedback === 'correct'}
                  className={`
                    h-24 rounded-2xl text-5xl font-bold
                    flex items-center justify-center
                    border-4 shadow-lg transition-all
                    active:scale-95
                    ${isCorrect ? 'bg-welded border-welded-border ring-4 ring-accent' : ''}
                    ${isWrong ? 'bg-destructive/20 border-destructive animate-shake' : ''}
                    ${!isCorrect && !isWrong && isVowel 
                      ? 'bg-vowel border-vowel-border text-vowel-text' 
                      : !isCorrect && !isWrong 
                      ? 'bg-consonant border-consonant-border text-consonant-text'
                      : ''
                    }
                    ${showHint && letter === currentItem.phoneme.letter && !feedback 
                      ? 'ring-2 ring-accent animate-pulse' 
                      : ''
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {letter.toUpperCase()}
                </motion.button>
              );
            })}
          </div>

          {/* Whisper Hint */}
          <AnimatePresence>
            {showHint && !feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Whisper 
                  message={`Listen again! ${currentItem.phoneme.hint}`}
                  variant="hint"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <WhisperHintButton
            hintsUsed={hintsUsed}
            onRequestHint={handleHint}
          />
        </motion.div>
      )}

      {/* Complete Phase */}
      {phase === 'complete' && (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[60vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: 2, duration: 0.5 }}
          >
            🎉
          </motion.div>
          
          <h1 className="text-3xl font-black text-foreground text-center mb-4">
            Sound Champion!
          </h1>
          
          <p className="text-lg text-muted-foreground text-center mb-8">
            You mastered {masteredCount} out of {drillItems.length} sounds!
          </p>

          <div className="flex gap-2 mb-8">
            {drillItems.map((item, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  item.mastered 
                    ? 'bg-welded text-welded-text border-2 border-welded-border' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {item.phoneme.letter.toUpperCase()}
              </div>
            ))}
          </div>

          <button
            onClick={handleComplete}
            className="w-full max-w-xs h-16 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            Continue! 🚀
          </button>
        </motion.div>
      )}
    </div>
  );
};
