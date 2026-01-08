import React from 'react';

interface AvatarWithAccessoriesProps {
  baseAvatar: string;
  ownedAccessories: string[];
  activeAccessory?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Maps accessory IDs to overlay emojis/positions
const ACCESSORY_OVERLAYS: Record<string, { emoji: string; position: string }> = {
  crown: { emoji: '👑', position: '-top-3 left-1/2 -translate-x-1/2' },
  glasses: { emoji: '🕶️', position: 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2' },
  wizard: { emoji: '🎩', position: '-top-4 left-1/2 -translate-x-1/2' },
  pirate: { emoji: '🏴‍☠️', position: '-top-3 -right-1' },
  astronaut: { emoji: '🪐', position: '-top-2 -right-2' },
  ninja: { emoji: '⭐', position: '-top-1 -right-1' },
};

const SIZE_CLASSES = {
  sm: { container: 'w-12 h-12', avatar: 'text-2xl', accessory: 'text-sm' },
  md: { container: 'w-16 h-16', avatar: 'text-4xl', accessory: 'text-lg' },
  lg: { container: 'w-20 h-20', avatar: 'text-5xl', accessory: 'text-xl' },
  xl: { container: 'w-24 h-24', avatar: 'text-6xl', accessory: 'text-2xl' },
};

export const AvatarWithAccessories: React.FC<AvatarWithAccessoriesProps> = ({
  baseAvatar,
  ownedAccessories,
  activeAccessory,
  size = 'md',
}) => {
  const sizeClass = SIZE_CLASSES[size];
  
  // Get the accessory to display (active or last purchased)
  const displayAccessory = activeAccessory || 
    ownedAccessories.filter(id => ACCESSORY_OVERLAYS[id]).pop();
  
  const accessoryData = displayAccessory ? ACCESSORY_OVERLAYS[displayAccessory] : null;

  return (
    <div className={`${sizeClass.container} relative`}>
      {/* Base Avatar */}
      <div 
        className={`${sizeClass.container} bg-card rounded-2xl flex items-center justify-center shadow-sm border-2 border-accent/20 animate-bounce-slow`}
      >
        <span className={sizeClass.avatar}>{baseAvatar}</span>
      </div>
      
      {/* Accessory Overlay */}
      {accessoryData && (
        <div 
          className={`absolute ${accessoryData.position} ${sizeClass.accessory} animate-bounce-slow`}
          style={{ animationDelay: '0.1s' }}
        >
          {accessoryData.emoji}
        </div>
      )}
    </div>
  );
};
