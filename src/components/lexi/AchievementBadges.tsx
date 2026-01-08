import React, { useState } from 'react';
import { X, Award, Lock, Star, Flame, Zap, Trophy, Target, Sparkles, Crown, Medal } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  requirement: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  totalXp: number;
  questsCompleted: number;
  streak: number;
  level: number;
  daysActive: number;
  ownedItems: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quest',
    name: 'First Steps',
    description: 'Complete your first quest',
    icon: Star,
    color: 'text-yellow-500',
    requirement: (s) => s.questsCompleted >= 1,
  },
  {
    id: 'xp_50',
    name: 'Rising Star',
    description: 'Earn 50 XP total',
    icon: Zap,
    color: 'text-blue-500',
    requirement: (s) => s.totalXp >= 50,
  },
  {
    id: 'xp_100',
    name: 'Century Club',
    description: 'Earn 100 XP total',
    icon: Trophy,
    color: 'text-amber-500',
    requirement: (s) => s.totalXp >= 100,
  },
  {
    id: 'xp_500',
    name: 'XP Master',
    description: 'Earn 500 XP total',
    icon: Crown,
    color: 'text-purple-500',
    requirement: (s) => s.totalXp >= 500,
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Reach a 3-day streak',
    icon: Flame,
    color: 'text-orange-500',
    requirement: (s) => s.streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Reach a 7-day streak',
    icon: Flame,
    color: 'text-red-500',
    requirement: (s) => s.streak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Unstoppable',
    description: 'Reach a 30-day streak',
    icon: Flame,
    color: 'text-pink-500',
    requirement: (s) => s.streak >= 30,
  },
  {
    id: 'level_5',
    name: 'Level Up!',
    description: 'Reach Level 5',
    icon: Target,
    color: 'text-green-500',
    requirement: (s) => s.level >= 5,
  },
  {
    id: 'level_10',
    name: 'Double Digits',
    description: 'Reach Level 10',
    icon: Medal,
    color: 'text-teal-500',
    requirement: (s) => s.level >= 10,
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Own 5 store items',
    icon: Sparkles,
    color: 'text-indigo-500',
    requirement: (s) => s.ownedItems >= 5,
  },
  {
    id: 'quests_10',
    name: 'Quest Hero',
    description: 'Complete 10 quests',
    icon: Award,
    color: 'text-cyan-500',
    requirement: (s) => s.questsCompleted >= 10,
  },
  {
    id: 'quests_50',
    name: 'Quest Legend',
    description: 'Complete 50 quests',
    icon: Award,
    color: 'text-rose-500',
    requirement: (s) => s.questsCompleted >= 50,
  },
];

interface AchievementBadgesProps {
  stats: AchievementStats;
  onClose: () => void;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ stats, onClose }) => {
  const unlockedCount = ACHIEVEMENTS.filter(a => a.requirement(stats)).length;

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="min-h-screen p-6 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <Award className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Achievements</h1>
              <div className="text-sm text-muted-foreground font-bold">
                {unlockedCount} / {ACHIEVEMENTS.length} unlocked
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors active:scale-95"
            aria-label="Close achievements"
          >
            <X size={22} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = achievement.requirement(stats);
            const Icon = achievement.icon;

            return (
              <div
                key={achievement.id}
                onClick={() => isUnlocked && sounds.tap()}
                className={`relative p-4 rounded-2xl text-center transition-all animate-fade-in ${
                  isUnlocked
                    ? 'bg-card border-2 border-primary/30 shadow-lg'
                    : 'bg-muted/50 border-2 border-border opacity-50'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Icon */}
                <div className={`mx-auto mb-2 ${isUnlocked ? achievement.color : 'text-muted-foreground'}`}>
                  {isUnlocked ? (
                    <Icon size={32} className="mx-auto" />
                  ) : (
                    <Lock size={32} className="mx-auto" />
                  )}
                </div>

                {/* Name */}
                <h3 className={`font-bold text-xs ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </h3>

                {/* Description */}
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  {achievement.description}
                </p>

                {/* Unlocked indicator */}
                {isUnlocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper to count completed quests from daily progress history
export function countCompletedQuests(dailyProgress: Record<string, boolean>): number {
  return Object.values(dailyProgress).filter(Boolean).length;
}
