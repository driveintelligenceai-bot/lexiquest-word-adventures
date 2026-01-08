import React from 'react';
import { Flame, Trophy, Settings, School, Home, Volume2, Eye, ShoppingBag } from 'lucide-react';
import { QuestCard, Quest } from './QuestCard';
import { speak } from '@/lib/speech';
import { sounds } from '@/lib/sounds';

interface StudentData {
  name: string;
  avatar: string;
  step: string;
  level: number;
  xp: number;
  dailyGoal: number;
}

interface StudentDashboardProps {
  student: StudentData;
  streak: number;
  dailyProgress: Record<string, boolean>;
  quests: Quest[];
  activePet?: string;
  onQuestSelect: (quest: Quest) => void;
  onSettingsClick: () => void;
  onAccessibilityClick: () => void;
  onStoreClick: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  streak,
  dailyProgress,
  quests,
  activePet,
  onQuestSelect,
  onSettingsClick,
  onAccessibilityClick,
  onStoreClick,
}) => {
  const tutorQuests = quests.filter(q => q.role === 'tutor');
  const homeQuests = quests.filter(q => q.role === 'home');
  
  // Calculate daily XP progress
  const todayXp = quests
    .filter(q => dailyProgress[q.id])
    .reduce((sum, q) => sum + q.points, 0);
  const goalProgress = Math.min((todayXp / student.dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-background font-sans pb-32">
      {/* Header */}
      <header className="bg-card p-6 rounded-b-[40px] shadow-sm border-b-4 border-border sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center text-4xl shadow-sm border-2 border-accent/20 animate-bounce-slow">
              {student.avatar || '🦊'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-foreground">{student.name}</h1>
                <button
                  onClick={() => speak(`Hello ${student.name}!`)}
                  className="icon-btn h-8 w-8"
                  aria-label="Hear greeting"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block mt-1">
                Step {student.step}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onAccessibilityClick}
              className="h-12 w-12 inline-flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors active:scale-95"
              aria-label="Accessibility settings"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={onSettingsClick}
              className="h-12 w-12 inline-flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors active:scale-95"
              aria-label="Open tutor access"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="bg-foreground/5 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-muted-foreground">Today's Goal</span>
            <span className="text-sm font-black text-primary">{todayXp} / {student.dailyGoal} XP</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          {goalProgress >= 100 && (
            <div className="text-center text-sm font-bold text-primary mt-2 animate-fade-in">
              🎉 Goal Complete!
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex gap-3">
          <div className="flex-1 bg-accent/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-accent/20">
            <div className="bg-card p-2 rounded-xl shadow-sm">
              <Flame className="text-accent fill-accent" size={20} />
            </div>
            <div>
              <div className="text-xl font-black text-accent">{streak}</div>
              <div className="text-[10px] font-bold text-accent/70 uppercase">Streak</div>
            </div>
          </div>
          <button
            onClick={() => { sounds.tap(); onStoreClick(); }}
            className="flex-1 bg-primary/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-primary/20 hover:bg-primary/20 transition-colors active:scale-95"
          >
            <div className="bg-card p-2 rounded-xl shadow-sm">
              <ShoppingBag className="text-primary" size={20} />
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-foreground">{student.xp}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Store</div>
            </div>
          </button>
        </div>
      </header>

      {/* Quest Lists */}
      <main className="p-6 space-y-8 max-w-md mx-auto">
        {/* Morning Section */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4 pl-2">
            <div className="p-1.5 bg-consonant rounded-lg">
              <School size={16} className="text-consonant-text" />
            </div>
            <h3 className="font-black text-muted-foreground uppercase tracking-widest text-xs">
              Morning (With Tutor)
            </h3>
            <button
              onClick={() => speak('Morning quests with your tutor')}
              className="icon-btn h-8 w-8"
              aria-label="Hear morning section"
            >
              <Volume2 size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {tutorQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isDone={dailyProgress[quest.id]}
                onClick={() => onQuestSelect(quest)}
              />
            ))}
          </div>
        </section>

        {/* Evening Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4 pl-2">
            <div className="p-1.5 bg-vowel rounded-lg">
              <Home size={16} className="text-vowel-text" />
            </div>
            <h3 className="font-black text-muted-foreground uppercase tracking-widest text-xs">
              Evening (With Parent)
            </h3>
            <button
              onClick={() => speak('Evening quests with your parent')}
              className="icon-btn h-8 w-8"
              aria-label="Hear evening section"
            >
              <Volume2 size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {homeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isDone={dailyProgress[quest.id]}
                onClick={() => onQuestSelect(quest)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
