import React from 'react';

interface LexiPetProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  activePet?: string;
}

const PET_STAGES = ["🥚", "🐣", "🐥", "🦉", "🦅", "🦄", "🐉"];

const SPECIAL_PETS: Record<string, string> = {
  'pet_dragon': '🐉',
  'pet_unicorn': '🦄',
  'pet_phoenix': '🔥',
  'pet_robot': '🤖',
};

export const LexiPet: React.FC<LexiPetProps> = ({ level, size = 'md', activePet }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-4xl',
    lg: 'w-20 h-20 text-5xl'
  };

  // Show special pet if owned
  const pet = activePet && SPECIAL_PETS[activePet] 
    ? SPECIAL_PETS[activePet] 
    : PET_STAGES[Math.min(level, PET_STAGES.length - 1)];

  return (
    <div 
      className={`${sizeClasses[size]} bg-card rounded-2xl flex items-center justify-center shadow-sm border-2 border-accent/20 animate-bounce-slow`}
    >
      {pet}
    </div>
  );
};
