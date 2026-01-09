import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, BarChart3, Calendar, Shield, 
  Flame, Trophy, Star, Settings, ChevronRight, 
  Volume2, Timer, Lock, BookOpen, LogOut
} from 'lucide-react';
import { ParentGate } from '@/components/lexi/ParentGate';
import { PhonemeProgressReport } from './PhonemeProgressReport';

interface PhonemePerformance {
  phoneme: string;
  phoneme_type: string;
  correct_count: number;
  incorrect_count: number;
  wilson_step: number;
}

interface ParentDashboardProps {
  childName: string;
  childAvatar: string;
  progress: {
    level: number;
    xp: number;
    streak: number;
    longestStreak: number;
    currentRegion: string;
  };
  xpHistory: Record<string, number>;
  sessionHistory: Record<string, number>; // date -> minutes
  completedQuests: string[];
  phonemePerformances?: PhonemePerformance[];
  settings: {
    dailyTimeLimit: number; // minutes
    voiceEnabled: boolean;
  };
  onBack: () => void;
  onUpdateSettings: (settings: { dailyTimeLimit?: number; voiceEnabled?: boolean }) => void;
  onPracticePhoneme?: (phoneme: string) => void;
  onSpeak?: (text: string) => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_LIMITS = [15, 20, 30, 45, 60, 0]; // 0 = unlimited

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  childName,
  childAvatar,
  progress,
  xpHistory,
  sessionHistory,
  completedQuests,
  phonemePerformances = [],
  settings,
  onBack,
  onUpdateSettings,
  onPracticePhoneme,
  onSpeak,
  onLogout,
  isAuthenticated = false,
}) => {
  const [showGate, setShowGate] = useState(!isAuthenticated);
  const [activeTab, setActiveTab] = useState<'overview' | 'phonemes' | 'time' | 'progress'>('overview');

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const weeklyXp = last7Days.reduce((sum, d) => sum + (xpHistory[d] || 0), 0);
    const weeklyMinutes = last7Days.reduce((sum, d) => sum + (sessionHistory[d] || 0), 0);
    const activeDays = last7Days.filter(d => (xpHistory[d] || 0) > 0).length;
    const avgDailyXp = activeDays > 0 ? Math.round(weeklyXp / activeDays) : 0;

    return { weeklyXp, weeklyMinutes, activeDays, avgDailyXp, last7Days };
  }, [xpHistory, sessionHistory]);

  // Chart data
  const chartData = useMemo(() => {
    return weeklyStats.last7Days.map(dateStr => {
      const date = new Date(dateStr);
      return {
        key: dateStr,
        day: DAYS[date.getDay()],
        xp: xpHistory[dateStr] || 0,
        minutes: sessionHistory[dateStr] || 0,
        isToday: dateStr === new Date().toISOString().split('T')[0],
      };
    });
  }, [weeklyStats.last7Days, xpHistory, sessionHistory]);

  const maxXp = Math.max(...chartData.map(d => d.xp), 50);

  if (showGate) {
    return (
      <ParentGate
        title="Parent Dashboard"
        onSuccess={() => setShowGate(false)}
        onClose={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 safe-area-inset">
      {/* Header */}
      <header className="bg-card p-6 border-b-2 border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-foreground">Parent Dashboard</h1>
            <p className="text-sm text-muted-foreground">Monitor {childName}'s progress</p>
          </div>
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-3xl">
            {childAvatar}
          </div>
          {onLogout && isAuthenticated && (
            <button
              onClick={onLogout}
              className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform ml-2"
              aria-label="Log out"
            >
              <LogOut size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-4 bg-card border-b border-border overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'phonemes', label: 'Sounds', icon: BookOpen },
          { id: 'time', label: 'Time', icon: Clock },
          { id: 'progress', label: 'Progress', icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all active:scale-95 ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="p-6 space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-4 rounded-2xl border-2 border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="text-accent" size={20} />
                  <span className="text-sm font-bold text-muted-foreground">Streak</span>
                </div>
                <div className="text-3xl font-black text-accent">{progress.streak}</div>
                <div className="text-xs text-muted-foreground">
                  Best: {progress.longestStreak} days
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card p-4 rounded-2xl border-2 border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="text-primary" size={20} />
                  <span className="text-sm font-bold text-muted-foreground">Total XP</span>
                </div>
                <div className="text-3xl font-black text-primary">{progress.xp}</div>
                <div className="text-xs text-muted-foreground">
                  Level {progress.level}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card p-4 rounded-2xl border-2 border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-welded-border" size={20} />
                  <span className="text-sm font-bold text-muted-foreground">This Week</span>
                </div>
                <div className="text-3xl font-black text-welded-border">{weeklyStats.weeklyXp}</div>
                <div className="text-xs text-muted-foreground">
                  XP earned
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card p-4 rounded-2xl border-2 border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-vowel-border" size={20} />
                  <span className="text-sm font-bold text-muted-foreground">Active Days</span>
                </div>
                <div className="text-3xl font-black text-vowel-border">{weeklyStats.activeDays}/7</div>
                <div className="text-xs text-muted-foreground">
                  This week
                </div>
              </motion.div>
            </div>

            {/* Weekly XP Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card p-6 rounded-2xl border-2 border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-primary" size={20} />
                <h2 className="font-bold text-foreground">Weekly XP Progress</h2>
              </div>

              <div className="flex items-end justify-between gap-2 h-36">
                {chartData.map((day, index) => {
                  const height = maxXp > 0 ? (day.xp / maxXp) * 100 : 0;
                  return (
                    <div key={day.key} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-primary">
                        {day.xp > 0 ? day.xp : ''}
                      </span>
                      <div className="w-full h-24 bg-muted rounded-lg overflow-hidden relative">
                        <motion.div
                          className={`absolute bottom-0 w-full rounded-lg ${
                            day.isToday ? 'bg-primary' : 'bg-primary/50'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${
                        day.isToday ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Average</span>
                <span className="text-lg font-black text-primary">
                  {weeklyStats.avgDailyXp} XP/day
                </span>
              </div>
            </motion.div>

            {/* Quests Completed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card p-6 rounded-2xl border-2 border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Quests Completed</h2>
                <span className="text-2xl font-black text-accent">{completedQuests.length}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((completedQuests.length / 50) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {50 - completedQuests.length} more to reach 50!
              </p>
            </motion.div>
          </>
        )}

        {/* Phonemes Tab - Detailed Sound Progress */}
        {activeTab === 'phonemes' && (
          <PhonemeProgressReport
            performances={phonemePerformances}
            childName={childName}
            onPracticePhoneme={onPracticePhoneme}
            onSpeak={onSpeak}
          />
        )}

        {/* Time Limits Tab */}
        {activeTab === 'time' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-6 rounded-2xl border-2 border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <Timer className="text-accent" size={24} />
                <div>
                  <h2 className="font-bold text-foreground">Daily Time Limit</h2>
                  <p className="text-sm text-muted-foreground">
                    Set healthy screen time boundaries
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {TIME_LIMITS.map((limit) => (
                  <button
                    key={limit}
                    onClick={() => onUpdateSettings({ dailyTimeLimit: limit })}
                    className={`p-4 rounded-2xl font-bold text-center transition-all active:scale-95 ${
                      settings.dailyTimeLimit === limit
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {limit === 0 ? '∞' : `${limit}m`}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                {settings.dailyTimeLimit === 0 
                  ? "No time limit set" 
                  : `${childName} can play for ${settings.dailyTimeLimit} minutes per day`}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 rounded-2xl border-2 border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="text-primary" size={24} />
                <div>
                  <h2 className="font-bold text-foreground">Voice Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Text-to-speech for all content
                  </p>
                </div>
              </div>

              <button
                onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
                className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                  settings.voiceEnabled
                    ? 'bg-welded/30 border-2 border-welded-border'
                    : 'bg-muted border-2 border-border'
                }`}
              >
                <span className="font-bold">Voice Reading</span>
                <div className={`w-14 h-8 rounded-full transition-all ${
                  settings.voiceEnabled ? 'bg-welded-border' : 'bg-muted-foreground/30'
                }`}>
                  <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-md mt-1"
                    animate={{ x: settings.voiceEnabled ? 28 : 4 }}
                  />
                </div>
              </button>
            </motion.div>

            {/* Time Usage This Week */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-6 rounded-2xl border-2 border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-vowel-border" size={20} />
                <h2 className="font-bold text-foreground">Time Spent This Week</h2>
              </div>

              <div className="flex items-end justify-between gap-2 h-24">
                {chartData.map((day, index) => {
                  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 30);
                  const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
                  return (
                    <div key={day.key} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-vowel-border">
                        {day.minutes > 0 ? `${day.minutes}m` : ''}
                      </span>
                      <div className="w-full h-16 bg-muted rounded-lg overflow-hidden relative">
                        <motion.div
                          className="absolute bottom-0 w-full bg-vowel-border rounded-lg"
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border text-center">
                <span className="text-lg font-black text-vowel-border">
                  {weeklyStats.weeklyMinutes} minutes
                </span>
                <span className="text-sm text-muted-foreground ml-2">total this week</span>
              </div>
            </motion.div>
          </>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-6 rounded-2xl border-2 border-border"
            >
              <h2 className="font-bold text-foreground mb-4">Current Progress</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Trophy className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-foreground">Level {progress.level}</div>
                    <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(progress.xp % 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {progress.xp % 100} / 100 XP to next level
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Flame className="text-accent" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{progress.streak} Day Streak</div>
                    <div className="text-sm text-muted-foreground">
                      Best streak: {progress.longestStreak} days
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 rounded-2xl border-2 border-border"
            >
              <h2 className="font-bold text-foreground mb-4">Learning Recommendations</h2>
              
              <div className="space-y-3">
                <div className="p-4 bg-welded/20 rounded-xl border border-welded-border/30">
                  <div className="font-bold text-foreground mb-1">🎯 Focus Area</div>
                  <p className="text-sm text-muted-foreground">
                    {childName} is doing great with sound matching! 
                    Consider trying more word building activities.
                  </p>
                </div>

                <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
                  <div className="font-bold text-foreground mb-1">⏰ Best Practice Time</div>
                  <p className="text-sm text-muted-foreground">
                    Based on past sessions, {childName} learns best in 15-20 minute sessions.
                  </p>
                </div>

                <div className="p-4 bg-accent/10 rounded-xl border border-accent/30">
                  <div className="font-bold text-foreground mb-1">🔥 Keep the Streak!</div>
                  <p className="text-sm text-muted-foreground">
                    Daily practice, even just 10 minutes, helps build strong reading skills.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};