import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Star, Gift, X } from 'lucide-react';
import { TreasureReward } from '@/lib/storyData';

interface TreasureFoundModalProps {
  treasure: TreasureReward;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

const RARITY_STYLES = {
  common: {
    bg: 'from-amber-600 to-amber-800',
    border: 'border-amber-400',
    text: 'text-amber-300',
    glow: 'shadow-amber-500/50',
  },
  rare: {
    bg: 'from-blue-600 to-blue-800',
    border: 'border-blue-400',
    text: 'text-blue-300',
    glow: 'shadow-blue-500/50',
  },
  epic: {
    bg: 'from-purple-600 to-purple-800',
    border: 'border-purple-400',
    text: 'text-purple-300',
    glow: 'shadow-purple-500/50',
  },
  legendary: {
    bg: 'from-yellow-500 to-orange-600',
    border: 'border-yellow-300',
    text: 'text-yellow-200',
    glow: 'shadow-yellow-400/50',
  },
};

export const TreasureFoundModal: React.FC<TreasureFoundModalProps> = ({
  treasure,
  onClose,
  onSpeak,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const styles = RARITY_STYLES[treasure.rarity];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
      onSpeak(`Treasure found! You got a ${treasure.name}! Plus ${treasure.xpBonus} bonus XP!`);
    }, 800);
    return () => clearTimeout(timer);
  }, [treasure, onSpeak]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className={`w-full max-w-sm bg-gradient-to-b ${styles.bg} rounded-3xl p-6 shadow-2xl ${styles.border} border-4 text-center ${styles.glow} shadow-lg`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Treasure Chest / Revealed Item */}
          <div className="relative h-32 flex items-center justify-center">
            {!isRevealed ? (
              <motion.div
                className="text-7xl"
                animate={{
                  y: [0, -5, 0],
                  rotate: [-3, 3, -3],
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                🎁
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 10 }}
                className="text-8xl"
              >
                {treasure.emoji}
              </motion.div>
            )}

            {/* Sparkles */}
            {isRevealed && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos((i / 8) * Math.PI * 2) * 60,
                      y: Math.sin((i / 8) * Math.PI * 2) * 60,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.05,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Rarity Badge */}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mb-2 ${styles.text} bg-black/30`}>
                {treasure.rarity}
              </div>

              {/* Name */}
              <h2 className="text-2xl font-black text-white mb-2">
                {treasure.name}
              </h2>

              {/* Description */}
              <p className="text-white/80 text-sm mb-4">
                {treasure.description}
              </p>

              {/* XP Bonus */}
              <div className="flex items-center justify-center gap-2 bg-black/30 rounded-xl p-3 mb-4">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="text-yellow-400 font-black text-xl">
                  +{treasure.xpBonus} Bonus XP!
                </span>
              </div>

              {/* Speak button */}
              <button
                onClick={() => onSpeak(`${treasure.name}. ${treasure.description}`)}
                className="h-12 w-12 mx-auto bg-white/20 rounded-full flex items-center justify-center active:scale-95 mb-4"
              >
                <Volume2 className="text-white" size={20} />
              </button>
            </motion.div>
          )}

          {/* Collect button */}
          {isRevealed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="w-full h-14 bg-white text-foreground font-bold rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Gift size={20} />
              Collect Treasure!
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
