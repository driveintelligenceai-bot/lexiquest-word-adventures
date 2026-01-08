// Streak tracking utilities

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  streakFreezeTokens: number;
  longestStreak: number;
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(dateStr: string): boolean {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate streak status and update if needed
 */
export function calculateStreak(data: StreakData): {
  newStreak: number;
  streakBroken: boolean;
  streakContinued: boolean;
  canUseFreeze: boolean;
} {
  const { currentStreak, lastActiveDate, streakFreezeTokens } = data;

  // If already active today, no change
  if (isToday(lastActiveDate)) {
    return {
      newStreak: currentStreak,
      streakBroken: false,
      streakContinued: false,
      canUseFreeze: false,
    };
  }

  // If last active was yesterday, continue streak
  if (isYesterday(lastActiveDate)) {
    return {
      newStreak: currentStreak + 1,
      streakBroken: false,
      streakContinued: true,
      canUseFreeze: false,
    };
  }

  // If never active or more than 1 day gap
  if (!lastActiveDate || !isYesterday(lastActiveDate)) {
    // Check if streak freeze can be used
    const daysSinceActive = lastActiveDate 
      ? Math.floor((Date.now() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Only allow freeze if missed exactly 1 day
    const canUseFreeze = daysSinceActive === 2 && streakFreezeTokens > 0 && currentStreak > 0;

    return {
      newStreak: canUseFreeze ? currentStreak : (lastActiveDate ? 1 : 0),
      streakBroken: !canUseFreeze && currentStreak > 0,
      streakContinued: false,
      canUseFreeze,
    };
  }

  // Starting fresh
  return {
    newStreak: 1,
    streakBroken: false,
    streakContinued: false,
    canUseFreeze: false,
  };
}

/**
 * Get streak milestone message
 */
export function getStreakMilestoneMessage(streak: number): string | null {
  const milestones: Record<number, string> = {
    3: "🔥 3 Day Streak! You're on fire!",
    7: "⚡ One Week Streak! Amazing!",
    14: "🌟 Two Week Champion!",
    30: "🏆 Monthly Master! Incredible!",
    50: "👑 50 Day Legend!",
    100: "💎 Century Streak! You're unstoppable!",
  };

  return milestones[streak] || null;
}

/**
 * Get XP bonus for streak
 */
export function getStreakXpBonus(streak: number): number {
  if (streak >= 30) return 15;
  if (streak >= 14) return 10;
  if (streak >= 7) return 5;
  if (streak >= 3) return 2;
  return 0;
}
