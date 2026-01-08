import React from 'react';
import { CheckCircle, ChevronRight, LucideIcon, Volume2 } from 'lucide-react';
import { speak } from '@/lib/speech';

export interface Quest {
  id: string;
  role: 'tutor' | 'home';
  type: 'drill' | 'build' | 'read' | 'check';
  title: string;
  icon: LucideIcon;
  points: number;
  content: string;
  data?: any;
}

interface QuestCardProps {
  quest: Quest;
  isDone: boolean;
  onClick: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, isDone, onClick }) => {
  const IconComponent = quest.icon;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(quest.title);
  };

  return (
    <button
      onClick={onClick}
      disabled={isDone}
      className={`quest-card group ${isDone ? 'quest-card-done' : 'quest-card-active'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground shadow-inner ${
          isDone ? 'bg-muted-foreground/30' : 'bg-primary'
        }`}>
          {isDone ? <CheckCircle size={24} /> : <IconComponent size={24} />}
        </div>
        <div className="text-left">
          <div className={`font-bold ${isDone ? 'text-muted-foreground' : 'text-foreground'}`}>
            {quest.title}
          </div>
          {!isDone && (
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              +{quest.points} XP
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isDone && (
          <>
            <button
              onClick={handleSpeak}
              className="icon-btn"
              aria-label="Hear quest title"
            >
              <Volume2 size={18} />
            </button>
            <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
          </>
        )}
      </div>
    </button>
  );
};
