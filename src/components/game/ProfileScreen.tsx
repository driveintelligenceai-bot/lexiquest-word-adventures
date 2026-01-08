import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Trophy, Star, Settings, Volume2, Palette, Snowflake } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { AvatarWithAccessories } from '@/components/lexi/AvatarWithAccessories';

interface ProfileScreenProps {
  character: {
    name: string;
    avatar: string;
    outfit: string;
  };
  progress: {
    level: number;
    xp: number;
    streak: number;
    lastActiveDate: string;
  };
  settings: {
    audioSpeed: number;
    dyslexiaFont: boolean;
    theme: string;
  };
  ownedItems: string[];
  streakFreezeTokens: number;
  onBack: () => void;
  onUpdateSettings: (settings: Partial<ProfileScreenProps['settings']>) => void;
  onUpdateCharacter: (character: Partial<ProfileScreenProps['character']>) => void;
  onUseStreakFreeze: () => void;
}

const OUTFITS = [
  { id: 'explorer', emoji: '🎒', name: 'Explorer' },
  { id: 'wizard', emoji: '🧙', name: 'Wizard' },
  { id: 'knight', emoji: '🛡️', name: 'Knight' },
  { id: 'fairy', emoji: '🧚', name: 'Fairy' },
];

const AVATARS = ['🦊', '🦉', '🐰', '🐻', '🦄', '🐱', '🐶', '🐼'];

const ACHIEVEMENTS = [
  { id: 'first_quest', name: 'First Steps', icon: '🌟', desc: 'Complete your first quest', unlocked: true },
  { id: 'streak_3', name: 'On Fire', icon: '🔥', desc: '3 day streak', unlocked: true },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', desc: '7 day streak', unlocked: false },
  { id: 'xp_100', name: 'Century Club', icon: '💯', desc: 'Earn 100 XP', unlocked: true },
  { id: 'xp_500', name: 'Rising Star', icon: '⭐', desc: 'Earn 500 XP', unlocked: false },
  { id: 'perfect_10', name: 'Perfect 10', icon: '🎯', desc: '10 perfect quests', unlocked: false },
  { id: 'rhyme_master', name: 'Rhyme Master', icon: '🎵', desc: 'Complete 10 rhyme hunts', unlocked: false },
  { id: 'memory_king', name: 'Memory King', icon: '🧠', desc: 'Complete 10 memory matches', unlocked: false },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  character,
  progress,
  settings,
  ownedItems,
  streakFreezeTokens,
  onBack,
  onUpdateSettings,
  onUpdateCharacter,
  onUseStreakFreeze,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'customize' | 'achievements' | 'settings'>('profile');
  const { speak, playEffect, setRate, setEnabled } = useLexiaAudio();

  const xpToNextLevel = 100 - (progress.xp % 100);
  const xpProgress = (progress.xp % 100) / 100;

  const handleAudioSpeedChange = (speed: number) => {
    setRate(speed);
    onUpdateSettings({ audioSpeed: speed });
    speak('This is how I sound now!');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="bg-card p-6 rounded-b-[40px] shadow-lg border-b-4 border-border">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black">My Profile</h1>
          <div className="w-12" />
        </div>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center">
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <AvatarWithAccessories
              baseAvatar={character.avatar}
              ownedAccessories={ownedItems.filter(i => !i.startsWith('pet_') && !i.startsWith('theme_'))}
              size="lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-sm font-black px-3 py-1 rounded-full">
              Lv.{progress.level}
            </div>
          </motion.div>
          <h2 className="text-2xl font-black mt-4">{character.name}</h2>
          <p className="text-muted-foreground">
            The {OUTFITS.find(o => o.id === character.outfit)?.name || 'Explorer'}
          </p>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level {progress.level}</span>
            <span className="text-primary font-bold">{xpToNextLevel} XP to next level</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mt-6">
          <div className="flex-1 bg-accent/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-accent/20">
            <motion.div
              animate={{ scale: progress.streak > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: progress.streak > 0 ? Infinity : 0, duration: 1 }}
            >
              <Flame className="text-accent fill-accent" size={24} />
            </motion.div>
            <div>
              <div className="text-xl font-black text-accent">{progress.streak}</div>
              <div className="text-[10px] font-bold text-accent/70 uppercase">Day Streak</div>
            </div>
          </div>
          <div className="flex-1 bg-primary/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-primary/20">
            <Trophy className="text-primary" size={24} />
            <div>
              <div className="text-xl font-black text-foreground">{progress.xp}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Total XP</div>
            </div>
          </div>
          <div className="flex-1 bg-blue-500/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-blue-500/20">
            <Snowflake className="text-blue-500" size={24} />
            <div>
              <div className="text-xl font-black text-blue-500">{streakFreezeTokens}</div>
              <div className="text-[10px] font-bold text-blue-500/70 uppercase">Freezes</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile', icon: '👤' },
          { id: 'customize', label: 'Customize', icon: '🎨' },
          { id: 'achievements', label: 'Badges', icon: '🏆' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playEffect('tap');
              setActiveTab(tab.id as any);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <main className="p-4">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-4 border-2 border-border">
              <h3 className="font-bold mb-3">Streak Freeze</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Protect your streak if you miss a day!
              </p>
              <button
                onClick={onUseStreakFreeze}
                disabled={streakFreezeTokens === 0}
                className={`w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 ${
                  streakFreezeTokens > 0
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <Snowflake size={20} />
                Use Streak Freeze ({streakFreezeTokens} left)
              </button>
            </div>
          </div>
        )}

        {/* Customize Tab */}
        {activeTab === 'customize' && (
          <div className="space-y-6">
            {/* Avatar Selection */}
            <div className="bg-card rounded-2xl p-4 border-2 border-border">
              <h3 className="font-bold mb-3">Choose Your Buddy</h3>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => {
                      playEffect('tap');
                      onUpdateCharacter({ avatar });
                    }}
                    className={`aspect-square rounded-xl text-3xl border-4 transition-all ${
                      character.avatar === avatar
                        ? 'bg-primary/20 border-primary scale-105'
                        : 'bg-muted border-border'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit Selection */}
            <div className="bg-card rounded-2xl p-4 border-2 border-border">
              <h3 className="font-bold mb-3">Choose Your Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {OUTFITS.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => {
                      playEffect('tap');
                      onUpdateCharacter({ outfit: outfit.id });
                    }}
                    className={`p-4 rounded-xl border-4 transition-all flex items-center gap-3 ${
                      character.outfit === outfit.id
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <span className="text-3xl">{outfit.emoji}</span>
                    <span className="font-bold">{outfit.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-2xl border-4 text-center ${
                  achievement.unlocked
                    ? 'bg-welded/30 border-welded-border'
                    : 'bg-muted border-border opacity-50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-4xl">{achievement.icon}</span>
                <h4 className="font-bold mt-2 text-sm">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{achievement.desc}</p>
                {achievement.unlocked && (
                  <span className="text-xs text-welded-text font-bold mt-2 block">✓ Unlocked</span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Audio Speed */}
            <div className="bg-card rounded-2xl p-4 border-2 border-border">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 size={24} className="text-primary" />
                <h3 className="font-bold">Audio Speed</h3>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 0.7, label: 'Slow' },
                  { value: 0.9, label: 'Normal' },
                  { value: 1.1, label: 'Fast' },
                ].map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() => handleAudioSpeedChange(speed.value)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      settings.audioSpeed === speed.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia Font Toggle */}
            <div className="bg-card rounded-2xl p-4 border-2 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette size={24} className="text-primary" />
                  <div>
                    <h3 className="font-bold">Dyslexia-Friendly Font</h3>
                    <p className="text-sm text-muted-foreground">Easier to read letters</p>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ dyslexiaFont: !settings.dyslexiaFont })}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.dyslexiaFont ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ x: settings.dyslexiaFont ? 28 : 4 }}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
