import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, MapPin, Rocket } from 'lucide-react';

interface RegionUnlockCelebrationProps {
  isVisible: boolean;
  regionName: string;
  regionIcon: string;
  regionDescription: string;
  npcName: string;
  npcEmoji: string;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const RegionUnlockCelebration: React.FC<RegionUnlockCelebrationProps> = ({
  isVisible,
  regionName,
  regionIcon,
  regionDescription,
  npcName,
  npcEmoji,
  onClose,
  onSpeak,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [stage, setStage] = useState<'unlock' | 'reveal' | 'npc'>('unlock');

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      setStage('unlock');
      onSpeak(`Amazing! You've unlocked ${regionName}!`);
      
      // Progress through stages
      const timer1 = setTimeout(() => setStage('reveal'), 1500);
      const timer2 = setTimeout(() => {
        setStage('npc');
        onSpeak(`${npcName} is excited to meet you!`);
      }, 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible, regionName, npcName, onSpeak]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Confetti particles */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  opacity: 1,
                  x: '50%', 
                  y: '50%',
                  scale: 0,
                }}
                animate={{ 
                  opacity: [1, 1, 0],
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1.5, 1],
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{ 
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              >
                {['⭐', '✨', '🌟', '💫', '🎉', '🎊'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        )}

        {/* Main celebration card */}
        <motion.div
          className="relative bg-card rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl border-4 border-primary overflow-hidden"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20"
            animate={{ 
              background: [
                'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))',
                'linear-gradient(225deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2))',
                'linear-gradient(315deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Stage: Unlock */}
          <AnimatePresence mode="wait">
            {stage === 'unlock' && (
              <motion.div
                key="unlock"
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <Rocket className="w-16 h-16 mx-auto text-primary mb-4" />
                </motion.div>
                <h2 className="text-2xl font-black text-primary">NEW REGION!</h2>
                <motion.div
                  className="flex justify-center gap-2 mt-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Sparkles className="text-accent" />
                  <Sparkles className="text-primary" />
                  <Sparkles className="text-accent" />
                </motion.div>
              </motion.div>
            )}

            {/* Stage: Reveal */}
            {stage === 'reveal' && (
              <motion.div
                key="reveal"
                className="relative text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {regionIcon}
                </motion.div>
                <h2 className="text-2xl font-black text-foreground mb-2">{regionName}</h2>
                <p className="text-muted-foreground">{regionDescription}</p>
              </motion.div>
            )}

            {/* Stage: NPC */}
            {stage === 'npc' && (
              <motion.div
                key="npc"
                className="relative text-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {npcEmoji}
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Meet {npcName}!
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your new guide in {regionName}
                </p>

                <motion.button
                  onClick={onClose}
                  className="w-full min-h-[56px] bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl font-bold text-lg shadow-lg active:scale-95"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MapPin size={20} />
                    Start Exploring!
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-2 left-2 text-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            ⭐
          </motion.div>
          <motion.div
            className="absolute top-2 right-2 text-2xl"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            ⭐
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-2 text-2xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-2 right-2 text-2xl"
            animate={{ scale: [1.3, 1, 1.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ✨
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Level Up Celebration Component
interface LevelUpCelebrationProps {
  isVisible: boolean;
  newLevel: number;
  xpEarned: number;
  unlockedRegion?: {
    name: string;
    icon: string;
  } | null;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  isVisible,
  newLevel,
  xpEarned,
  unlockedRegion,
  onClose,
  onSpeak,
}) => {
  useEffect(() => {
    if (isVisible) {
      onSpeak(`Level up! You are now level ${newLevel}!`);
      if (unlockedRegion) {
        setTimeout(() => {
          onSpeak(`You've unlocked ${unlockedRegion.name}!`);
        }, 2000);
      }
    }
  }, [isVisible, newLevel, unlockedRegion, onSpeak]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Burst rays */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 bg-gradient-to-t from-primary to-accent origin-bottom"
              style={{
                height: '50vh',
                rotate: `${i * 30}deg`,
                translateX: '-50%',
                translateY: '-100%',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                scaleY: [0, 1, 0],
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>

        {/* Stars explosion */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 text-3xl"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0.5],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.3,
                ease: 'easeOut',
              }}
            >
              ⭐
            </motion.div>
          ))}
        </div>

        {/* Main card */}
        <motion.div
          className="relative bg-card rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl border-4 border-accent overflow-hidden"
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.2 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />

          <div className="relative text-center">
            {/* Level badge */}
            <motion.div
              className="relative inline-block mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-xl">
                <span className="text-4xl font-black text-primary-foreground">
                  {newLevel}
                </span>
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-8 h-8 text-accent fill-accent" />
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              LEVEL UP!
            </motion.h2>
            
            <p className="text-muted-foreground mb-4">
              You earned <span className="font-bold text-primary">{xpEarned} XP</span>!
            </p>

            {/* Unlocked region preview */}
            {unlockedRegion && (
              <motion.div
                className="bg-primary/10 rounded-2xl p-4 mb-4 border-2 border-primary/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{unlockedRegion.icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-primary uppercase">New Region Unlocked!</div>
                    <div className="font-bold text-foreground">{unlockedRegion.name}</div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={onClose}
              className="w-full min-h-[56px] bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              Awesome! 🎉
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
