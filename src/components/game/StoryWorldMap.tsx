import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, MapPin, Lock, Star, Sparkles, Unlock } from 'lucide-react';
import { StoryRegion, STORY_REGIONS } from '@/lib/storyData';
import { RegionUnlockCelebration } from './RegionUnlockCelebration';

interface StoryWorldMapProps {
  currentRegion: string;
  currentLevel: number;
  completedRegions: string[];
  onSelectRegion: (regionId: string) => void;
  onSpeak: (text: string) => void;
}

export const StoryWorldMap: React.FC<StoryWorldMapProps> = ({
  currentRegion,
  currentLevel,
  completedRegions,
  onSelectRegion,
  onSpeak,
}) => {
  const regions = Object.values(STORY_REGIONS);
  const prevLevelRef = useRef(currentLevel);
  const [newlyUnlockedRegion, setNewlyUnlockedRegion] = useState<StoryRegion | null>(null);
  const [showUnlockCelebration, setShowUnlockCelebration] = useState(false);
  const [justUnlockedIds, setJustUnlockedIds] = useState<string[]>([]);

  // Detect newly unlocked regions when level changes
  useEffect(() => {
    if (currentLevel > prevLevelRef.current) {
      const newlyUnlocked = regions.filter(
        region => region.unlockLevel <= currentLevel && region.unlockLevel > prevLevelRef.current
      );
      
      if (newlyUnlocked.length > 0) {
        setJustUnlockedIds(newlyUnlocked.map(r => r.id));
        setNewlyUnlockedRegion(newlyUnlocked[0]);
        setShowUnlockCelebration(true);
      }
      
      prevLevelRef.current = currentLevel;
    }
  }, [currentLevel, regions]);

  const isUnlocked = (region: StoryRegion) => currentLevel >= region.unlockLevel;
  const isCompleted = (region: StoryRegion) => completedRegions.includes(region.id);
  const isCurrent = (region: StoryRegion) => region.id === currentRegion;
  const isJustUnlocked = (region: StoryRegion) => justUnlockedIds.includes(region.id);

  const handleRegionClick = (region: StoryRegion) => {
    if (isUnlocked(region)) {
      onSpeak(region.name);
      onSelectRegion(region.id);
    } else {
      onSpeak(`${region.name} unlocks at level ${region.unlockLevel}`);
    }
  };

  const handleCelebrationClose = () => {
    setShowUnlockCelebration(false);
    // Clear just-unlocked after animation completes
    setTimeout(() => setJustUnlockedIds([]), 1000);
  };

  return (
    <>
      {/* Region Unlock Celebration */}
      {newlyUnlockedRegion && (
        <RegionUnlockCelebration
          isVisible={showUnlockCelebration}
          regionName={newlyUnlockedRegion.name}
          regionIcon={newlyUnlockedRegion.icon}
          regionDescription={newlyUnlockedRegion.description}
          npcName={newlyUnlockedRegion.npc.name}
          npcEmoji={newlyUnlockedRegion.npc.emoji}
          onClose={handleCelebrationClose}
          onSpeak={onSpeak}
        />
      )}

      <div className="relative min-h-[500px] bg-gradient-to-b from-sky-200 via-green-100 to-amber-100 rounded-3xl p-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds */}
        <motion.div
          className="absolute top-4 left-10 text-4xl opacity-60"
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute top-8 right-16 text-3xl opacity-50"
          animate={{ x: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        >
          ☁️
        </motion.div>
        
        {/* Sun */}
        <motion.div
          className="absolute top-2 right-4 text-5xl"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        >
          ☀️
        </motion.div>

        {/* Path connecting regions */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500">
          <path
            d="M 200 450 C 200 400 100 350 150 280 C 200 210 300 200 250 130 C 200 60 200 40 200 20"
            stroke="url(#pathGradient)"
            strokeWidth="8"
            strokeDasharray="12 8"
            fill="none"
            className="opacity-60"
          />
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Title */}
      <div className="relative text-center mb-4">
        <h2 className="text-2xl font-black text-foreground">Word Wonderland</h2>
        <p className="text-sm text-muted-foreground">Tap a region to explore!</p>
      </div>

      {/* Regions */}
      <div className="relative space-y-6 mt-8">
        {regions.map((region, index) => {
          const unlocked = isUnlocked(region);
          const completed = isCompleted(region);
          const current = isCurrent(region);
          const justUnlocked = isJustUnlocked(region);

          // Position regions in a winding path
          const isLeft = index % 2 === 0;

          return (
            <motion.button
              key={region.id}
              onClick={() => handleRegionClick(region)}
              className={`relative w-full flex items-center gap-4 p-4 rounded-2xl border-4 transition-all ${
                isLeft ? 'flex-row' : 'flex-row-reverse'
              } ${
                justUnlocked
                  ? 'bg-accent/30 border-accent shadow-xl'
                  : current
                    ? 'bg-primary/20 border-primary shadow-lg scale-105'
                    : completed
                      ? 'bg-welded/30 border-welded-border'
                      : unlocked
                        ? 'bg-card border-border hover:border-primary/50'
                        : 'bg-muted/50 border-border/50 opacity-60'
              }`}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: justUnlocked ? [1, 1.05, 1] : 1,
              }}
              transition={{ 
                delay: index * 0.15,
                scale: { duration: 0.5, repeat: justUnlocked ? Infinity : 0, repeatDelay: 0.5 },
              }}
              whileTap={unlocked ? { scale: 0.98 } : {}}
            >
              {/* Just unlocked glow effect */}
              {justUnlocked && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/40 via-primary/40 to-accent/40"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              {/* Unlock burst animation */}
              <AnimatePresence>
                {justUnlocked && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 text-xl"
                        initial={{ x: 0, y: 0, scale: 0 }}
                        animate={{
                          x: Math.cos(i * 45 * Math.PI / 180) * 80,
                          y: Math.sin(i * 45 * Math.PI / 180) * 80,
                          scale: [0, 1.5, 0],
                          opacity: [1, 1, 0],
                        }}
                        transition={{ duration: 1, delay: 0.1 * i }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Region Icon */}
              <motion.div
                className={`relative w-20 h-20 rounded-2xl flex items-center justify-center text-5xl ${
                  unlocked ? 'bg-white shadow-md' : 'bg-muted'
                }`}
                animate={current ? {
                  y: [0, -5, 0],
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {unlocked ? region.icon : <Lock className="text-muted-foreground" size={32} />}
                
                {/* Status indicator */}
                {completed && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-welded-border rounded-full flex items-center justify-center">
                    <Star className="text-white fill-white" size={16} />
                  </div>
                )}
                {current && !completed && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <MapPin className="text-primary-foreground" size={16} />
                  </motion.div>
                )}
              </motion.div>

              {/* Region Info */}
              <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
                <div className="flex items-center gap-2" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
                  <h3 className={`font-black text-lg ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {region.name}
                  </h3>
                  {unlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpeak(`${region.name}. ${region.description}`);
                      }}
                      className="h-10 w-10 min-h-[44px] min-w-[44px] bg-muted rounded-full flex items-center justify-center active:scale-95"
                      aria-label={`Hear about ${region.name}`}
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
                <p className={`text-sm ${unlocked ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                  {unlocked ? region.description : `Unlocks at Level ${region.unlockLevel}`}
                </p>
                
                {/* NPC Preview */}
                {unlocked && (
                  <div className="flex items-center gap-2 mt-2" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
                    <span className="text-xl">{region.npc.emoji}</span>
                    <span className="text-xs text-muted-foreground">
                      {region.npc.name} awaits!
                    </span>
                  </div>
                )}
              </div>

              {/* Current region sparkles */}
              {current && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-lg"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.5,
                        repeat: Infinity,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="relative flex justify-center gap-4 mt-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> Current
        </span>
        <span className="flex items-center gap-1">
          <Star size={12} /> Completed
        </span>
        <span className="flex items-center gap-1">
          <Lock size={12} /> Locked
        </span>
      </div>
    </div>
    </>
  );
};
