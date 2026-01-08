import React, { useState, useEffect } from 'react';
import { Headphones, LayoutGrid, School, Zap, BookOpen, Heart } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { CURRICULUM } from '@/lib/curriculum';
import { Onboarding } from '@/components/lexi/Onboarding';
import { StudentDashboard } from '@/components/lexi/StudentDashboard';
import { TutorPortal } from '@/components/lexi/TutorPortal';
import { QuestActivity } from '@/components/lexi/QuestActivity';
import { ParentGate } from '@/components/lexi/ParentGate';
import { RewardModal } from '@/components/lexi/RewardModal';
import { RewardStore } from '@/components/lexi/RewardStore';
import { Confetti } from '@/components/lexi/Confetti';
import { AccessibilityPanel, defaultAccessibilitySettings, AccessibilitySettings } from '@/components/lexi/AccessibilityPanel';
import { Quest } from '@/components/lexi/QuestCard';
import { getDateKey, isNewDay } from '@/lib/dayUtils';
import { sounds } from '@/lib/sounds';

interface GameState {
  hasOnboarded: boolean;
  student: {
    name: string;
    avatar: string;
    step: string;
    level: number;
    xp: number;
    dailyGoal: number;
  };
  streak: number;
  lastActiveDate: string;
  dailyProgress: Record<string, boolean>;
  xpHistory: Record<string, number>;
  ownedItems: string[];
  activePet?: string;
}

const DEFAULT_STATE: GameState = {
  hasOnboarded: false,
  student: { name: 'Explorer', avatar: '🦊', step: '1.1', level: 1, xp: 0, dailyGoal: 50 },
  streak: 0,
  lastActiveDate: '',
  dailyProgress: { t1: false, t2: false, t3: false, h1: false, h2: false, h3: false },
  xpHistory: {},
  ownedItems: [],
  activePet: undefined,
};

const DEFAULT_PROGRESS = { t1: false, t2: false, t3: false, h1: false, h2: false, h3: false };

const Index = () => {
  const [state, setState] = useStickyState<GameState>(DEFAULT_STATE, 'lexiquest_v3_prod');
  const [accessibility, setAccessibility] = useStickyState<AccessibilitySettings>(
    defaultAccessibilitySettings, 
    'lexiquest_accessibility'
  );
  const [tutorNotes, setTutorNotes] = useStickyState<Record<string, string>>({}, 'lexiquest_tutor_notes');
  
  const [view, setView] = useState<'student' | 'tutor' | 'quest'>('student');
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [reward, setReward] = useState<{ points: number; isBoss: boolean } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Daily reset check on mount
  useEffect(() => {
    if (state.hasOnboarded && isNewDay(state.lastActiveDate)) {
      const today = getDateKey();
      const allCompleteYesterday = Object.values(state.dailyProgress).every(Boolean);
      
      setState(prev => ({
        ...prev,
        lastActiveDate: today,
        dailyProgress: { ...DEFAULT_PROGRESS },
        // Keep streak if they completed all quests yesterday, otherwise check if same day
        streak: allCompleteYesterday ? prev.streak : (prev.lastActiveDate === '' ? prev.streak : 0)
      }));
    }
  }, [state.hasOnboarded, state.lastActiveDate]);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    const sizes = { small: '14px', medium: '16px', large: '20px' };
    root.style.fontSize = sizes[accessibility.fontSize];
    
    // Dyslexia font
    if (accessibility.dyslexiaFont) {
      root.style.fontFamily = 'OpenDyslexic, Lexend, system-ui, sans-serif';
    } else {
      root.style.fontFamily = 'Lexend, system-ui, sans-serif';
    }
  }, [accessibility]);

  // Get current step data
  const stepData = CURRICULUM["1"].substeps[state.student.step] || CURRICULUM["1"].substeps["1.1"];

  // Define 3+3 Quests
  const QUESTS: Quest[] = [
    { id: 't1', role: 'tutor', type: 'drill', title: 'Sound Drill', icon: Headphones, points: 5, content: 'Review Sound Cards', data: stepData.tiles },
    { id: 't2', role: 'tutor', type: 'build', title: 'Word Builder', icon: LayoutGrid, points: 10, content: 'Build 3 Words', data: stepData },
    { id: 't3', role: 'tutor', type: 'check', title: 'Tutor Check', icon: School, points: 15, content: 'Lesson Complete', data: null },
    { id: 'h1', role: 'home', type: 'read', title: 'Tap & Read', icon: Zap, points: 5, content: `Read: ${stepData.words[0]}`, data: stepData.words[0] },
    { id: 'h2', role: 'home', type: 'read', title: 'Fluency', icon: BookOpen, points: 10, content: stepData.sentences[0], data: stepData.sentences[0] },
    { id: 'h3', role: 'home', type: 'check', title: 'High Five', icon: Heart, points: 15, content: 'Sign off with Parent', data: null }
  ];

  const handleOnboardingComplete = (data: { name: string; avatar: string; step: string; dailyGoal: number }) => {
    setState(prev => ({
      ...prev,
      hasOnboarded: true,
      lastActiveDate: getDateKey(),
      student: {
        ...prev.student,
        name: data.name,
        avatar: data.avatar,
        step: data.step,
        dailyGoal: data.dailyGoal,
      }
    }));
  };

  const handleQuestSelect = (quest: Quest) => {
    if (state.dailyProgress[quest.id]) return;
    sounds.tap();
    setActiveQuest(quest);
    setView('quest');
  };

  const handleQuestComplete = (quest: Quest) => {
    if (state.dailyProgress[quest.id]) return;

    const newProgress = { ...state.dailyProgress, [quest.id]: true };
    const allComplete = Object.values(newProgress).every(Boolean);
    const newXp = state.student.xp + quest.points;
    const newLevel = Math.floor(newXp / 50) + 1;
    const today = getDateKey();

    // Update XP history for the chart
    const newXpHistory = {
      ...state.xpHistory,
      [today]: (state.xpHistory[today] || 0) + quest.points,
    };

    // Check for level up
    if (newLevel > state.student.level) {
      sounds.levelUp();
    } else {
      sounds.questComplete();
    }

    setState(prev => ({
      ...prev,
      student: { ...prev.student, xp: newXp, level: newLevel },
      dailyProgress: newProgress,
      streak: allComplete ? prev.streak + 1 : prev.streak,
      xpHistory: newXpHistory,
    }));

    setView('student');
    setShowConfetti(true);
    
    setTimeout(() => {
      setReward({ points: quest.points, isBoss: allComplete });
      setShowConfetti(false);
    }, 500);
  };

  const handleSettingsClick = () => {
    sounds.tap();
    setShowGate(true);
  };

  const handleStoreClick = () => {
    sounds.tap();
    setShowStore(true);
  };

  const handlePurchase = (itemId: string, cost: number) => {
    setState(prev => ({
      ...prev,
      student: { ...prev.student, xp: prev.student.xp - cost },
      ownedItems: [...prev.ownedItems, itemId],
      // Auto-equip pet if purchased
      activePet: itemId.startsWith('pet_') ? itemId : prev.activePet,
    }));
  };


  const handleStepChange = (stepId: string) => {
    setState(prev => ({
      ...prev,
      student: { ...prev.student, step: stepId }
    }));
  };

  const handleSaveNote = (stepId: string, note: string) => {
    setTutorNotes(prev => ({ ...prev, [stepId]: note }));
  };

  const handleDeleteNote = (stepId: string) => {
    setTutorNotes(prev => {
      const updated = { ...prev };
      delete updated[stepId];
      return updated;
    });
  };

  // Show onboarding if not completed
  if (!state.hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Render Views
  if (view === 'tutor') {
    return (
      <TutorPortal
        student={state.student}
        streak={state.streak}
        notes={tutorNotes}
        xpHistory={state.xpHistory}
        onClose={() => setView('student')}
        onStepChange={handleStepChange}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />
    );
  }

  if (view === 'quest' && activeQuest) {
    return (
      <QuestActivity
        quest={activeQuest}
        stepData={stepData}
        onComplete={() => handleQuestComplete(activeQuest)}
        onBack={() => setView('student')}
      />
    );
  }

  return (
    <>
      <StudentDashboard
        student={state.student}
        streak={state.streak}
        dailyProgress={state.dailyProgress}
        quests={QUESTS}
        activePet={state.activePet}
        onQuestSelect={handleQuestSelect}
        onSettingsClick={handleSettingsClick}
        onAccessibilityClick={() => { sounds.tap(); setShowAccessibility(true); }}
        onStoreClick={handleStoreClick}
      />

      {/* Parent Gate for Tutor Access */}
      {showGate && (
        <ParentGate
          title="Tutor Access"
          onClose={() => setShowGate(false)}
          onSuccess={() => {
            setShowGate(false);
            setView('tutor');
          }}
        />
      )}

      {/* Accessibility Panel */}
      {showAccessibility && (
        <AccessibilityPanel
          settings={accessibility}
          onChange={setAccessibility}
          onClose={() => setShowAccessibility(false)}
        />
      )}

      {/* Reward Store */}
      {showStore && (
        <RewardStore
          currentXp={state.student.xp}
          ownedItems={state.ownedItems}
          onClose={() => setShowStore(false)}
          onPurchase={handlePurchase}
        />
      )}

      {/* Reward Modal */}
      {reward && (
        <RewardModal
          points={reward.points}
          isBossKill={reward.isBoss}
          onClose={() => setReward(null)}
        />
      )}

      {/* Confetti Effect */}
      {showConfetti && <Confetti />}
    </>
  );
};

export default Index;
