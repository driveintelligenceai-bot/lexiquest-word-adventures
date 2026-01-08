import React, { useState } from 'react';
import { 
  Headphones, Settings, School, CheckCircle, 
  Star, BookOpen 
} from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { Dashboard } from '@/components/Dashboard';
import { QuestView } from '@/components/QuestView';
import { RewardModal } from '@/components/RewardModal';
import { Quest } from '@/components/QuestCard';

// Wilson Step 1.1 Quest Configuration (3+3)
const QUESTS: Quest[] = [
  // Tutor Quests (Morning)
  { 
    id: 't1', 
    role: 'tutor', 
    type: 'drill', 
    title: 'Sound Drill', 
    icon: Headphones, 
    points: 1, 
    content: 'Listen and tap each sound' 
  },
  { 
    id: 't2', 
    role: 'tutor', 
    type: 'build', 
    title: 'Word Builder', 
    icon: Settings, 
    points: 1, 
    content: 'Build the word MAP',
    target: 'map' 
  },
  { 
    id: 't3', 
    role: 'tutor', 
    type: 'check', 
    title: 'Tutor Check', 
    icon: School, 
    points: 3, 
    content: 'Show your tutor what you learned' 
  },
  
  // Home Quests (Evening)
  { 
    id: 'h1', 
    role: 'home', 
    type: 'drill', 
    title: 'Finger Tapping', 
    icon: CheckCircle, 
    points: 1, 
    content: 'Tap each sound with your fingers' 
  },
  { 
    id: 'h2', 
    role: 'home', 
    type: 'build', 
    title: 'Spelling Bee', 
    icon: Star, 
    points: 1, 
    content: 'Spell the word CAT',
    target: 'cat' 
  },
  { 
    id: 'h3', 
    role: 'home', 
    type: 'check', 
    title: 'Story Time', 
    icon: BookOpen, 
    points: 3, 
    content: 'Read a story with your parent' 
  },
];

interface GameState {
  student: {
    name: string;
    step: string;
  };
  streak: number;
  points: number;
  dailyQuests: Record<string, boolean>;
}

const DEFAULT_STATE: GameState = {
  student: { name: 'Explorer', step: '1.1' },
  streak: 4,
  points: 0,
  dailyQuests: { t1: false, t2: false, t3: false, h1: false, h2: false, h3: false },
};

const Index = () => {
  const [state, setState] = useStickyState<GameState>(DEFAULT_STATE, 'lexiquest_v1');
  const [view, setView] = useState<'dashboard' | 'quest'>('dashboard');
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [reward, setReward] = useState<{ points: number; isBoss: boolean } | null>(null);

  const handleQuestSelect = (quest: Quest) => {
    if (state.dailyQuests[quest.id]) return;
    setActiveQuest(quest);
    setView('quest');
  };

  const handleQuestComplete = (quest: Quest) => {
    if (state.dailyQuests[quest.id]) return;

    const newQuests = { ...state.dailyQuests, [quest.id]: true };
    const allComplete = Object.values(newQuests).every(Boolean);
    const newPoints = state.points + quest.points;
    
    setState(prev => ({
      ...prev,
      dailyQuests: newQuests,
      points: newPoints,
      streak: allComplete ? prev.streak + 1 : prev.streak,
    }));

    setView('dashboard');
    
    // Show reward after a brief delay
    setTimeout(() => {
      setReward({ 
        points: quest.points, 
        isBoss: allComplete || newPoints >= 10 
      });
    }, 300);
  };

  return (
    <>
      {view === 'dashboard' ? (
        <Dashboard
          studentName={state.student.name}
          step={state.student.step}
          streak={state.streak}
          points={state.points}
          dailyQuests={state.dailyQuests}
          quests={QUESTS}
          onQuestSelect={handleQuestSelect}
        />
      ) : activeQuest ? (
        <QuestView
          quest={activeQuest}
          onComplete={() => handleQuestComplete(activeQuest)}
          onBack={() => setView('dashboard')}
        />
      ) : null}

      {/* Reward Modal */}
      {reward && (
        <RewardModal
          points={reward.points}
          isBossKill={reward.isBoss}
          onClose={() => setReward(null)}
        />
      )}
    </>
  );
};

export default Index;
