import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Confetti } from '@/components/lexi/Confetti';

interface QuestVictoryProps {
  questName: string;
  results: {
    correct: number;
    total: number;
    hintsUsed: number;
    timeSeconds: number;
  };
  xpEarned: number;
  onContinue: () => void;
  onRetry: () => void;
}

export const QuestVictory: React.FC<QuestVictoryProps> = ({
  questName,
  results,
  xpEarned,
  onContinue,
  onRetry,
}) => {
  const { speak, playEffect } = useLexiaAudio();
  
  const accuracy = Math.round((results.correct / results.total) * 100);
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

  useEffect(() => {
    playEffect('complete');
    setTimeout(() => {
      speak(`Quest complete! You earned ${xpEarned} experience points!`);
    }, 500);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-b from-accent/20 via-background to-primary/20 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Confetti />

      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          🎉
        </motion.div>
        <h1 className="text-4xl font-black text-foreground mb-2">
          Quest Complete!
        </h1>
        <p className="text-lg text-muted-foreground">{questName}</p>
      </motion.div>

      {/* Stars */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', bounce: 0.5 }}
      >
        {[1, 2, 3].map((starNum) => (
          <motion.div
            key={starNum}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: starNum <= stars ? 1 : 0.3,
              scale: 1,
            }}
            transition={{ delay: 0.5 + starNum * 0.2 }}
          >
            <Star 
              size={48} 
              className={starNum <= stars ? 'text-accent fill-accent' : 'text-muted'} 
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Card */}
      <motion.div
        className="w-full max-w-sm bg-card rounded-3xl p-6 shadow-xl border-2 border-border mb-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* XP Earned */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-accent" size={24} />
            </div>
            <span className="font-bold text-lg">XP Earned</span>
          </div>
          <motion.span
            className="text-3xl font-black text-accent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            +{xpEarned}
          </motion.span>
        </div>

        {/* Accuracy */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground">Accuracy</span>
          <span className="font-bold">{accuracy}%</span>
        </div>

        {/* Correct answers */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground">Correct Answers</span>
          <span className="font-bold">{results.correct} / {results.total}</span>
        </div>

        {/* Time */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground">Time</span>
          <span className="font-bold">{Math.floor(results.timeSeconds / 60)}:{(results.timeSeconds % 60).toString().padStart(2, '0')}</span>
        </div>

        {/* Hints */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Hints Used</span>
          <span className="font-bold">{results.hintsUsed}</span>
        </div>
      </motion.div>

      {/* Whisper celebration */}
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-5xl">🦉</span>
        <div className="bg-card px-4 py-2 rounded-xl shadow-lg">
          <p className="font-medium text-foreground">
            {stars === 3 ? "Perfect! You're a word wizard!" :
             stars === 2 ? "Great job! Keep practicing!" :
             "Good effort! Try again for more stars!"}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-4 w-full max-w-sm"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <button
          onClick={onRetry}
          className="flex-1 h-14 bg-muted rounded-2xl flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform"
        >
          <RotateCcw size={20} />
          Retry
        </button>
        <button
          onClick={onContinue}
          className="flex-1 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform"
        >
          Continue
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};
