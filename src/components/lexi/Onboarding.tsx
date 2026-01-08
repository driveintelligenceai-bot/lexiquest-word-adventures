import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Star, Volume2 } from 'lucide-react';
import { CURRICULUM } from '@/lib/curriculum';
import { speak } from '@/lib/speech';

interface OnboardingData {
  name: string;
  avatar: string;
  step: string;
  dailyGoal: number;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const AVATARS = [
  { id: '🦊', name: 'Fox', color: 'bg-orange-100 border-orange-300' },
  { id: '🦉', name: 'Owl', color: 'bg-amber-100 border-amber-300' },
  { id: '🐰', name: 'Bunny', color: 'bg-pink-100 border-pink-300' },
  { id: '🐻', name: 'Bear', color: 'bg-yellow-100 border-yellow-300' },
  { id: '🦄', name: 'Unicorn', color: 'bg-purple-100 border-purple-300' },
  { id: '🐱', name: 'Cat', color: 'bg-blue-100 border-blue-300' },
  { id: '🐶', name: 'Dog', color: 'bg-green-100 border-green-300' },
  { id: '🐼', name: 'Panda', color: 'bg-slate-100 border-slate-300' },
];

const DAILY_GOALS = [
  { value: 30, label: '30 XP', description: 'Easy & Fun' },
  { value: 50, label: '50 XP', description: 'Regular' },
  { value: 75, label: '75 XP', description: 'Challenge' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    avatar: '🦊',
    step: '1.1',
    dailyGoal: 50,
  });

  const steps = [
    { title: "Let's Meet!", subtitle: "What's your name?" },
    { title: 'Pick Your Buddy!', subtitle: 'Choose a friend to learn with' },
    { title: 'Starting Point', subtitle: 'Where should we begin?' },
    { title: 'Daily Goal', subtitle: 'How much do you want to learn?' },
  ];

  const canProceed = () => {
    switch (step) {
      case 0: return data.name.trim().length >= 2;
      case 1: return !!data.avatar;
      case 2: return !!data.step;
      case 3: return !!data.dailyGoal;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      speak(steps[step + 1].title);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const substeps = Object.values(CURRICULUM["1"].substeps);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === step ? 'bg-primary w-8' : i < step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-md bg-card rounded-[32px] p-8 shadow-xl border-4 border-border animate-zoom-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-accent" size={24} />
            <h1 className="text-2xl font-black text-foreground">{steps[step].title}</h1>
            <button onClick={() => speak(steps[step].title)} className="icon-btn h-8 w-8">
              <Volume2 size={16} />
            </button>
          </div>
          <p className="text-muted-foreground font-medium">{steps[step].subtitle}</p>
        </div>

        {/* Step Content */}
        <div className="min-h-[200px] flex flex-col justify-center">
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center text-6xl mb-4 animate-bounce-slow">{data.avatar}</div>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Type your name..."
                className="w-full h-14 text-xl text-center font-bold bg-muted border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              {data.name && (
                <p className="text-center text-primary font-bold animate-fade-in">
                  Nice to meet you, {data.name}! 🎉
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => {
                    setData({ ...data, avatar: avatar.id });
                    speak(avatar.name);
                  }}
                  className={`aspect-square rounded-2xl text-4xl border-4 transition-all active:scale-95 ${
                    data.avatar === avatar.id
                      ? `${avatar.color} scale-110 shadow-lg`
                      : 'bg-muted border-border hover:border-primary/30'
                  }`}
                >
                  {avatar.id}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {substeps.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setData({ ...data, step: sub.id });
                    speak(sub.title);
                  }}
                  className={`w-full p-4 rounded-xl text-left flex justify-between items-center transition-all active:scale-[0.98] ${
                    data.step === sub.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted border border-border hover:bg-muted/80'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{sub.title}</div>
                    <div className="text-xs opacity-70">{sub.words.length} words</div>
                  </div>
                  {data.step === sub.id && <Star className="fill-current" size={20} />}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {DAILY_GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => {
                    setData({ ...data, dailyGoal: goal.value });
                    speak(goal.description);
                  }}
                  className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] ${
                    data.dailyGoal === goal.value
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted border border-border hover:bg-muted/80'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-2xl font-black">{goal.label}</div>
                    <div className="text-sm opacity-70">{goal.description}</div>
                  </div>
                  {data.dailyGoal === goal.value && (
                    <Sparkles className="fill-current" size={24} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8 w-full max-w-md">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="h-14 px-6 bg-muted text-muted-foreground font-bold rounded-2xl flex items-center gap-2 hover:bg-muted/80 transition-colors active:scale-95"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 h-14 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
            canProceed()
              ? 'bg-primary text-primary-foreground shadow-[0_4px_0] shadow-primary/50 active:translate-y-1 active:shadow-none'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {step === 3 ? "Let's Go!" : 'Next'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
