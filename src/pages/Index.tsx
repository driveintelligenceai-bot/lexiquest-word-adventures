import React, { useState } from 'react';
import { Headphones, LayoutGrid, School, Zap, BookOpen, Heart } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { CURRICULUM } from '@/lib/curriculum';
import { StudentDashboard } from '@/components/lexi/StudentDashboard';
import { TutorPortal } from '@/components/lexi/TutorPortal';
import { QuestActivity } from '@/components/lexi/QuestActivity';
import { ParentGate } from '@/components/lexi/ParentGate';
import { RewardModal } from '@/components/lexi/RewardModal';
import { Confetti } from '@/components/lexi/Confetti';
import { Quest } from '@/components/lexi/QuestCard';

interface GameState {
  student: {
    name: string;
    step: string;
    level: number;
    xp: number;
  };
  streak: number;
  dailyProgress: Record<string, boolean>;
}

const DEFAULT_STATE: GameState = {
  student: { name: 'Explorer', step: '1.1', level: 1, xp: 0 },
  streak: 5,
  dailyProgress: { t1: false, t2: false, t3: false, h1: false, h2: false, h3: false }
};

const Index = () => {
  const [state, setState] = useStickyState<GameState>(DEFAULT_STATE, 'lexiquest_v1_prod');
  const [view, setView] = useState<'student' | 'tutor' | 'quest'>('student');
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [reward, setReward] = useState<{ points: number; isBoss: boolean } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Get current step data
  const stepData = CURRICULUM["1"].substeps[state.student.step] || CURRICULUM["1"].substeps["1.1"];

  // Define 3+3 Quests
  const QUESTS: Quest[] = [
    // Morning (Tutor)
    { id: 't1', role: 'tutor', type: 'drill', title: 'Sound Drill', icon: Headphones, points: 5, content: 'Review Sound Cards', data: stepData.tiles },
    { id: 't2', role: 'tutor', type: 'build', title: 'Word Builder', icon: LayoutGrid, points: 10, content: 'Build 3 Words', data: stepData },
    { id: 't3', role: 'tutor', type: 'check', title: 'Tutor Check', icon: School, points: 15, content: 'Lesson Complete', data: null },
    // Evening (Home)
    { id: 'h1', role: 'home', type: 'read', title: 'Tap & Read', icon: Zap, points: 5, content: `Read: ${stepData.words[0]}`, data: stepData.words[0] },
    { id: 'h2', role: 'home', type: 'read', title: 'Fluency', icon: BookOpen, points: 10, content: stepData.sentences[0], data: stepData.sentences[0] },
    { id: 'h3', role: 'home', type: 'check', title: 'High Five', icon: Heart, points: 15, content: 'Sign off with Parent', data: null }
  ];

  const handleQuestSelect = (quest: Quest) => {
    if (state.dailyProgress[quest.id]) return;
    setActiveQuest(quest);
    setView('quest');
  };

  const handleQuestComplete = (quest: Quest) => {
    if (state.dailyProgress[quest.id]) return;

    const newProgress = { ...state.dailyProgress, [quest.id]: true };
    const allComplete = Object.values(newProgress).every(Boolean);
    const newXp = state.student.xp + quest.points;
    const newLevel = Math.floor(newXp / 50) + 1;

    setState(prev => ({
      ...prev,
      student: { ...prev.student, xp: newXp, level: newLevel },
      dailyProgress: newProgress,
      streak: allComplete ? prev.streak + 1 : prev.streak
    }));

    setView('student');
    setShowConfetti(true);
    
    setTimeout(() => {
      setReward({ points: quest.points, isBoss: allComplete });
      setShowConfetti(false);
    }, 500);
  };

  const handleSettingsClick = () => {
    setShowGate(true);
  };

  const handleStepChange = (stepId: string) => {
    setState(prev => ({
      ...prev,
      student: { ...prev.student, step: stepId }
    }));
  };

  // Render Views
  if (view === 'tutor') {
    return (
      <TutorPortal
        student={state.student}
        streak={state.streak}
        onClose={() => setView('student')}
        onStepChange={handleStepChange}
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
        onQuestSelect={handleQuestSelect}
        onSettingsClick={handleSettingsClick}
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
