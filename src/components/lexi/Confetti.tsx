import React from 'react';
import { Star, Sparkles, Heart } from 'lucide-react';

export const Confetti: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    type: Math.floor(Math.random() * 3)
  }));

  const colors = ['text-yellow-400', 'text-blue-400', 'text-pink-400', 'text-green-400'];
  const icons = [Star, Sparkles, Heart];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => {
        const Icon = icons[p.type];
        return (
          <div
            key={p.id}
            className={`absolute animate-float-up ${colors[p.id % colors.length]}`}
            style={{
              left: `${p.left}%`,
              bottom: '-20px',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }}
          >
            <Icon size={16} fill="currentColor" />
          </div>
        );
      })}
    </div>
  );
};
