import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Lock, Star, Flame, Zap, Trophy, Target, Sparkles, Crown, Medal, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  requirement: (stats: AchievementStats) => boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface AchievementStats {
  totalXp: number;
  questsCompleted: number;
  streak: number;
  longestStreak: number;
  level: number;
  daysActive: number;
  ownedItems: number;
  treasuresFound: number;
}

const ACHIEVEMENTS: Achievement[] = [
  // First Steps Tier
  {
    id: 'first_quest',
    name: 'First Steps',
    description: 'Complete your first quest',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    requirement: (s) => s.questsCompleted >= 1,
    tier: 'bronze',
  },
  {
    id: 'xp_50',
    name: 'Rising Star',
    description: 'Earn 50 XP total',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    requirement: (s) => s.totalXp >= 50,
    tier: 'bronze',
  },
  // Growth Tier
  {
    id: 'xp_100',
    name: 'Century Club',
    description: 'Earn 100 XP total',
    icon: Trophy,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20',
    requirement: (s) => s.totalXp >= 100,
    tier: 'silver',
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Reach a 3-day streak',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    requirement: (s) => s.streak >= 3,
    tier: 'silver',
  },
  {
    id: 'quests_10',
    name: 'Quest Hero',
    description: 'Complete 10 quests',
    icon: Award,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/20',
    requirement: (s) => s.questsCompleted >= 10,
    tier: 'silver',
  },
  // Master Tier
  {
    id: 'xp_500',
    name: 'XP Master',
    description: 'Earn 500 XP total',
    icon: Crown,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    requirement: (s) => s.totalXp >= 500,
    tier: 'gold',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Reach a 7-day streak',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    requirement: (s) => s.streak >= 7,
    tier: 'gold',
  },
  {
    id: 'level_5',
    name: 'Level Up!',
    description: 'Reach Level 5',
    icon: Target,
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    requirement: (s) => s.level >= 5,
    tier: 'gold',
  },
  {
    id: 'quests_25',
    name: 'Quest Master',
    description: 'Complete 25 quests',
    icon: Award,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/20',
    requirement: (s) => s.questsCompleted >= 25,
    tier: 'gold',
  },
  // Legend Tier
  {
    id: 'streak_30',
    name: 'Unstoppable',
    description: 'Reach a 30-day streak',
    icon: Flame,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/20',
    requirement: (s) => s.streak >= 30,
    tier: 'platinum',
  },
  {
    id: 'level_10',
    name: 'Double Digits',
    description: 'Reach Level 10',
    icon: Medal,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/20',
    requirement: (s) => s.level >= 10,
    tier: 'platinum',
  },
  {
    id: 'quests_50',
    name: 'Quest Legend',
    description: 'Complete 50 quests',
    icon: Award,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/20',
    requirement: (s) => s.questsCompleted >= 50,
    tier: 'platinum',
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Own 5 store items',
    icon: Sparkles,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/20',
    requirement: (s) => s.ownedItems >= 5,
    tier: 'gold',
  },
  {
    id: 'treasure_hunter',
    name: 'Treasure Hunter',
    description: 'Find 10 treasures',
    icon: Star,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/20',
    requirement: (s) => s.treasuresFound >= 10,
    tier: 'gold',
  },
  {
    id: 'xp_1000',
    name: 'Word Legend',
    description: 'Earn 1000 XP total',
    icon: Crown,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    requirement: (s) => s.totalXp >= 1000,
    tier: 'platinum',
  },
];

const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum'];
const TIER_COLORS = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-purple-400 to-pink-500',
};

interface TrophyCollectionProps {
  stats: AchievementStats;
  unlockedAchievements: string[];
  onClose: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
}

export const TrophyCollection: React.FC<TrophyCollectionProps> = ({ 
  stats, 
  unlockedAchievements,
  onClose, 
  onToggleSound,
  soundEnabled,
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showingBadge, setShowingBadge] = useState<Achievement | null>(null);

  const unlockedCount = ACHIEVEMENTS.filter(a => a.requirement(stats)).length;
  
  // Group achievements by tier
  const byTier = TIER_ORDER.reduce((acc, tier) => {
    acc[tier] = ACHIEVEMENTS.filter(a => a.tier === tier);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const handleBadgeClick = (achievement: Achievement, isUnlocked: boolean) => {
    if (isUnlocked) {
      sounds.pop();
      setShowingBadge(achievement);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-sm overflow-y-auto safe-area-inset">
      {/* Badge Detail Modal */}
      <AnimatePresence>
        {showingBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-foreground/50 flex items-center justify-center p-6"
            onClick={() => setShowingBadge(null)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-card p-8 rounded-3xl text-center max-w-xs shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className={`w-24 h-24 mx-auto mb-4 rounded-2xl ${showingBadge.bgColor} flex items-center justify-center`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <showingBadge.icon size={48} className={showingBadge.color} />
              </motion.div>
              <h3 className="text-2xl font-black text-foreground mb-2">{showingBadge.name}</h3>
              <p className="text-muted-foreground mb-4">{showingBadge.description}</p>
              <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${TIER_COLORS[showingBadge.tier]} text-white font-bold text-sm uppercase`}>
                {showingBadge.tier}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen p-6 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-3 bg-primary/20 rounded-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Trophy className="text-primary" size={28} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Trophy Room</h1>
              <div className="text-sm text-muted-foreground font-bold">
                {unlockedCount} / {ACHIEVEMENTS.length} unlocked
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleSound}
              className="h-12 w-12 rounded-full bg-muted flex items-center justify-center active:scale-95 transition-transform"
              aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={onClose}
              className="h-12 w-12 rounded-full bg-muted flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-muted-foreground">
            <span>Beginner</span>
            <span>Word Legend</span>
          </div>
        </div>

        {/* Tier Sections */}
        {TIER_ORDER.map((tier, tierIndex) => {
          const tierAchievements = byTier[tier];
          const tierUnlocked = tierAchievements.filter(a => a.requirement(stats)).length;
          
          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tierIndex * 0.1 }}
              className="mb-6"
            >
              {/* Tier Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${TIER_COLORS[tier]}`} />
                <span className={`font-black uppercase text-sm bg-gradient-to-r ${TIER_COLORS[tier]} bg-clip-text text-transparent`}>
                  {tier} ({tierUnlocked}/{tierAchievements.length})
                </span>
                <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${TIER_COLORS[tier]}`} />
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-3 gap-3">
                {tierAchievements.map((achievement, index) => {
                  const isUnlocked = achievement.requirement(stats);
                  const isNew = isUnlocked && !unlockedAchievements.includes(achievement.id);
                  const Icon = achievement.icon;

                  return (
                    <motion.button
                      key={achievement.id}
                      onClick={() => handleBadgeClick(achievement, isUnlocked)}
                      className={`relative p-4 rounded-2xl text-center transition-all ${
                        isUnlocked
                          ? `${achievement.bgColor} border-2 border-current shadow-lg`
                          : 'bg-muted/50 border-2 border-border opacity-40'
                      }`}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: tierIndex * 0.1 + index * 0.05, type: 'spring' }}
                      whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                    >
                      {/* New badge indicator */}
                      {isNew && (
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <span className="text-xs font-bold text-white">!</span>
                        </motion.div>
                      )}

                      {/* Icon */}
                      <motion.div 
                        className={`mx-auto mb-2 ${isUnlocked ? achievement.color : 'text-muted-foreground'}`}
                        animate={isUnlocked ? { y: [0, -3, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                      >
                        {isUnlocked ? (
                          <Icon size={28} className="mx-auto" />
                        ) : (
                          <Lock size={28} className="mx-auto" />
                        )}
                      </motion.div>

                      {/* Name */}
                      <h3 className={`font-bold text-xs leading-tight ${
                        isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </h3>

                      {/* Unlocked checkmark */}
                      {isUnlocked && (
                        <motion.div
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-welded-border rounded-full flex items-center justify-center shadow-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: 'spring' }}
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Fun Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card p-6 rounded-2xl border-2 border-border mt-6"
        >
          <h2 className="font-bold text-foreground mb-4 text-center">Your Stats</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-primary">{stats.totalXp}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
            <div>
              <div className="text-2xl font-black text-accent">{stats.questsCompleted}</div>
              <div className="text-xs text-muted-foreground">Quests Done</div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-500">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-500">{stats.level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Export for checking new achievements
export { ACHIEVEMENTS };

// Utility to check for newly unlocked achievements
export function checkNewAchievements(
  stats: AchievementStats,
  previouslyUnlocked: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(a => 
    a.requirement(stats) && !previouslyUnlocked.includes(a.id)
  );
}