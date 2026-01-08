import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles, Palette, Star, Check, Lock } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface StoreItem {
  id: string;
  category: 'avatar' | 'pet' | 'theme';
  name: string;
  icon: string;
  cost: number;
  description: string;
}

const STORE_ITEMS: StoreItem[] = [
  // Avatar Accessories
  { id: 'crown', category: 'avatar', name: 'Royal Crown', icon: '👑', cost: 100, description: 'A golden crown for royalty!' },
  { id: 'glasses', category: 'avatar', name: 'Cool Shades', icon: '😎', cost: 50, description: 'Super cool sunglasses' },
  { id: 'wizard', category: 'avatar', name: 'Wizard Hat', icon: '🧙', cost: 75, description: 'Magical wizard hat' },
  { id: 'pirate', category: 'avatar', name: 'Pirate Hat', icon: '🏴‍☠️', cost: 80, description: 'Arr, matey!' },
  { id: 'astronaut', category: 'avatar', name: 'Space Helmet', icon: '🚀', cost: 150, description: 'Ready for space!' },
  { id: 'ninja', category: 'avatar', name: 'Ninja Mask', icon: '🥷', cost: 90, description: 'Silent and swift' },
  
  // Pet Evolutions
  { id: 'pet_dragon', category: 'pet', name: 'Baby Dragon', icon: '🐉', cost: 200, description: 'A cute baby dragon friend' },
  { id: 'pet_unicorn', category: 'pet', name: 'Magic Unicorn', icon: '🦄', cost: 250, description: 'Sparkly unicorn companion' },
  { id: 'pet_phoenix', category: 'pet', name: 'Phoenix', icon: '🔥', cost: 300, description: 'A legendary phoenix pet' },
  { id: 'pet_robot', category: 'pet', name: 'Robot Buddy', icon: '🤖', cost: 175, description: 'Beep boop friend!' },
  
  // Theme Colors
  { id: 'theme_ocean', category: 'theme', name: 'Ocean Blue', icon: '🌊', cost: 60, description: 'Cool ocean vibes' },
  { id: 'theme_forest', category: 'theme', name: 'Forest Green', icon: '🌲', cost: 60, description: 'Nature adventure' },
  { id: 'theme_sunset', category: 'theme', name: 'Sunset Orange', icon: '🌅', cost: 60, description: 'Warm sunset colors' },
  { id: 'theme_galaxy', category: 'theme', name: 'Galaxy Purple', icon: '🌌', cost: 120, description: 'Cosmic adventure!' },
  { id: 'theme_rainbow', category: 'theme', name: 'Rainbow', icon: '🌈', cost: 150, description: 'All the colors!' },
];

interface RewardStoreProps {
  currentXp: number;
  ownedItems: string[];
  onClose: () => void;
  onPurchase: (itemId: string, cost: number) => void;
}

export const RewardStore: React.FC<RewardStoreProps> = ({
  currentXp,
  ownedItems,
  onClose,
  onPurchase,
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'pet' | 'theme'>('avatar');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const filteredItems = STORE_ITEMS.filter(item => item.category === activeTab);

  const handlePurchase = (item: StoreItem) => {
    if (currentXp < item.cost || ownedItems.includes(item.id)) return;
    
    setPurchasing(item.id);
    sounds.purchase();
    
    setTimeout(() => {
      onPurchase(item.id, item.cost);
      setPurchasing(null);
    }, 500);
  };

  const tabs = [
    { id: 'avatar' as const, label: 'Accessories', icon: Sparkles },
    { id: 'pet' as const, label: 'Pets', icon: Star },
    { id: 'theme' as const, label: 'Themes', icon: Palette },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="min-h-screen p-6 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 rounded-2xl">
              <ShoppingBag className="text-accent" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Reward Store</h1>
              <div className="text-sm text-primary font-bold">
                ⚡ {currentXp} XP available
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors active:scale-95"
            aria-label="Close store"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                sounds.tap();
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card text-muted-foreground border border-border'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {filteredItems.map((item, index) => {
            const owned = ownedItems.includes(item.id);
            const canAfford = currentXp >= item.cost;
            const isPurchasing = purchasing === item.id;

            return (
              <div
                key={item.id}
                className={`bg-card rounded-3xl p-4 border-2 transition-all animate-fade-in ${
                  owned
                    ? 'border-accent/50 bg-accent/10'
                    : canAfford
                    ? 'border-border hover:border-primary/50 hover:shadow-lg'
                    : 'border-border/50 opacity-60'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className={`text-5xl text-center mb-3 ${isPurchasing ? 'animate-bounce' : ''}`}>
                  {item.icon}
                </div>

                {/* Name */}
                <h3 className="font-bold text-center text-foreground text-sm mb-1">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground text-center mb-3">
                  {item.description}
                </p>

                {/* Action */}
                {owned ? (
                  <div className="flex items-center justify-center gap-2 py-2 px-4 bg-accent/20 rounded-xl text-accent font-bold text-sm">
                    <Check size={16} />
                    Owned
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford || isPurchasing}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {!canAfford && <Lock size={14} />}
                    ⚡ {item.cost} XP
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No items in this category yet!
          </div>
        )}
      </div>
    </div>
  );
};
