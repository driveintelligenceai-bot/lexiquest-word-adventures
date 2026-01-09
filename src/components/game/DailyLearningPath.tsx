import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Target, Link, Ear, Puzzle, Brain, 
  CheckCircle2, Circle, Lock, Sparkles, ArrowRight,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * DailyLearningPath - Guided Daily Learning Sequence
 * 
 * Research-backed learning order for dyslexic students:
 * 1. Word Wall (Core) - See and hear words first
 * 2. Sound Practice - Reinforce phoneme awareness
 * 3. Blending - Combine sounds into words
 * 4. Letter Flip - Address reversal confusion
 * 5. Supporting Games - Reinforcement activities
 * 
 * Wilson Reading System recommends this sequence for maximum retention.
 */

interface DailyLearningPathProps {
  completedToday: string[];
  currentWilsonStep: number;
  onStartActivity: (activityType: string) => void;
  onSpeak: (text: string) => void;
  onClose: () => void;
}

interface PathStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: string;
  isCore: boolean;
  duration: string;
}

const LEARNING_PATH: PathStep[] = [
  {
    id: 'wordWall',
    name: 'Word Wall',
    description: 'See and hear today\'s words',
    icon: <BookOpen size={24} />,
    type: 'wordWall',
    isCore: true,
    duration: '5-8 min',
  },
  {
    id: 'phoneme',
    name: 'Sound Practice',
    description: 'Learn letter sounds',
    icon: <Ear size={24} />,
    type: 'phoneme',
    isCore: true,
    duration: '3-5 min',
  },
  {
    id: 'blending',
    name: 'Blending',
    description: 'Combine sounds into words',
    icon: <Link size={24} />,
    type: 'blending',
    isCore: true,
    duration: '4-6 min',
  },
  {
    id: 'letterFlip',
    name: 'Letter Flip',
    description: 'Practice b/d/p/q differences',
    icon: <Puzzle size={24} />,
    type: 'letterFlip',
    isCore: false,
    duration: '3-4 min',
  },
  {
    id: 'sound',
    name: 'Sound Match',
    description: 'Match sounds to pictures',
    icon: <Target size={24} />,
    type: 'sound',
    isCore: false,
    duration: '3-5 min',
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Build word memory',
    icon: <Brain size={24} />,
    type: 'memory',
    isCore: false,
    duration: '3-5 min',
  },
];

export const DailyLearningPath: React.FC<DailyLearningPathProps> = ({
  completedToday,
  currentWilsonStep,
  onStartActivity,
  onSpeak,
  onClose,
}) => {
  // Find current step (first uncompleted)
  const currentStepIndex = LEARNING_PATH.findIndex(
    step => !completedToday.includes(step.id)
  );
  
  // Calculate progress
  const completedCount = LEARNING_PATH.filter(
    step => completedToday.includes(step.id)
  ).length;
  const progressPercent = (completedCount / LEARNING_PATH.length) * 100;
  
  const handleStartStep = (step: PathStep, index: number) => {
    // Can only start current or earlier steps
    if (index > currentStepIndex && currentStepIndex !== -1) {
      onSpeak(`Complete ${LEARNING_PATH[currentStepIndex].name} first!`);
      return;
    }
    
    onSpeak(`Starting ${step.name}!`);
    onClose();
    onStartActivity(step.type);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-3xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-xl border-2 border-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="text-primary" size={32} />
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">Today's Learning Path</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Wilson Step {currentWilsonStep} • {completedCount}/{LEARNING_PATH.length} completed
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Learning Path Steps */}
        <div className="space-y-3">
          {LEARNING_PATH.map((step, index) => {
            const isCompleted = completedToday.includes(step.id);
            const isCurrent = index === currentStepIndex;
            const isLocked = index > currentStepIndex && currentStepIndex !== -1;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleStartStep(step, index)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    isCompleted
                      ? 'bg-primary/10 border-primary/30'
                      : isCurrent
                        ? 'bg-accent/10 border-accent shadow-lg'
                        : isLocked
                          ? 'bg-muted/50 border-border/50 opacity-50'
                          : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  {/* Step Number / Status */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : isLocked ? (
                      <Lock size={16} />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        isCompleted ? 'text-primary' : 'text-foreground'
                      }`}>
                        {step.name}
                      </span>
                      {step.isCore && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                          CORE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {step.description}
                    </p>
                  </div>

                  {/* Duration & Icon */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{step.duration}</span>
                    <div className={`${
                      isCompleted ? 'text-primary' : isCurrent ? 'text-accent' : 'text-muted-foreground'
                    }`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Current indicator */}
                  {isCurrent && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <ArrowRight className="text-accent" size={20} />
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-6 space-y-3">
          {currentStepIndex !== -1 && (
            <Button 
              className="w-full h-14 text-lg"
              onClick={() => handleStartStep(LEARNING_PATH[currentStepIndex], currentStepIndex)}
            >
              Start {LEARNING_PATH[currentStepIndex].name}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          )}
          
          {currentStepIndex === -1 && (
            <div className="text-center py-4">
              <motion.div
                className="text-4xl mb-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🎉
              </motion.div>
              <p className="font-bold text-primary">All Done for Today!</p>
              <p className="text-sm text-muted-foreground">Great learning session!</p>
            </div>
          )}
          
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
