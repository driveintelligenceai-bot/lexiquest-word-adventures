import React from 'react';
import { CheckCircle, ChevronRight, LucideIcon } from 'lucide-react';
import { AudioButton } from './AudioButton';

export interface Quest {
  id: string;
  role: 'tutor' | 'home';
  type: 'drill' | 'build' | 'check';
  title: string;
  icon: LucideIcon;
  points: number;
  content: string;
  target?: string;
}

interface QuestCardProps {
  quest: Quest;
  isDone: boolean;
  onClick: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, isDone, onClick }) => {
  const IconComponent = quest.icon;
  
  return (
    <button
      onClick={onClick}
      disabled={isDone}
      className={`quest-card ${isDone ? 'quest-card-done' : 'quest-card-active'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          isDone 
            ? 'bg-muted text-muted-foreground' 
            : quest.role === 'tutor' 
              ? 'bg-consonant text-consonant-text' 
              : 'bg-vowel text-vowel-text'
        }`}>
          {isDone ? <CheckCircle size={28} /> : <IconComponent size={28} />}
        </div>
        <div className="text-left">
          <div className={`font-bold text-lg ${isDone ? 'text-muted-foreground' : 'text-foreground'}`}>
            {quest.title}
          </div>
          {!isDone && (
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              +{quest.points} Points
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {!isDone && <AudioButton text={quest.title} size={18} />}
        {!isDone && <ChevronRight className="text-muted-foreground" />}
      </div>
    </button>
  );
};
