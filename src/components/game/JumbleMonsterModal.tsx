import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X, Sparkles } from 'lucide-react';
import { JumbleMonsterEncounter } from '@/lib/storyData';

interface JumbleMonsterModalProps {
  encounter: JumbleMonsterEncounter;
  isDefeated: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const JumbleMonsterModal: React.FC<JumbleMonsterModalProps> = ({
  encounter,
  isDefeated,
  onClose,
  onSpeak,
}) => {
  const [showDefeat, setShowDefeat] = useState(false);

  useEffect(() => {
    // Speak the monster's dialogue
    const text = isDefeated ? encounter.defeat : encounter.taunt;
    onSpeak(text);
    
    if (isDefeated) {
      const timer = setTimeout(() => setShowDefeat(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [encounter, isDefeated, onSpeak]);

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
          initial={{ scale: 0.5, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 100 }}
          className="w-full max-w-md bg-gradient-to-b from-purple-900 to-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-purple-500/50 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Monster */}
          <motion.div
            className="text-8xl mb-4"
            animate={isDefeated ? {
              scale: [1, 0.8, 0],
              rotate: [0, 180, 360],
              opacity: [1, 1, 0],
            } : {
              scale: [1, 1.1, 1],
              rotate: [-5, 5, -5],
            }}
            transition={isDefeated ? {
              duration: 2,
              ease: 'easeInOut',
            } : {
              repeat: Infinity,
              duration: 1,
            }}
          >
            {encounter.emoji}
          </motion.div>

          {/* Name */}
          <h2 className={`text-2xl font-black mb-2 ${isDefeated ? 'text-green-400' : 'text-red-400'}`}>
            {encounter.name}
          </h2>

          {/* Dialogue */}
          <div className="bg-black/30 rounded-2xl p-4 mb-4">
            <p className="text-white font-medium">
              {isDefeated ? encounter.defeat : encounter.taunt}
            </p>
          </div>

          {/* Speak button */}
          <button
            onClick={() => onSpeak(isDefeated ? encounter.defeat : encounter.taunt)}
            className="h-12 w-12 mx-auto bg-purple-600 rounded-full flex items-center justify-center active:scale-95 mb-4"
          >
            <Volume2 className="text-white" size={20} />
          </button>

          {/* Victory effects */}
          {isDefeated && showDefeat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [-20, 0], opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <p className="text-green-400 font-bold">
                <Sparkles className="inline mr-2" size={16} />
                Victory! You defeated {encounter.name}!
              </p>
            </motion.div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full h-14 mt-4 bg-purple-600 text-white font-bold rounded-2xl active:scale-95 transition-transform"
          >
            {isDefeated ? 'Continue Adventure!' : 'Face the Challenge!'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
