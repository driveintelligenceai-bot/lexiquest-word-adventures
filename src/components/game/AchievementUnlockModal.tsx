import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';

interface AchievementUnlockModalProps {
  achievement: {
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  } | null;
  onClose: () => void;
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    if (achievement) {
      sounds.achievement();
      
      // Auto-close after 3 seconds
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 pointer-events-none"
        >
          {/* Particle burst background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
              >
                {['✨', '⭐', '🌟', '💫', '🎉', '🎊'][i % 6]}
              </motion.div>
            ))}
          </div>

          {/* Main card */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="bg-card p-8 rounded-3xl text-center shadow-2xl border-4 border-accent pointer-events-auto max-w-xs"
            onClick={onClose}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-accent/20"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />

            {/* Trophy burst */}
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <motion.div
                className={`w-24 h-24 mx-auto mb-4 rounded-2xl ${achievement.bgColor} flex items-center justify-center relative`}
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(255,200,0,0.3)',
                    '0 0 40px rgba(255,200,0,0.6)',
                    '0 0 20px rgba(255,200,0,0.3)',
                  ]
                }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <achievement.icon size={48} className={achievement.color} />
                
                {/* Rotating sparkles */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-lg"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos((angle + 0) * Math.PI / 180) * 50],
                      y: [0, Math.sin((angle + 0) * Math.PI / 180) * 50],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.15,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-accent font-black text-sm uppercase tracking-wider mb-1">
                🏆 Achievement Unlocked!
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                {achievement.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {achievement.description}
              </p>
            </motion.div>

            {/* Tap to close hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 text-xs text-muted-foreground"
            >
              Tap to continue
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};