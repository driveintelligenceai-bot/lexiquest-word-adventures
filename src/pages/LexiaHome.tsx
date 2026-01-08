import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Settings, Volume2, Map, User, Award, Users, VolumeX } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { useVoiceSettings } from '@/hooks/useVoiceSettings';
import { applyLexiaTheme } from '@/lib/lexiaTheme';
import { calculateStreak, getTodayStr, getStreakMilestoneMessage, getStreakXpBonus } from '@/lib/streakUtils';
import { STORY_REGIONS, getRandomTreasure, TreasureReward, getJumbleMonster } from '@/lib/storyData';
import { sounds } from '@/lib/sounds';

// Game components
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
import { StoryWorldMap } from '@/components/game/StoryWorldMap';
import { TreasureFoundModal } from '@/components/game/TreasureFoundModal';
import { JumbleMonsterModal } from '@/components/game/JumbleMonsterModal';
import { ParentDashboard } from '@/components/game/ParentDashboard';
import { TrophyCollection, checkNewAchievements, ACHIEVEMENTS, AchievementStats } from '@/components/game/TrophyCollection';
import { AchievementUnlockModal } from '@/components/game/AchievementUnlockModal';

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
    treasuresFound: number;
  };
  settings: {
    theme: string;
    audioSpeed: number;
    dyslexiaFont: boolean;
    dailyTimeLimit: number;
    voiceEnabled: boolean;
    soundEffectsEnabled: boolean;
  };
  ownedItems: string[];
  completedQuests: string[];
  completedToday: string[];
  streakFreezeTokens: number;
  xpHistory: Record<string, number>;
  sessionHistory: Record<string, number>;
  unlockedAchievements: string[];
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
    treasuresFound: 0,
  },
  settings: {
    theme: 'default',
    audioSpeed: 0.9,
    dyslexiaFont: true,
    dailyTimeLimit: 30,
    voiceEnabled: true,
    soundEffectsEnabled: true,
  },
  ownedItems: [],
  completedQuests: [],
  completedToday: [],
  streakFreezeTokens: 1,
  xpHistory: {},
  sessionHistory: {},
  unlockedAchievements: [],
};

type GameView = 'home' | 'map' | 'quest' | 'wordBuilder' | 'rhymeHunt' | 'memoryMatch' | 'syllableSort' | 'victory' | 'profile' | 'settings' | 'parent' | 'trophies';
type QuestType = 'sound' | 'word' | 'rhyme' | 'memory' | 'syllable';

const LexiaHome: React.FC = () => {
  const [state, setState] = useStickyState<LexiaGameState>(DEFAULT_STATE, 'lexia_world_v4');
  const [view, setView] = useState<GameView>('home');
  const [questResults, setQuestResults] = useState<any>(null);
  const [currentQuestType, setCurrentQuestType] = useState<QuestType>('sound');
  const [streakMessage, setStreakMessage] = useState<string | null>(null);
  const [foundTreasure, setFoundTreasure] = useState<TreasureReward | null>(null);
  const [showMonster, setShowMonster] = useState(false);
  const [monsterDefeated, setMonsterDefeated] = useState(false);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  const { speak, settings: voiceSettings } = useVoiceSettings();
  
  const currentRegion = STORY_REGIONS[state.progress.currentRegion] || STORY_REGIONS.phoneme_forest;
  const dailyQuests = generateDailyQuests(
    state.progress.wilsonStep,
    state.character.ageGroup,
    state.completedToday
  );
  const streakBonus = getStreakXpBonus(state.progress.streak);

  const playEffect = (effect: string) => {
    // Play sound effect
    if (state.settings.soundEffectsEnabled !== false) {
      switch (effect) {
        case 'tap': sounds.tap(); break;
        case 'success': sounds.success(); break;
        case 'correct': sounds.success(); break;
        case 'error': sounds.error(); break;
        case 'levelUp': sounds.levelUp(); break;
        case 'treasure': sounds.treasure(); break;
        case 'quest': sounds.questComplete(); break;
        case 'streak': sounds.streak(); break;
      }
    }
    // Play haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(effect === 'correct' ? [50, 50, 50] : [30]);
    }
  };

  // Sync sound settings
  useEffect(() => {
    sounds.setEnabled(state.settings.soundEffectsEnabled !== false);
  }, [state.settings.soundEffectsEnabled]);

  // Apply theme on mount
  useEffect(() => {
    applyLexiaTheme(state.settings.theme);
  }, [state.settings.theme]);

  // Get current achievement stats
  const getAchievementStats = (): AchievementStats => ({
    totalXp: state.progress.xp,
    questsCompleted: state.completedQuests.length,
    streak: state.progress.streak,
    longestStreak: state.progress.longestStreak,
    level: state.progress.level,
    daysActive: Object.keys(state.xpHistory || {}).length,
    ownedItems: state.ownedItems.length,
    treasuresFound: state.progress.treasuresFound || 0,
  });

  // Check for new achievements after state changes
  useEffect(() => {
    if (!state.hasOnboarded) return;
    
    const stats = getAchievementStats();
    const newAchievements = checkNewAchievements(stats, state.unlockedAchievements || []);
    
    if (newAchievements.length > 0) {
      // Show the first new achievement
      setNewAchievement(newAchievements[0]);
      
      // Update unlocked achievements
      setState(prev => ({
        ...prev,
        unlockedAchievements: [
          ...(prev.unlockedAchievements || []),
          ...newAchievements.map(a => a.id),
        ],
      }));
    }
  }, [state.progress.xp, state.progress.streak, state.progress.level, state.completedQuests.length]);

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
    const accuracy = results.total > 0 ? (results.correct / results.total) * 100 : 0;
    const accuracyBonus = results.correct === results.total ? 25 : 
                          results.correct >= results.total * 0.8 ? 10 : 0;
    const noHintBonus = results.hintsUsed === 0 ? 15 : 0;
    const streakBonusXp = getStreakXpBonus(state.progress.streak);
    
    // Check for treasure!
    const treasure = getRandomTreasure(accuracy);
    const treasureXp = treasure?.xpBonus || 0;
    
    const xpEarned = baseXp + accuracyBonus + noHintBonus + streakBonusXp + treasureXp;
    const newXp = state.progress.xp + xpEarned;
    const newLevel = Math.floor(newXp / 100) + 1;
    const leveledUp = newLevel > state.progress.level;

    const today = getTodayStr();
    
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        xp: newXp,
        level: newLevel,
        lastActiveDate: today,
      },
      // Track XP history for parent dashboard
      xpHistory: {
        ...prev.xpHistory,
        [today]: (prev.xpHistory[today] || 0) + xpEarned,
      },
      // Track session time (estimate 3 min per quest)
      sessionHistory: {
        ...prev.sessionHistory,
        [today]: (prev.sessionHistory[today] || 0) + 3,
      },
    }));

    if (leveledUp) {
      playEffect('levelUp');
    }

    // Show treasure if found
    if (treasure) {
      setFoundTreasure(treasure);
    }

    setQuestResults({ ...results, xpEarned, streakBonus: streakBonusXp, leveledUp, newLevel, accuracy, treasure });
    setView('victory');
  };

  const handleContinue = () => {
    // Check if should trigger Jumble Monster encounter
    if (questResults?.accuracy >= 80 && Math.random() < 0.3) {
      setMonsterDefeated(true);
      setShowMonster(true);
    }
    setQuestResults(null);
    setFoundTreasure(null);
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

  // Trophy Collection Screen
  if (view === 'trophies') {
    return (
      <TrophyCollection
        stats={getAchievementStats()}
        unlockedAchievements={state.unlockedAchievements || []}
        onClose={() => setView('home')}
        onToggleSound={() => {
          const newEnabled = !state.settings.soundEffectsEnabled;
          setState(prev => ({
            ...prev,
            settings: { ...prev.settings, soundEffectsEnabled: newEnabled },
          }));
          sounds.setEnabled(newEnabled);
        }}
        soundEnabled={state.settings.soundEffectsEnabled !== false}
      />
    );
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

  // Parent Dashboard
  if (view === 'parent') {
    return (
      <ParentDashboard
        childName={state.character.name}
        childAvatar={state.character.avatar}
        progress={state.progress}
        xpHistory={state.xpHistory || {}}
        sessionHistory={state.sessionHistory || {}}
        completedQuests={state.completedQuests}
        settings={{
          dailyTimeLimit: state.settings.dailyTimeLimit || 30,
          voiceEnabled: state.settings.voiceEnabled !== false,
        }}
        onBack={() => setView('home')}
        onUpdateSettings={(updates) => {
          setState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...updates },
          }));
        }}
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

  // Map View - Now with Story World Map
  if (view === 'map') {
    return (
      <div className="min-h-screen bg-background p-4 pb-32 safe-area-inset">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black">Word Wonderland</h1>
          <button
            onClick={() => setView('home')}
            className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95"
            aria-label="Close map"
          >
            ✕
          </button>
        </div>
        
        <StoryWorldMap
          currentRegion={state.progress.currentRegion}
          currentLevel={state.progress.level}
          completedRegions={[]}
          onSelectRegion={(region) => {
            setState(prev => ({
              ...prev,
              progress: { ...prev.progress, currentRegion: region }
            }));
          }}
          onSpeak={speak}
        />
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-background pb-32 safe-area-inset">
      {/* Achievement Unlock Modal */}
      <AchievementUnlockModal
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      {/* Treasure Found Modal */}
      {foundTreasure && (
        <TreasureFoundModal
          treasure={foundTreasure}
          onClose={() => {
            setFoundTreasure(null);
            playEffect('treasure');
          }}
          onSpeak={speak}
        />
      )}

      {/* Jumble Monster Encounter */}
      {showMonster && (
        <JumbleMonsterModal
          encounter={getJumbleMonster(state.progress.level)}
          isDefeated={monsterDefeated}
          onClose={() => setShowMonster(false)}
          onSpeak={speak}
        />
      )}

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

          <div className="flex gap-2">
            <button
              onClick={() => setView('parent')}
              className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Parent dashboard"
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => speak(`Hello ${state.character.name}!`)}
              className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Speak greeting"
            >
              <Volume2 size={20} />
            </button>
          </div>
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
              {currentRegion.icon}
            </span>
            <div>
              <h2 className="text-xl font-bold">
                {currentRegion.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentRegion.description}
              </p>
            </div>
          </div>

          {/* Quest Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleStartQuest('sound')}
              className="min-h-[80px] bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
              aria-label="Start Sound Match quest"
              role="button"
            >
              <span className="text-2xl" aria-hidden="true">🔊</span>
              <span className="text-sm">Sound Match</span>
            </button>
            <button
              onClick={() => handleStartQuest('word')}
              className="min-h-[80px] bg-consonant text-consonant-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-consonant-border"
              aria-label="Start Word Builder quest"
              role="button"
            >
              <span className="text-2xl" aria-hidden="true">🔤</span>
              <span className="text-sm">Word Builder</span>
            </button>
            <button
              onClick={() => handleStartQuest('rhyme')}
              className="min-h-[80px] bg-vowel text-vowel-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-vowel-border"
              aria-label="Start Rhyme Hunt quest"
              role="button"
            >
              <span className="text-2xl" aria-hidden="true">🎵</span>
              <span className="text-sm">Rhyme Hunt</span>
            </button>
            <button
              onClick={() => handleStartQuest('memory')}
              className="min-h-[80px] bg-digraph text-digraph-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-digraph-border"
              aria-label="Start Memory Match quest"
              role="button"
            >
              <span className="text-2xl" aria-hidden="true">🧠</span>
              <span className="text-sm">Memory Match</span>
            </button>
            <button
              onClick={() => handleStartQuest('syllable')}
              className="col-span-2 min-h-[80px] bg-welded text-welded-text rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-welded-border"
              aria-label="Start Syllable Sort quest"
              role="button"
            >
              <span className="text-2xl" aria-hidden="true">👏</span>
              <span className="text-sm">Syllable Sort</span>
            </button>
          </div>
        </motion.div>

        {/* NPC Guide */}
        <NPCGuide
          character="whisper"
          mood="idle"
          message={state.progress.streak > 0 
            ? `Keep your ${state.progress.streak} day streak going!` 
            : "Choose a quest to start your adventure!"
          }
          onSpeak={speak}
          position="bottom-left"
        />
      </main>

      {/* Bottom Nav - iOS safe area */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border px-4 py-4 pb-safe flex justify-around z-50">
        <button
          onClick={() => { playEffect('tap'); setView('home'); }}
          className={`flex flex-col items-center gap-1 min-h-[44px] active:scale-95 transition-transform ${(view as GameView) === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
          aria-label="Go to quests"
        >
          <Award size={22} />
          <span className="text-xs font-bold">Quests</span>
        </button>
        <button
          onClick={() => { playEffect('tap'); setView('trophies'); }}
          className={`flex flex-col items-center gap-1 min-h-[44px] active:scale-95 transition-transform ${(view as GameView) === 'trophies' ? 'text-primary' : 'text-muted-foreground'}`}
          aria-label="View trophies"
        >
          <Trophy size={22} />
          <span className="text-xs font-bold">Trophies</span>
        </button>
        <button
          onClick={() => { playEffect('tap'); setView('map'); }}
          className={`flex flex-col items-center gap-1 min-h-[44px] active:scale-95 transition-transform ${(view as GameView) === 'map' ? 'text-primary' : 'text-muted-foreground'}`}
          aria-label="View world map"
        >
          <Map size={22} />
          <span className="text-xs font-bold">Map</span>
        </button>
        <button
          onClick={() => { playEffect('tap'); setView('profile'); }}
          className={`flex flex-col items-center gap-1 min-h-[44px] active:scale-95 transition-transform ${(view as GameView) === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
          aria-label="View profile"
        >
          <User size={22} />
          <span className="text-xs font-bold">Profile</span>
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
