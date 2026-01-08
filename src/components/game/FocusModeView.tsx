import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';

interface Quest {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

interface FocusModeViewProps {
  characterName: string;
  characterAvatar: string;
  streak: number;
  onStartQuest: (questType: string) => void;
  onOpenSettings: () => void;
  onSpeak: (text: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const QUESTS: Quest[] = [
  { id: 'sound', name: 'Sound Match', emoji: '🔊', color: 'bg-primary', description: 'Match sounds to letters' },
  { id: 'word', name: 'Word Builder', emoji: '🔤', color: 'bg-consonant', description: 'Build words with tiles' },
  { id: 'rhyme', name: 'Rhyme Hunt', emoji: '🎵', color: 'bg-vowel', description: 'Find rhyming words' },
  { id: 'memory', name: 'Memory Match', emoji: '🧠', color: 'bg-digraph', description: 'Match word pairs' },
  { id: 'syllable', name: 'Syllable Sort', emoji: '👏', color: 'bg-welded', description: 'Sort words by syllables' },
  { id: 'spelling', name: 'Spelling', emoji: '✏️', color: 'bg-accent', description: 'Spell words correctly' },
  { id: 'vocabulary', name: 'Word Meanings', emoji: '📚', color: 'bg-secondary', description: 'Learn word meanings' },
];

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  characterName,
  characterAvatar,
  streak,
  onStartQuest,
  onOpenSettings,
  onSpeak,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuest = QUESTS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? QUESTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === QUESTS.length - 1 ? 0 : prev + 1));
  };

  const handleStart = () => {
    onSpeak(`Starting ${currentQuest.name}!`);
    onStartQuest(currentQuest.id);
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 safe-area-inset">
      {/* Minimal Header */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={onToggleSound}
          className="h-12 w-12 rounded-full bg-card flex items-center justify-center shadow-lg active:scale-95"
          aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
          {soundEnabled ? (
            <Volume2 size={20} className="text-primary" />
          ) : (
            <VolumeX size={20} className="text-muted-foreground" />
          )}
        </button>

        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-lg">
          <span className="text-2xl">{characterAvatar}</span>
          <span className="font-bold text-foreground">{characterName}</span>
          {streak > 0 && (
            <span className="text-accent font-black">🔥 {streak}</span>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className="h-12 w-12 rounded-full bg-card flex items-center justify-center shadow-lg active:scale-95"
          aria-label="Open settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Focus Mode Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full"
      >
        <span className="text-lg">🎯</span>
        <span className="font-bold text-accent">Focus Mode</span>
      </motion.div>

      {/* Main Quest Card - One at a time */}
      <div className="relative w-full max-w-sm">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 bg-card rounded-full shadow-lg flex items-center justify-center active:scale-95"
          aria-label="Previous quest"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 bg-card rounded-full shadow-lg flex items-center justify-center active:scale-95"
          aria-label="Next quest"
        >
          <ChevronRight size={24} />
        </button>

        {/* Quest Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuest.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`${currentQuest.color} rounded-[40px] p-8 shadow-2xl text-center`}
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {currentQuest.emoji}
            </motion.div>
            
            <h1 className="text-3xl font-black text-primary-foreground mb-2">
              {currentQuest.name}
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8">
              {currentQuest.description}
            </p>

            {/* Big Play Button */}
            <motion.button
              onClick={handleStart}
              className="w-full py-6 bg-white/90 text-foreground font-black text-xl rounded-2xl shadow-lg flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={28} className="fill-current" />
              Start Quest
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quest Indicators */}
      <div className="flex gap-2 mt-8">
        {QUESTS.map((quest, index) => (
          <button
            key={quest.id}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-primary' 
                : 'w-3 bg-muted-foreground/30'
            }`}
            aria-label={`Go to ${quest.name}`}
          />
        ))}
      </div>

      {/* Encouragement Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-muted-foreground text-lg max-w-xs"
      >
        One quest at a time. You've got this! 💪
      </motion.p>
    </div>
  );
};
