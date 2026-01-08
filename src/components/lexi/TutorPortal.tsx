import React from 'react';
import { X, GraduationCap, CheckCircle, Lock, Zap, Flame } from 'lucide-react';
import { LexiPet } from './LexiPet';
import { TutorNotes } from './TutorNotes';
import { WeeklyXpChart } from './WeeklyXpChart';
import { CURRICULUM } from '@/lib/curriculum';

interface StudentData {
  name: string;
  avatar: string;
  step: string;
  level: number;
  xp: number;
}

interface TutorPortalProps {
  student: StudentData;
  streak: number;
  notes: Record<string, string>;
  xpHistory: Record<string, number>;
  onClose: () => void;
  onStepChange: (stepId: string) => void;
  onSaveNote: (stepId: string, note: string) => void;
  onDeleteNote: (stepId: string) => void;
}

export const TutorPortal: React.FC<TutorPortalProps> = ({
  student,
  streak,
  notes,
  xpHistory,
  onClose,
  onStepChange,
  onSaveNote,
  onDeleteNote,
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
          className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary-foreground hover:bg-primary/20 transition-colors active:scale-95"
          aria-label="Close tutor portal"
        >
          <X size={22} />
        </button>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Student Summary Card */}
        <div className="tutor-card p-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-card/10 rounded-2xl flex items-center justify-center text-5xl border-2 border-accent/20 animate-bounce-slow">
            {student.avatar || '🦊'}
          </div>
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
              <Flame className="text-accent fill-accent" size={18} />
              <span className="font-bold">{streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Tutor Notes Panel */}
        <TutorNotes
          notes={notes}
          currentStep={student.step}
          onSave={onSaveNote}
          onDelete={onDeleteNote}
        />

        {/* Weekly XP Chart */}
        <WeeklyXpChart xpHistory={xpHistory} />

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
                className={`w-full p-4 rounded-xl text-left flex justify-between items-center transition-all active:scale-[0.98] ${
                  student.step === sub.id
                    ? 'bg-primary border border-primary/50 shadow-lg'
                    : 'bg-tutor-card border border-primary/10 hover:bg-tutor-card/80'
                }`}
              >
                <div>
                  <div className="font-bold text-sm md:text-base">{sub.title}</div>
                  <div className="text-xs opacity-60">
                    {sub.words.length} Words • {sub.sentences.length} Sentences
                    {notes[sub.id] && <span className="ml-2 text-accent">📝</span>}
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
                className="p-4 rounded-xl border border-primary/10 bg-tutor-card/40 opacity-40 flex items-center justify-between"
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
            <div className="bg-tutor-card/60 p-4 rounded-xl text-center border border-primary/10">
              <div className="text-3xl font-black text-accent">{student.xp}</div>
              <div className="text-xs text-muted-foreground uppercase">Total XP</div>
            </div>
            <div className="bg-tutor-card/60 p-4 rounded-xl text-center border border-primary/10">
              <div className="text-3xl font-black text-primary">{streak}</div>
              <div className="text-xs text-muted-foreground uppercase">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
