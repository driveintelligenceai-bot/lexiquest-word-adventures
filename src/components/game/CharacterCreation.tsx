import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Volume2 } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';

interface CharacterData {
  name: string;
  avatar: string;
  skinTone: string;
  outfit: string;
}

interface CharacterCreationProps {
  onComplete: (data: CharacterData) => void;
}

const AVATARS = [
  { id: '🦊', name: 'Fox', desc: 'Clever & Quick' },
  { id: '🦉', name: 'Owl', desc: 'Wise & Patient' },
  { id: '🐰', name: 'Bunny', desc: 'Fast & Friendly' },
  { id: '🐻', name: 'Bear', desc: 'Strong & Brave' },
  { id: '🦄', name: 'Unicorn', desc: 'Magical & Unique' },
  { id: '🐱', name: 'Cat', desc: 'Curious & Smart' },
  { id: '🐶', name: 'Dog', desc: 'Loyal & Kind' },
  { id: '🐼', name: 'Panda', desc: 'Gentle & Fun' },
];

const SKIN_TONES = [
  { id: 'light', color: '#FFE0BD', name: 'Light' },
  { id: 'medium-light', color: '#E5C298', name: 'Medium Light' },
  { id: 'medium', color: '#C49A6C', name: 'Medium' },
  { id: 'medium-dark', color: '#8D5524', name: 'Medium Dark' },
  { id: 'dark', color: '#5C3D2E', name: 'Dark' },
];

const OUTFITS = [
  { id: 'explorer', emoji: '🎒', name: 'Explorer', desc: 'Ready for adventure!' },
  { id: 'wizard', emoji: '🧙', name: 'Wizard', desc: 'Master of words!' },
  { id: 'knight', emoji: '🛡️', name: 'Knight', desc: 'Brave & Bold!' },
  { id: 'fairy', emoji: '🧚', name: 'Fairy', desc: 'Light & Magical!' },
];

const STEPS = [
  { key: 'intro', title: 'Welcome!', whisper: "Hi there! I'm Whisper, your owl guide. Let's create your Word Quester!" },
  { key: 'name', title: "What's Your Name?", whisper: "Every hero needs a name! What should we call you?" },
  { key: 'avatar', title: 'Pick Your Buddy', whisper: "Choose an animal friend to join you on your adventures!" },
  { key: 'outfit', title: 'Choose Your Look', whisper: "What kind of Word Quester do you want to be?" },
  { key: 'ready', title: "You're Ready!", whisper: "Amazing! Your Word Quester is ready for adventure!" },
];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<CharacterData>({
    name: '',
    avatar: '🦊',
    skinTone: 'medium',
    outfit: 'explorer',
  });
  const { speak, playEffect } = useLexiaAudio();

  const currentStep = STEPS[stepIndex];

  useEffect(() => {
    // Speak Whisper's message for each step
    const timer = setTimeout(() => {
      speak(currentStep.whisper);
    }, 500);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const canProceed = () => {
    switch (currentStep.key) {
      case 'intro': return true;
      case 'name': return data.name.trim().length >= 2;
      case 'avatar': return !!data.avatar;
      case 'outfit': return !!data.outfit;
      case 'ready': return true;
      default: return true;
    }
  };

  const handleNext = () => {
    playEffect('tap');
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      playEffect('complete');
      onComplete(data);
    }
  };

  const handleBack = () => {
    playEffect('tap');
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === stepIndex ? 'bg-primary w-8' : i < stepIndex ? 'bg-primary w-2' : 'bg-muted w-2'
            }`}
            initial={false}
            animate={{ width: i === stepIndex ? 32 : 8 }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-md bg-card rounded-[32px] p-8 shadow-xl border-4 border-border"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-accent" size={24} />
            <h1 className="text-2xl font-black text-foreground">{currentStep.title}</h1>
            <button
              onClick={() => speak(currentStep.whisper)}
              className="icon-btn h-8 w-8"
              aria-label="Hear again"
            >
              <Volume2 size={16} />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[280px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {currentStep.key === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Whisper 
                  message={currentStep.whisper}
                  variant="celebrate"
                />
                <p className="text-muted-foreground mt-4">
                  Let's create your hero!
                </p>
              </motion.div>
            )}

            {/* NAME */}
            {currentStep.key === 'name' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center text-6xl mb-4 animate-bounce-slow">
                  {data.avatar}
                </div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Type your name..."
                  className="w-full h-16 text-xl text-center font-bold bg-muted border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                {data.name.length >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-primary font-bold"
                  >
                    Nice to meet you, {data.name}! 🎉
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* AVATAR */}
            {currentStep.key === 'avatar' && (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      onClick={() => {
                        setData({ ...data, avatar: avatar.id });
                        speak(avatar.name);
                        playEffect('tap');
                      }}
                      className={`aspect-square rounded-2xl text-4xl border-4 transition-all ${
                        data.avatar === avatar.id
                          ? 'bg-primary/20 border-primary scale-110 shadow-lg'
                          : 'bg-muted border-border hover:border-primary/30'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {avatar.id}
                    </motion.button>
                  ))}
                </div>
                {data.avatar && (
                  <p className="text-center text-muted-foreground mt-4 text-sm">
                    {AVATARS.find(a => a.id === data.avatar)?.desc}
                  </p>
                )}
              </motion.div>
            )}

            {/* OUTFIT */}
            {currentStep.key === 'outfit' && (
              <motion.div
                key="outfit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {OUTFITS.map((outfit) => (
                  <motion.button
                    key={outfit.id}
                    onClick={() => {
                      setData({ ...data, outfit: outfit.id });
                      speak(outfit.name);
                      playEffect('tap');
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 border-4 transition-all ${
                      data.outfit === outfit.id
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted border-border hover:border-primary/30'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-4xl">{outfit.emoji}</span>
                    <div className="text-left">
                      <div className="font-bold text-foreground">{outfit.name}</div>
                      <div className="text-sm text-muted-foreground">{outfit.desc}</div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* READY */}
            {currentStep.key === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <motion.div
                  className="text-8xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {data.avatar}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black text-foreground">{data.name}</h2>
                  <p className="text-muted-foreground">
                    The {OUTFITS.find(o => o.id === data.outfit)?.name}
                  </p>
                </div>
                <Whisper
                  message="Your adventure begins now!"
                  variant="celebrate"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8 w-full max-w-md">
        {stepIndex > 0 && (
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
          {currentStep.key === 'ready' ? "Begin Adventure!" : 'Next'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
