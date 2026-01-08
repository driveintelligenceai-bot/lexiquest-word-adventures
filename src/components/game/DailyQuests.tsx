import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, CheckCircle, Clock, Zap } from 'lucide-react';

export interface DailyQuest {
  id: string;
  type: 'sound' | 'word' | 'rhyme' | 'memory' | 'syllable';
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  estimatedMinutes: number;
}

interface DailyQuestsProps {
  quests: DailyQuest[];
  streakBonus: number;
  onStartQuest: (quest: DailyQuest) => void;
}

const QUEST_COLORS: Record<DailyQuest['type'], { bg: string; border: string; text: string }> = {
  sound: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary' },
  word: { bg: 'bg-consonant', border: 'border-consonant-border', text: 'text-consonant-text' },
  rhyme: { bg: 'bg-vowel', border: 'border-vowel-border', text: 'text-vowel-text' },
  memory: { bg: 'bg-digraph', border: 'border-digraph-border', text: 'text-digraph-text' },
  syllable: { bg: 'bg-welded', border: 'border-welded-border', text: 'text-welded-text' },
};

export const DailyQuests: React.FC<DailyQuestsProps> = ({
  quests,
  streakBonus,
  onStartQuest,
}) => {
  const completedCount = quests.filter(q => q.isCompleted).length;
  const allComplete = completedCount === quests.length;

  return (
    <div className="space-y-4">
      {/* Daily Progress Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">Today's Quests</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {quests.map((q, i) => (
              <motion.div
                key={q.id}
                className={`w-4 h-4 rounded-full border-2 -ml-1 first:ml-0 ${
                  q.isCompleted 
                    ? 'bg-primary border-primary' 
                    : 'bg-muted border-border'
                }`}
                initial={false}
                animate={q.isCompleted ? { scale: [1, 1.2, 1] } : {}}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            {completedCount}/{quests.length}
          </span>
        </div>
      </div>

      {/* Streak Bonus Banner */}
      {streakBonus > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-accent/10 rounded-xl border-2 border-accent/20"
        >
          <Zap className="text-accent fill-accent" size={20} />
          <span className="text-sm font-bold text-accent">
            +{streakBonus} XP streak bonus on every quest!
          </span>
        </motion.div>
      )}

      {/* Quest List */}
      <div className="space-y-3">
        {quests.map((quest, index) => {
          const colors = QUEST_COLORS[quest.type];
          
          return (
            <motion.button
              key={quest.id}
              onClick={() => !quest.isLocked && !quest.isCompleted && onStartQuest(quest)}
              disabled={quest.isLocked || quest.isCompleted}
              className={`w-full p-4 rounded-2xl border-4 transition-all flex items-center gap-4 ${
                quest.isCompleted
                  ? 'bg-muted border-border opacity-60'
                  : quest.isLocked
                    ? 'bg-muted border-border opacity-40 cursor-not-allowed'
                    : `${colors.bg} ${colors.border} hover:scale-[1.02] active:scale-[0.98]`
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Quest Icon */}
              <div className={`text-4xl ${quest.isCompleted ? 'grayscale' : ''}`}>
                {quest.isCompleted ? '✅' : quest.isLocked ? '🔒' : quest.emoji}
              </div>

              {/* Quest Info */}
              <div className="flex-1 text-left">
                <div className={`font-bold ${quest.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {quest.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {quest.description}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs">
                    <Clock size={12} />
                    {quest.estimatedMinutes} min
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-bold ${colors.text}`}>
                    <Star size={12} className="fill-current" />
                    +{quest.xpReward + streakBonus} XP
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                {quest.isCompleted ? (
                  <CheckCircle className="text-primary" size={24} />
                ) : quest.isLocked ? (
                  <Lock className="text-muted-foreground" size={24} />
                ) : (
                  <motion.div
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-primary-foreground font-bold">GO</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* All Complete Celebration */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-welded/30 rounded-2xl border-4 border-welded-border"
        >
          <div className="text-5xl mb-2">🏆</div>
          <h3 className="text-xl font-black text-welded-text">Daily Champion!</h3>
          <p className="text-sm text-welded-text/70 mt-1">
            You completed all quests today! Come back tomorrow for more!
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Generate daily quests based on user's progress
export function generateDailyQuests(
  wilsonStep: number,
  ageGroup: 'young' | 'older',
  completedToday: string[]
): DailyQuest[] {
  const baseQuests: Omit<DailyQuest, 'isCompleted' | 'isLocked'>[] = [
    {
      id: 'daily_sound',
      type: 'sound',
      title: 'Sound Safari',
      description: 'Match sounds to letters',
      emoji: '🔊',
      xpReward: 50,
      estimatedMinutes: 3,
    },
    {
      id: 'daily_word',
      type: 'word',
      title: 'Word Builder',
      description: 'Build words from tiles',
      emoji: '🔤',
      xpReward: 60,
      estimatedMinutes: 4,
    },
    {
      id: 'daily_rhyme',
      type: 'rhyme',
      title: 'Rhyme River',
      description: 'Find rhyming pairs',
      emoji: '🎵',
      xpReward: 55,
      estimatedMinutes: 3,
    },
  ];

  // Add harder quests for older kids
  if (ageGroup === 'older') {
    baseQuests.push({
      id: 'daily_memory',
      type: 'memory',
      title: 'Memory Match',
      description: 'Match word pairs',
      emoji: '🧠',
      xpReward: 65,
      estimatedMinutes: 5,
    });
    baseQuests.push({
      id: 'daily_syllable',
      type: 'syllable',
      title: 'Syllable Sorter',
      description: 'Sort by syllable count',
      emoji: '👏',
      xpReward: 70,
      estimatedMinutes: 4,
    });
  }

  return baseQuests.map((quest, index) => ({
    ...quest,
    isCompleted: completedToday.includes(quest.id),
    isLocked: index > 0 && !completedToday.includes(baseQuests[index - 1].id) && index > completedToday.length,
  }));
}
