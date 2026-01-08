// Utility for detecting new day and managing daily resets

export const getDateKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const isNewDay = (lastDateKey: string | null): boolean => {
  if (!lastDateKey) return true;
  return getDateKey() !== lastDateKey;
};

export interface DailyState {
  lastActiveDate: string;
  dailyProgress: Record<string, boolean>;
  streak: number;
  wasAllCompleteYesterday: boolean;
}

export const checkAndResetDaily = (
  currentState: DailyState,
  defaultProgress: Record<string, boolean>
): DailyState => {
  const today = getDateKey();
  
  // Same day - no reset needed
  if (currentState.lastActiveDate === today) {
    return currentState;
  }

  // Calculate if yesterday was fully complete
  const allCompleteToday = Object.values(currentState.dailyProgress).every(Boolean);
  
  // It's a new day - check streak logic
  const yesterday = getYesterday();
  const wasYesterday = currentState.lastActiveDate === yesterday;
  
  let newStreak = currentState.streak;
  
  if (wasYesterday && allCompleteToday) {
    // Completed yesterday, keep streak
    newStreak = currentState.streak;
  } else if (!wasYesterday && currentState.lastActiveDate !== '') {
    // Missed a day - check if we should reset streak
    // Only reset if they didn't complete all quests
    if (!allCompleteToday) {
      newStreak = 0;
    }
  }

  return {
    lastActiveDate: today,
    dailyProgress: { ...defaultProgress },
    streak: newStreak,
    wasAllCompleteYesterday: allCompleteToday,
  };
};

const getYesterday = (): string => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
