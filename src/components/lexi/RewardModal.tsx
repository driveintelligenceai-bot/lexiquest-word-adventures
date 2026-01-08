import React from 'react';
import { Sparkles, Star, Trophy, Zap } from 'lucide-react';

interface RewardModalProps {
  points: number;
  onClose: () => void;
  isBossKill?: boolean;
}

export const RewardModal: React.FC<RewardModalProps> = ({ points, onClose, isBossKill }) => {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-zoom-in">
      <div className="bg-card p-8 rounded-3xl text-center max-w-sm m-4 border-4 border-accent relative shadow-2xl">
        {isBossKill ? (
          <>
            <div className="flex justify-center gap-2 mb-4">
              <Star className="text-accent fill-accent animate-pulse" size={32} />
              <Trophy size={64} className="text-accent animate-bounce-slow" />
              <Star className="text-accent fill-accent animate-pulse" size={32} />
            </div>
            <h2 className="text-4xl font-black text-foreground mb-2">Amazing!</h2>
            <p className="text-muted-foreground mb-2 text-lg">All Quests Complete!</p>
          </>
        ) : (
          <>
            <Sparkles size={64} className="mx-auto text-accent mb-4 animate-spin-slow" />
            <h2 className="text-4xl font-black text-foreground mb-2">Awesome!</h2>
          </>
        )}
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap className="text-accent fill-accent" size={24} />
          <span className="text-2xl font-black text-accent">+{points} XP</span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-transform"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
