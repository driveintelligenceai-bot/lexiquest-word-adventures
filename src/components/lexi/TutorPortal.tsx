import React from 'react';
import { X, GraduationCap, CheckCircle, Lock, Zap, Flame } from 'lucide-react';
import { LexiPet } from './LexiPet';
import { CURRICULUM } from '@/lib/curriculum';

interface StudentData {
  name: string;
  step: string;
  level: number;
  xp: number;
}

interface TutorPortalProps {
  student: StudentData;
  streak: number;
  onClose: () => void;
  onStepChange: (stepId: string) => void;
}

export const TutorPortal: React.FC<TutorPortalProps> = ({
  student,
  streak,
  onClose,
  onStepChange
}) => {
  const stepOneSubsteps = Object.values(CURRICULUM["1"].substeps);

  return (
    <div className="min-h-screen bg-tutor-bg text-primary-foreground font-sans p-6 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="text-accent" />
          Tutor Portal
        </h1>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <X />
        </button>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Student Summary Card */}
        <div className="tutor-card p-6 flex items-center gap-6">
          <LexiPet level={student.level} size="lg" />
          <div className="flex-1">
            <div className="text-2xl font-bold">{student.name}</div>
            <div className="text-muted-foreground font-mono text-sm">
              Step {student.step}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="flex items-center gap-2 justify-end">
              <Zap className="text-accent fill-accent" size={18} />
              <span className="font-bold">{student.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Flame className="text-orange-400 fill-orange-400" size={18} />
              <span className="font-bold">{streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Curriculum Assignment */}
        <div className="tutor-card p-6">
          <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
            Curriculum Assignment
          </h2>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {stepOneSubsteps.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onStepChange(sub.id)}
                className={`w-full p-4 rounded-xl text-left flex justify-between items-center transition-all ${
                  student.step === sub.id
                    ? 'bg-primary border border-primary/50 shadow-lg'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="font-bold text-sm md:text-base">{sub.title}</div>
                  <div className="text-xs opacity-60">
                    {sub.words.length} Words • {sub.sentences.length} Sentences
                  </div>
                </div>
                {student.step === sub.id && (
                  <CheckCircle size={20} className="text-primary-foreground" />
                )}
              </button>
            ))}

            {/* Locked Future Steps */}
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <div
                key={n}
                className="p-4 rounded-xl border border-white/5 bg-black/20 opacity-40 flex items-center justify-between"
              >
                <span className="font-bold text-sm">
                  Step {n}: {CURRICULUM[n.toString()].title}
                </span>
                <Lock size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="tutor-card p-6">
          <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
            Progress Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl text-center">
              <div className="text-3xl font-black text-accent">{student.xp}</div>
              <div className="text-xs text-muted-foreground uppercase">Total XP</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl text-center">
              <div className="text-3xl font-black text-orange-400">{streak}</div>
              <div className="text-xs text-muted-foreground uppercase">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
