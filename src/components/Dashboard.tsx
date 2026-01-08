import React from 'react';
import { Flame, Star, School, Home } from 'lucide-react';
import { QuestCard, Quest } from './QuestCard';
import { AudioButton } from './AudioButton';

interface DashboardProps {
  studentName: string;
  step: string;
  streak: number;
  points: number;
  dailyQuests: Record<string, boolean>;
  quests: Quest[];
  onQuestSelect: (quest: Quest) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  studentName,
  step,
  streak,
  points,
  dailyQuests,
  quests,
  onQuestSelect,
}) => {
  const tutorQuests = quests.filter(q => q.role === 'tutor');
  const homeQuests = quests.filter(q => q.role === 'home');
  const allComplete = Object.values(dailyQuests).every(Boolean);

  return (
    <div className="min-h-screen bg-background font-sans pb-safe">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-card border-b-4 border-border sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-3xl border-4 border-card shadow-sm">
            🦊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-foreground text-lg">{studentName}</h1>
              <AudioButton text={`Hello ${studentName}`} size={16} />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Wilson Step {step}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-1 bg-accent/10 px-3 py-2 rounded-2xl border-2 border-accent/20">
            <Flame size={20} className="text-accent fill-accent" />
            <span className="font-black text-accent text-lg">{streak}</span>
          </div>
        </div>
      </header>

      <main className="p-6 pb-32 max-w-lg mx-auto space-y-8">
        {/* Daily Goal Card */}
        <div className="bg-foreground rounded-[32px] p-8 text-background shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold opacity-90">Daily Goal</h2>
                  <AudioButton text="Get 10 points to win today!" size={18} className="bg-background/10 text-background hover:bg-background/20" />
                </div>
                <p className="opacity-60">Get 10 points to win!</p>
              </div>
              <div className="bg-background/10 p-2 rounded-xl">
                <Star className="text-accent fill-accent" size={32} />
              </div>
            </div>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black">{points}</span>
              <span className="text-xl font-bold opacity-50 mb-2">/ 10</span>
            </div>
            
            <div className="progress-bar bg-background/20">
              <div
                className="progress-fill bg-primary"
                style={{ width: `${Math.min((points / 10) * 100, 100)}%` }}
              />
            </div>
            
            {allComplete && (
              <div className="mt-4 bg-primary/20 rounded-xl p-3 text-center">
                <span className="font-bold text-primary">🎉 All Quests Complete!</span>
              </div>
            )}
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-background/5 rounded-full" />
          <div className="absolute -right-4 bottom-4 w-20 h-20 bg-background/5 rounded-full" />
        </div>

        {/* Morning Quests */}
        <section>
          <div className="flex items-center gap-2 mb-4 pl-2">
            <School className="text-consonant-text" size={20} />
            <h3 className="font-black text-muted-foreground uppercase tracking-widest text-sm">
              Morning (Tutor)
            </h3>
            <AudioButton text="Morning quests with your tutor" size={16} />
          </div>
          <div className="space-y-3">
            {tutorQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isDone={dailyQuests[quest.id]}
                onClick={() => onQuestSelect(quest)}
              />
            ))}
          </div>
        </section>

        {/* Evening Quests */}
        <section>
          <div className="flex items-center gap-2 mb-4 pl-2">
            <Home className="text-vowel-text" size={20} />
            <h3 className="font-black text-muted-foreground uppercase tracking-widest text-sm">
              Evening (Home)
            </h3>
            <AudioButton text="Evening quests with your parent" size={16} />
          </div>
          <div className="space-y-3">
            {homeQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isDone={dailyQuests[quest.id]}
                onClick={() => onQuestSelect(quest)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
