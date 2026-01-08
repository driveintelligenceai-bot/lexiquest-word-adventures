import React, { useState, useMemo } from 'react';
import { X, Gift, Calendar, Star, Flame, Check, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { getDateKey } from '@/lib/dayUtils';

// Define daily rewards for a 7-day cycle
const DAILY_REWARDS = [
  { day: 1, xp: 25, icon: '⭐', label: 'Day 1', special: false },
  { day: 2, xp: 35, icon: '🌟', label: 'Day 2', special: false },
  { day: 3, xp: 50, icon: '💎', label: 'Day 3', special: false },
  { day: 4, xp: 60, icon: '🎯', label: 'Day 4', special: false },
  { day: 5, xp: 75, icon: '🏆', label: 'Day 5', special: false },
  { day: 6, xp: 100, icon: '🔥', label: 'Day 6', special: false },
  { day: 7, xp: 200, icon: '👑', label: 'Week Complete!', special: true, bonus: 'streak_freeze' },
];

// Weekly milestones with special rewards
const WEEKLY_MILESTONES = [
  { week: 1, reward: 'crown', label: 'First Week Champion!', icon: '👑' },
  { week: 2, reward: 'pet_dragon', label: 'Two Week Warrior!', icon: '🐉' },
  { week: 4, reward: 'theme_galaxy', label: 'Monthly Master!', icon: '🌌' },
];

export interface LoginRewardsState {
  lastClaimDate: string;
  consecutiveDays: number;
  totalWeeksCompleted: number;
  claimedToday: boolean;
}

interface DailyLoginRewardsProps {
  loginState: LoginRewardsState;
  currentXp: number;
  onClose: () => void;
  onClaimReward: (xp: number, bonusItem?: string) => void;
  onUpdateLoginState: (state: LoginRewardsState) => void;
  soundEnabled?: boolean;
}

export const DailyLoginRewards: React.FC<DailyLoginRewardsProps> = ({
  loginState,
  currentXp,
  onClose,
  onClaimReward,
  onUpdateLoginState,
  soundEnabled = true,
}) => {
  const [claiming, setClaiming] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const today = getDateKey();
  const canClaim = loginState.lastClaimDate !== today;
  
  // Calculate current day in the 7-day cycle (1-7)
  const currentDayInCycle = ((loginState.consecutiveDays) % 7) + 1;
  
  // Check if this is a new streak or continuing
  const isNewStreak = useMemo(() => {
    if (!loginState.lastClaimDate) return true;
    const lastDate = new Date(loginState.lastClaimDate);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 1;
  }, [loginState.lastClaimDate, today]);

  const effectiveDay = isNewStreak && canClaim ? 1 : currentDayInCycle;
  const todayReward = DAILY_REWARDS[effectiveDay - 1];

  // Check for weekly milestone
  const weeklyMilestone = useMemo(() => {
    const weeksAfterClaim = loginState.totalWeeksCompleted + (effectiveDay === 7 && canClaim ? 1 : 0);
    return WEEKLY_MILESTONES.find(m => m.week === weeksAfterClaim);
  }, [loginState.totalWeeksCompleted, effectiveDay, canClaim]);

  const handleClaim = () => {
    if (!canClaim || claiming) return;
    
    setClaiming(true);
    if (soundEnabled) sounds.treasure();
    
    setTimeout(() => {
      const newConsecutiveDays = isNewStreak ? 1 : loginState.consecutiveDays + 1;
      const completedWeek = newConsecutiveDays % 7 === 0;
      
      // Update login state
      onUpdateLoginState({
        lastClaimDate: today,
        consecutiveDays: newConsecutiveDays,
        totalWeeksCompleted: loginState.totalWeeksCompleted + (completedWeek ? 1 : 0),
        claimedToday: true,
      });
      
      // Give rewards
      onClaimReward(todayReward.xp, todayReward.bonus);
      
      setClaiming(false);
      setShowCelebration(true);
      
      setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="min-h-screen p-6 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <Calendar className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Daily Rewards</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flame className="text-accent" size={16} />
                <span>{loginState.consecutiveDays} day streak</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors active:scale-95"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Claim Button / Today's Reward */}
        <div className="max-w-md mx-auto mb-8">
          <motion.div
            className={`relative rounded-3xl p-6 text-center border-2 ${
              canClaim 
                ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg'
                : 'bg-card border-border'
            }`}
            animate={canClaim && !claiming ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {canClaim && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold">
                Ready to Claim!
              </div>
            )}
            
            <div className="text-6xl mb-3">
              {claiming ? '🎉' : todayReward.icon}
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-2">
              {todayReward.special ? todayReward.label : `Day ${effectiveDay} Reward`}
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-2xl font-black text-primary mb-4">
              <Star className="fill-primary" size={24} />
              +{todayReward.xp} XP
            </div>
            
            {todayReward.special && todayReward.bonus && (
              <div className="text-sm text-accent font-bold mb-4 flex items-center justify-center gap-2">
                <Sparkles size={16} />
                + Bonus Streak Freeze Token!
              </div>
            )}
            
            <button
              onClick={handleClaim}
              disabled={!canClaim || claiming}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                canClaim
                  ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {claiming ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Gift size={24} />
                  </motion.div>
                  Claiming...
                </>
              ) : canClaim ? (
                <>
                  <Gift size={24} />
                  Claim Reward!
                </>
              ) : (
                <>
                  <Check size={24} />
                  Claimed Today!
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* 7-Day Calendar */}
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Weekly Calendar
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {DAILY_REWARDS.map((reward, index) => {
              const dayNumber = index + 1;
              const isPast = dayNumber < effectiveDay || (dayNumber === effectiveDay && !canClaim);
              const isCurrent = dayNumber === effectiveDay && canClaim;
              const isFuture = dayNumber > effectiveDay || (dayNumber === effectiveDay && !canClaim && dayNumber !== effectiveDay);
              
              return (
                <motion.div
                  key={dayNumber}
                  className={`relative rounded-2xl p-3 text-center border-2 transition-all ${
                    isCurrent
                      ? 'bg-primary/20 border-primary shadow-lg scale-105'
                      : isPast
                      ? 'bg-accent/10 border-accent/50'
                      : 'bg-card border-border opacity-60'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Day number */}
                  <div className="text-xs font-bold text-muted-foreground mb-1">
                    D{dayNumber}
                  </div>
                  
                  {/* Icon */}
                  <div className={`text-2xl mb-1 ${isPast ? 'grayscale-0' : isFuture ? 'grayscale opacity-50' : ''}`}>
                    {isPast ? '✅' : reward.icon}
                  </div>
                  
                  {/* XP */}
                  <div className={`text-xs font-bold ${isPast ? 'text-accent' : 'text-muted-foreground'}`}>
                    +{reward.xp}
                  </div>
                  
                  {/* Current indicator */}
                  {isCurrent && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                  
                  {/* Special day badge */}
                  {reward.special && (
                    <div className="absolute -top-2 -right-2 text-sm">
                      👑
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Milestones */}
        <div className="max-w-md mx-auto mt-8">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Star size={20} />
            Weekly Milestones
          </h3>
          
          <div className="space-y-3">
            {WEEKLY_MILESTONES.map((milestone, index) => {
              const achieved = loginState.totalWeeksCompleted >= milestone.week;
              
              return (
                <motion.div
                  key={milestone.week}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    achieved
                      ? 'bg-accent/10 border-accent/50'
                      : 'bg-card border-border opacity-60'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className={`text-3xl ${!achieved ? 'grayscale opacity-50' : ''}`}>
                    {milestone.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-foreground">
                      {milestone.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Complete {milestone.week} week{milestone.week > 1 ? 's' : ''} of daily logins
                    </div>
                  </div>
                  {achieved ? (
                    <Check className="text-accent" size={24} />
                  ) : (
                    <Lock className="text-muted-foreground" size={20} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <div className="text-8xl mb-4">🎉</div>
                <div className="text-3xl font-black text-primary">
                  +{todayReward.xp} XP!
                </div>
              </motion.div>
              
              {/* Confetti particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                >
                  {['⭐', '✨', '🌟', '💫'][i % 4]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyLoginRewards;
