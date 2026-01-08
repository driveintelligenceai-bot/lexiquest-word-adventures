import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Settings, Volume2, Map, User, Award } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { LEXIA_REGIONS, applyLexiaTheme } from '@/lib/lexiaTheme';

// Game components
import { WorldMap } from '@/components/game/WorldMap';
import { SoundMatchGame } from '@/components/game/SoundMatchGame';
import { WordBuilderGame } from '@/components/game/WordBuilderGame';
import { QuestVictory } from '@/components/game/QuestVictory';
import { Whisper } from '@/components/game/Whisper';
import { CharacterCreation } from '@/components/game/CharacterCreation';
import { AvatarWithAccessories } from '@/components/lexi/AvatarWithAccessories';

interface LexiaGameState {
  hasOnboarded: boolean;
  character: {
    name: string;
    avatar: string;
    outfit: string;
  };
  progress: {
    currentRegion: string;
    wilsonStep: number;
    level: number;
    xp: number;
    streak: number;
    lastActiveDate: string;
  };
  settings: {
    theme: string;
    audioSpeed: number;
    dyslexiaFont: boolean;
  };
  ownedItems: string[];
  completedQuests: string[];
}

const DEFAULT_STATE: LexiaGameState = {
  hasOnboarded: false,
  character: { name: 'Word Quester', avatar: '🦊', outfit: 'explorer' },
  progress: {
    currentRegion: 'phoneme_forest',
    wilsonStep: 1,
    level: 1,
    xp: 0,
    streak: 0,
    lastActiveDate: '',
  },
  settings: {
    theme: 'default',
    audioSpeed: 0.9,
    dyslexiaFont: true,
  },
  ownedItems: [],
  completedQuests: [],
};

type GameView = 'home' | 'map' | 'quest' | 'wordBuilder' | 'victory' | 'profile' | 'settings';

const LexiaHome: React.FC = () => {
  const [state, setState] = useStickyState<LexiaGameState>(DEFAULT_STATE, 'lexia_world_v1');
  const [view, setView] = useState<GameView>('home');
  const [questResults, setQuestResults] = useState<any>(null);
  const { speak, playEffect } = useLexiaAudio();

  // Apply theme on mount
  useEffect(() => {
    applyLexiaTheme(state.settings.theme);
  }, [state.settings.theme]);

  // Welcome message
  useEffect(() => {
    if (state.hasOnboarded && view === 'home') {
      speak(`Welcome back, ${state.character.name}! Ready for an adventure?`);
    }
  }, [state.hasOnboarded]);

  const handleCharacterComplete = (data: { name: string; avatar: string; outfit: string }) => {
    playEffect('complete');
    setState(prev => ({
      ...prev,
      hasOnboarded: true,
      character: {
        name: data.name,
        avatar: data.avatar,
        outfit: data.outfit,
      },
    }));
    speak(`Welcome, ${data.name}! Your adventure begins!`);
  };

  const handleStartQuest = (questType: 'sound' | 'word') => {
    playEffect('tap');
    setView(questType === 'sound' ? 'quest' : 'wordBuilder');
  };

  const handleQuestComplete = (results: any) => {
    const baseXp = 50;
    const accuracyBonus = results.correct === results.total ? 25 : 
                          results.correct >= results.total * 0.8 ? 10 : 0;
    const noHintBonus = results.hintsUsed === 0 ? 15 : 0;
    const xpEarned = baseXp + accuracyBonus + noHintBonus;

    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        xp: prev.progress.xp + xpEarned,
        level: Math.floor((prev.progress.xp + xpEarned) / 100) + 1,
      },
    }));

    setQuestResults({ ...results, xpEarned });
    setView('victory');
  };

  const handleContinue = () => {
    setQuestResults(null);
    setView('home');
  };

  const handleRetry = () => {
    setQuestResults(null);
    setView('quest');
  };

  // Character Creation
  if (!state.hasOnboarded) {
    return <CharacterCreation onComplete={handleCharacterComplete} />;
  }

  // Victory Screen
  if (view === 'victory' && questResults) {
    return (
      <QuestVictory
        questName="Sound Springs Discovery"
        results={questResults}
        xpEarned={questResults.xpEarned}
        onContinue={handleContinue}
        onRetry={handleRetry}
      />
    );
  }

  // Quest View - Sound Match
  if (view === 'quest') {
    return (
      <SoundMatchGame
        wilsonStep={state.progress.wilsonStep}
        questionsCount={5}
        onComplete={handleQuestComplete}
        onBack={() => setView('home')}
      />
    );
  }

  // Quest View - Word Builder
  if (view === 'wordBuilder') {
    return (
      <WordBuilderGame
        wilsonStep={state.progress.wilsonStep}
        questionsCount={5}
        onComplete={handleQuestComplete}
        onBack={() => setView('home')}
      />
    );
  }

  // Map View
  if (view === 'map') {
    return (
      <div className="min-h-screen bg-background p-6 pb-32">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Kingdom of Lexia</h1>
          <button
            onClick={() => setView('home')}
            className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95"
          >
            ✕
          </button>
        </div>
        
        <WorldMap
          currentRegion={state.progress.currentRegion}
          currentLevel={state.progress.level}
          unlockedRegions={['phoneme_forest']}
          onSelectRegion={(region) => {
            setState(prev => ({
              ...prev,
              progress: { ...prev.progress, currentRegion: region }
            }));
            speak(LEXIA_REGIONS[region as keyof typeof LEXIA_REGIONS].name);
          }}
        />
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="bg-card p-6 rounded-b-[40px] shadow-lg border-b-4 border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <AvatarWithAccessories
              baseAvatar={state.character.avatar}
              ownedAccessories={state.ownedItems.filter(i => !i.startsWith('pet_') && !i.startsWith('theme_'))}
              size="md"
            />
            <div>
              <h1 className="text-2xl font-black text-foreground">{state.character.name}</h1>
              <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block mt-1">
                Level {state.progress.level}
              </div>
            </div>
          </div>

          <button
            onClick={() => speak(`Hello ${state.character.name}!`)}
            className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center active:scale-95"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-accent/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-accent/20">
            <Flame className="text-accent fill-accent" size={24} />
            <div>
              <div className="text-xl font-black text-accent">{state.progress.streak}</div>
              <div className="text-[10px] font-bold text-accent/70 uppercase">Streak</div>
            </div>
          </div>
          <div className="flex-1 bg-primary/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-primary/20">
            <Trophy className="text-primary" size={24} />
            <div>
              <div className="text-xl font-black text-foreground">{state.progress.xp}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">XP</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Current Region */}
        <motion.div
          className="bg-card rounded-3xl p-6 shadow-lg border-2 border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">
              {LEXIA_REGIONS[state.progress.currentRegion as keyof typeof LEXIA_REGIONS]?.icon}
            </span>
            <div>
              <h2 className="text-xl font-bold">
                {LEXIA_REGIONS[state.progress.currentRegion as keyof typeof LEXIA_REGIONS]?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {LEXIA_REGIONS[state.progress.currentRegion as keyof typeof LEXIA_REGIONS]?.description}
              </p>
            </div>
          </div>

          {/* Quest Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleStartQuest('sound')}
              className="w-full h-16 bg-primary text-primary-foreground rounded-2xl text-lg font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <span className="text-2xl">🔊</span>
              Sound Match Quest
            </button>
            <button
              onClick={() => handleStartQuest('word')}
              className="w-full h-16 bg-consonant text-consonant-text rounded-2xl text-lg font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform border-2 border-consonant-border"
            >
              <span className="text-2xl">🔤</span>
              Word Builder Quest
            </button>
          </div>
        </motion.div>

        {/* Whisper */}
        <Whisper
          message="Choose a quest to practice your skills!"
          variant="idle"
        />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border px-6 py-4 flex justify-around">
        <button
          onClick={() => setView('home')}
          className="flex flex-col items-center gap-1 text-primary"
        >
          <Award size={24} />
          <span className="text-xs font-bold">Quests</span>
        </button>
        <button
          onClick={() => setView('map')}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <Map size={24} />
          <span className="text-xs font-bold">Map</span>
        </button>
        <button
          onClick={() => playEffect('tap')}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <User size={24} />
          <span className="text-xs font-bold">Profile</span>
        </button>
        <button
          onClick={() => playEffect('tap')}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <Settings size={24} />
          <span className="text-xs font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default LexiaHome;
