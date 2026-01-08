import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Settings, Volume2, Map, User, Award } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { useVoiceSettings } from '@/hooks/useVoiceSettings';
import { LEXIA_REGIONS, applyLexiaTheme } from '@/lib/lexiaTheme';
import { calculateStreak, getTodayStr, getStreakMilestoneMessage, getStreakXpBonus } from '@/lib/streakUtils';

// Game components
import { WorldMap } from '@/components/game/WorldMap';
import { SoundMatchGame } from '@/components/game/SoundMatchGame';
import { WordBuilderGame } from '@/components/game/WordBuilderGame';
import { RhymeHuntGame } from '@/components/game/RhymeHuntGame';
import { MemoryMatchGame } from '@/components/game/MemoryMatchGame';
import { SyllableSortGame } from '@/components/game/SyllableSortGame';
import { QuestVictory } from '@/components/game/QuestVictory';
import { NPCGuide } from '@/components/game/NPCGuide';
import { EnhancedOnboarding } from '@/components/game/EnhancedOnboarding';
import { ProfileScreen } from '@/components/game/ProfileScreen';
import { AvatarWithAccessories } from '@/components/lexi/AvatarWithAccessories';
import { DailyQuests, generateDailyQuests, DailyQuest } from '@/components/game/DailyQuests';

interface LexiaGameState {
  hasOnboarded: boolean;
  character: {
    name: string;
    avatar: string;
    outfit: string;
    ageGroup: 'young' | 'older';
  };
  progress: {
    currentRegion: string;
    wilsonStep: number;
    level: number;
    xp: number;
    streak: number;
    lastActiveDate: string;
    longestStreak: number;
  };
  settings: {
    theme: string;
    audioSpeed: number;
    dyslexiaFont: boolean;
  };
  ownedItems: string[];
  completedQuests: string[];
  completedToday: string[];
  streakFreezeTokens: number;
}

const DEFAULT_STATE: LexiaGameState = {
  hasOnboarded: false,
  character: { name: 'Word Quester', avatar: '🦊', outfit: 'explorer', ageGroup: 'young' },
  progress: {
    currentRegion: 'phoneme_forest',
    wilsonStep: 1,
    level: 1,
    xp: 0,
    streak: 0,
    lastActiveDate: '',
    longestStreak: 0,
  },
  settings: {
    theme: 'default',
    audioSpeed: 0.9,
    dyslexiaFont: true,
  },
  ownedItems: [],
  completedQuests: [],
  completedToday: [],
  streakFreezeTokens: 1,
};

type GameView = 'home' | 'map' | 'quest' | 'wordBuilder' | 'rhymeHunt' | 'memoryMatch' | 'syllableSort' | 'victory' | 'profile' | 'settings';
type QuestType = 'sound' | 'word' | 'rhyme' | 'memory' | 'syllable';

const LexiaHome: React.FC = () => {
  const [state, setState] = useStickyState<LexiaGameState>(DEFAULT_STATE, 'lexia_world_v3');
  const [view, setView] = useState<GameView>('home');
  const [questResults, setQuestResults] = useState<any>(null);
  const [currentQuestType, setCurrentQuestType] = useState<QuestType>('sound');
  const [streakMessage, setStreakMessage] = useState<string | null>(null);
  const { speak, settings: voiceSettings } = useVoiceSettings();
  
  const dailyQuests = generateDailyQuests(
    state.progress.wilsonStep,
    state.character.ageGroup,
    state.completedToday
  );
  const streakBonus = getStreakXpBonus(state.progress.streak);

  const playEffect = (effect: string) => {
    // Minimal audio feedback
  };

  // Apply theme and audio settings on mount
  useEffect(() => {
    applyLexiaTheme(state.settings.theme);
    setRate(state.settings.audioSpeed);
  }, [state.settings.theme, state.settings.audioSpeed]);

  // Check and update streak on mount
  useEffect(() => {
    if (state.hasOnboarded) {
      const streakCalc = calculateStreak({
        currentStreak: state.progress.streak,
        lastActiveDate: state.progress.lastActiveDate,
        streakFreezeTokens: state.streakFreezeTokens,
        longestStreak: state.progress.longestStreak,
      });

      if (streakCalc.streakContinued || streakCalc.newStreak !== state.progress.streak) {
        const newLongest = Math.max(streakCalc.newStreak, state.progress.longestStreak);
        
        setState(prev => ({
          ...prev,
          progress: {
            ...prev.progress,
            streak: streakCalc.newStreak,
            lastActiveDate: getTodayStr(),
            longestStreak: newLongest,
          },
        }));

        // Check for milestone
        const milestone = getStreakMilestoneMessage(streakCalc.newStreak);
        if (milestone) {
          setStreakMessage(milestone);
          playEffect('levelUp');
        }
      }

      if (streakCalc.streakBroken && state.progress.streak > 0) {
        speak("Oh no! Your streak was reset. Let's start building it again!");
      }
    }
  }, [state.hasOnboarded]);

  // Welcome message
  useEffect(() => {
    if (state.hasOnboarded && view === 'home') {
      const greeting = state.progress.streak > 0 
        ? `Welcome back, ${state.character.name}! You have a ${state.progress.streak} day streak!`
        : `Welcome back, ${state.character.name}! Ready for an adventure?`;
      speak(greeting);
    }
  }, [state.hasOnboarded]);

  const handleCharacterComplete = (data: { name: string; avatar: string; ageGroup: 'young' | 'older'; outfit: string }) => {
    setState(prev => ({
      ...prev,
      hasOnboarded: true,
      character: {
        name: data.name,
        avatar: data.avatar,
        outfit: data.outfit,
        ageGroup: data.ageGroup,
      },
      progress: {
        ...prev.progress,
        lastActiveDate: getTodayStr(),
        streak: 1,
      },
    }));
  };

  const handleStartQuest = (questType: QuestType) => {
    playEffect('tap');
    setCurrentQuestType(questType);
    
    const viewMap: Record<QuestType, GameView> = {
      sound: 'quest',
      word: 'wordBuilder',
      rhyme: 'rhymeHunt',
      memory: 'memoryMatch',
      syllable: 'syllableSort',
    };
    
    setView(viewMap[questType]);
  };

  const handleQuestComplete = (results: any) => {
    const baseXp = 50;
    const accuracyBonus = results.correct === results.total ? 25 : 
                          results.correct >= results.total * 0.8 ? 10 : 0;
    const noHintBonus = results.hintsUsed === 0 ? 15 : 0;
    const streakBonus = getStreakXpBonus(state.progress.streak);
    const xpEarned = baseXp + accuracyBonus + noHintBonus + streakBonus;

    const newXp = state.progress.xp + xpEarned;
    const newLevel = Math.floor(newXp / 100) + 1;
    const leveledUp = newLevel > state.progress.level;

    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        xp: newXp,
        level: newLevel,
        lastActiveDate: getTodayStr(),
      },
    }));

    if (leveledUp) {
      playEffect('levelUp');
    }

    setQuestResults({ ...results, xpEarned, streakBonus, leveledUp, newLevel });
    setView('victory');
  };

  const handleContinue = () => {
    setQuestResults(null);
    setView('home');
  };

  const handleRetry = () => {
    setQuestResults(null);
    // Go back to the same quest type
    handleStartQuest(currentQuestType);
  };

  const handleUpdateSettings = (newSettings: Partial<LexiaGameState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const handleUpdateCharacter = (newCharacter: Partial<LexiaGameState['character']>) => {
    setState(prev => ({
      ...prev,
      character: { ...prev.character, ...newCharacter },
    }));
  };

  const handleUseStreakFreeze = () => {
    if (state.streakFreezeTokens > 0) {
      setState(prev => ({
        ...prev,
        streakFreezeTokens: prev.streakFreezeTokens - 1,
        progress: {
          ...prev.progress,
          lastActiveDate: getTodayStr(),
        },
      }));
      playEffect('correct');
      speak('Streak freeze activated! Your streak is protected!');
    }
  };

  // Enhanced Onboarding
  if (!state.hasOnboarded) {
    return <EnhancedOnboarding onComplete={handleCharacterComplete} />;
  }

  // Victory Screen
  if (view === 'victory' && questResults) {
    return (
      <QuestVictory
        questName={getQuestName(currentQuestType)}
        results={questResults}
        xpEarned={questResults.xpEarned}
        onContinue={handleContinue}
        onRetry={handleRetry}
      />
    );
  }

  // Profile Screen
  if (view === 'profile') {
    return (
      <ProfileScreen
        character={state.character}
        progress={state.progress}
        settings={state.settings}
        ownedItems={state.ownedItems}
        streakFreezeTokens={state.streakFreezeTokens}
        onBack={() => setView('home')}
        onUpdateSettings={handleUpdateSettings}
        onUpdateCharacter={handleUpdateCharacter}
        onUseStreakFreeze={handleUseStreakFreeze}
      />
    );
  }

  // Quest Views
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

  if (view === 'rhymeHunt') {
    return (
      <RhymeHuntGame
        questionsCount={5}
        onComplete={handleQuestComplete}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'memoryMatch') {
    return (
      <MemoryMatchGame
        questionsCount={6}
        onComplete={handleQuestComplete}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'syllableSort') {
    return (
      <SyllableSortGame
        questionsCount={6}
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
      {/* Streak Milestone Toast */}
      {streakMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 right-4 z-50 bg-accent text-white p-4 rounded-2xl font-bold text-center shadow-lg"
          onClick={() => setStreakMessage(null)}
        >
          {streakMessage}
        </motion.div>
      )}

      {/* Header */}
      <header className="bg-card p-6 rounded-b-[40px] shadow-lg border-b-4 border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('profile')}>
              <AvatarWithAccessories
                baseAvatar={state.character.avatar}
                ownedAccessories={state.ownedItems.filter(i => !i.startsWith('pet_') && !i.startsWith('theme_'))}
                size="md"
              />
            </button>
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
          <motion.div
            className="flex-1 bg-accent/10 p-3 rounded-2xl flex items-center gap-3 border-2 border-accent/20"
            animate={state.progress.streak > 0 ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.div
              animate={state.progress.streak > 0 ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame className="text-accent fill-accent" size={24} />
            </motion.div>
            <div>
              <div className="text-xl font-black text-accent">{state.progress.streak}</div>
              <div className="text-[10px] font-bold text-accent/70 uppercase">Streak</div>
            </div>
          </motion.div>
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

          {/* Quest Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleStartQuest('sound')}
              className="h-20 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <span className="text-2xl">🔊</span>
              <span className="text-sm">Sound Match</span>
            </button>
            <button
              onClick={() => handleStartQuest('word')}
              className="h-20 bg-consonant text-consonant-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-consonant-border"
            >
              <span className="text-2xl">🔤</span>
              <span className="text-sm">Word Builder</span>
            </button>
            <button
              onClick={() => handleStartQuest('rhyme')}
              className="h-20 bg-vowel text-vowel-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-vowel-border"
            >
              <span className="text-2xl">🎵</span>
              <span className="text-sm">Rhyme Hunt</span>
            </button>
            <button
              onClick={() => handleStartQuest('memory')}
              className="h-20 bg-digraph text-digraph-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-digraph-border"
            >
              <span className="text-2xl">🧠</span>
              <span className="text-sm">Memory Match</span>
            </button>
            <button
              onClick={() => handleStartQuest('syllable')}
              className="col-span-2 h-20 bg-welded text-welded-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-welded-border"
            >
              <span className="text-2xl">👏</span>
              <span className="text-sm">Syllable Sort</span>
            </button>
          </div>
        </motion.div>

        {/* Whisper */}
        <Whisper
          message={state.progress.streak > 0 
            ? `Keep your ${state.progress.streak} day streak going!` 
            : "Choose a quest to start your adventure!"
          }
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
          onClick={() => setView('profile')}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <User size={24} />
          <span className="text-xs font-bold">Profile</span>
        </button>
        <button
          onClick={() => {
            playEffect('tap');
            setView('profile');
          }}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <Settings size={24} />
          <span className="text-xs font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
};

function getQuestName(type: QuestType): string {
  const names: Record<QuestType, string> = {
    sound: 'Sound Springs Discovery',
    word: 'Word Builder Challenge',
    rhyme: 'Rhyme Hunt Adventure',
    memory: 'Memory Match Quest',
    syllable: 'Syllable Sort Mission',
  };
  return names[type];
}

export default LexiaHome;
