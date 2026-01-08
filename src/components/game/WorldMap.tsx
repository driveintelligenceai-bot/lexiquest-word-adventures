import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Sparkles } from 'lucide-react';
import { LEXIA_REGIONS } from '@/lib/lexiaTheme';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';

interface WorldMapProps {
  currentRegion: string;
  currentLevel: number;
  unlockedRegions: string[];
  onSelectRegion: (regionId: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentRegion,
  currentLevel,
  unlockedRegions,
  onSelectRegion,
}) => {
  const { speak, playEffect } = useLexiaAudio();

  const handleRegionClick = (regionId: string, isLocked: boolean) => {
    if (isLocked) {
      playEffect('tryAgain');
      const region = LEXIA_REGIONS[regionId as keyof typeof LEXIA_REGIONS];
      speak(`This region unlocks at level ${region.unlockLevel}!`);
    } else {
      playEffect('tap');
      speak(LEXIA_REGIONS[regionId as keyof typeof LEXIA_REGIONS].name);
      onSelectRegion(regionId);
    }
  };

  const regions = Object.values(LEXIA_REGIONS);

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-primary/10 via-accent/5 to-primary/10 rounded-3xl overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl">☁️</div>
        <div className="absolute top-20 right-20 text-4xl">☁️</div>
        <div className="absolute bottom-20 left-1/4 text-5xl">🌳</div>
        <div className="absolute bottom-10 right-1/3 text-5xl">🌲</div>
      </div>

      {/* Region nodes */}
      <div className="relative h-full flex flex-col items-center justify-around py-8">
        {regions.map((region, index) => {
          const isUnlocked = unlockedRegions.includes(region.id);
          const isCurrent = currentRegion === region.id;
          const isLocked = currentLevel < region.unlockLevel;

          return (
            <motion.button
              key={region.id}
              onClick={() => handleRegionClick(region.id, isLocked)}
              className={`
                relative flex items-center gap-4 px-6 py-4 rounded-2xl
                border-2 shadow-lg transition-all
                ${isCurrent 
                  ? 'bg-accent border-accent text-accent-foreground scale-105' 
                  : isLocked 
                    ? 'bg-muted/50 border-muted text-muted-foreground opacity-60'
                    : 'bg-card border-border hover:border-primary hover:shadow-xl'
                }
              `}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isLocked ? { scale: 1.05 } : {}}
              whileTap={!isLocked ? { scale: 0.95 } : {}}
            >
              {/* Region icon */}
              <span className="text-4xl">{region.icon}</span>

              {/* Region info */}
              <div className="text-left">
                <h3 className="font-bold text-lg">{region.name}</h3>
                <p className="text-sm opacity-70">{region.description}</p>
              </div>

              {/* Status indicator */}
              {isLocked ? (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Lock size={16} />
                </div>
              ) : isCurrent ? (
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Sparkles size={16} className="text-primary-foreground" />
                </motion.div>
              ) : isUnlocked ? (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Star size={16} className="text-accent-foreground" />
                </div>
              ) : null}
            </motion.button>
          );
        })}

        {/* Connecting path lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M 50% 80 Q 30% 200 50% 320 Q 70% 420 50% 480"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            strokeDasharray="10,10"
          />
        </svg>
      </div>
    </div>
  );
};
