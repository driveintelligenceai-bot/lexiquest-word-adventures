import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface RewardModalProps {
  points: number;
  onClose: () => void;
  isBossKill?: boolean;
}

export const RewardModal: React.FC<RewardModalProps> = ({ points, onClose, isBossKill }) => {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-zoom-in">
      <div className="bg-card p-8 rounded-3xl text-center max-w-sm m-4 border-4 border-accent relative shadow-2xl">
        {/* Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#F6AD55', '#4FD1C5', '#FC8181', '#68D391'][i % 4],
                animationDelay: `${i * 0.1}s`,
                top: '100%',
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          {isBossKill ? (
            <>
              <div className="flex justify-center gap-2 mb-4">
                <Star className="text-accent fill-accent animate-pulse-glow" size={40} />
                <Trophy size={80} className="text-accent animate-bounce-soft" />
                <Star className="text-accent fill-accent animate-pulse-glow" size={40} />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-2">BOSS DEFEATED!</h2>
              <p className="text-muted-foreground mb-6">You completed all quests today!</p>
            </>
          ) : (
            <>
              <Trophy size={80} className="mx-auto text-accent mb-4 animate-bounce-soft" />
              <h2 className="text-3xl font-black text-foreground mb-2">Awesome!</h2>
              <p className="text-muted-foreground mb-2">+{points} Points Earned!</p>
            </>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-transform"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
