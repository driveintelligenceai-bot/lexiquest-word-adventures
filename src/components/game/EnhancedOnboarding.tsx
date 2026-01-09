import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Volume2, Settings, Star } from 'lucide-react';
import { useVoiceSettings } from '@/hooks/useVoiceSettings';
import { VoiceSettingsModal } from './VoiceSettingsModal';
import { Confetti } from '@/components/lexi/Confetti';

interface CharacterData {
  name: string;
  avatar: string;
  ageGroup: 'young' | 'older';
  outfit: string;
  voiceEnabled: boolean;
}

interface EnhancedOnboardingProps {
  onComplete: (data: CharacterData) => void;
}

const AVATARS = [
  { id: '🦊', name: 'Whiskers', desc: 'The Clever Fox' },
  { id: '🦉', name: 'Hoot', desc: 'The Wise Owl' },
  { id: '🐰', name: 'Bounce', desc: 'The Swift Bunny' },
  { id: '🐻', name: 'Bramble', desc: 'The Brave Bear' },
  { id: '🦄', name: 'Sparkle', desc: 'The Magic Unicorn' },
  { id: '🐱', name: 'Whisper', desc: 'The Curious Cat' },
  { id: '🐶', name: 'Buddy', desc: 'The Loyal Pup' },
  { id: '🐼', name: 'Bamboo', desc: 'The Gentle Panda' },
];

const OUTFITS = [
  { id: 'explorer', emoji: '🎒', name: 'Explorer', desc: 'Ready for adventure!' },
  { id: 'wizard', emoji: '🧙', name: 'Word Wizard', desc: 'Master of letters!' },
  { id: 'knight', emoji: '🛡️', name: 'Reading Knight', desc: 'Brave & Bold!' },
  { id: 'fairy', emoji: '🧚', name: 'Story Fairy', desc: 'Light & Magical!' },
];

const AGE_GROUPS = [
  { 
    id: 'young', 
    emoji: '🐣', 
    range: '6-8', 
    name: 'Little Learner',
    desc: 'Simple words & sounds',
    features: ['CVC words', 'Sound matching', 'Picture clues']
  },
  { 
    id: 'older', 
    emoji: '🦊', 
    range: '9-12', 
    name: 'Word Explorer',
    desc: 'Bigger challenges',
    features: ['Multi-syllable', 'Rhymes & Stories', 'Speed rounds']
  },
];

const STEPS = [
  { key: 'welcome', title: 'Word Wonderland', whisper: "Welcome to Word Wonderland! I'm Whisper the Owl, your guide on this magical adventure!" },
  { key: 'voice', title: 'Meet Your Voice', whisper: "Let's set up my voice so I can read to you! Press play to hear me!" },
  { key: 'age', title: 'How Old Are You?', whisper: "Are you a little learner or a word explorer? This helps me pick the best adventures for you!" },
  { key: 'name', title: "What's Your Name?", whisper: "Every hero needs a name! What should I call you, adventurer?" },
  { key: 'avatar', title: 'Pick Your Buddy', whisper: "Choose an animal friend to join you! They'll be with you on every quest!" },
  { key: 'outfit', title: 'Choose Your Style', whisper: "What kind of word hero do you want to be? Pick your adventure style!" },
  { key: 'ready', title: 'Adventure Awaits!', whisper: "You're all set! The Jumble Monster has stolen all the words from Word Wonderland. Let's get them back!" },
];

export const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [data, setData] = useState<CharacterData>({
    name: '',
    avatar: '🦊',
    ageGroup: 'young',
    outfit: 'explorer',
    voiceEnabled: true,
  });

  const {
    settings: voiceSettings,
    voices,
    selectedVoice,
    speak,
    updateSettings,
    selectVoice,
    previewVoice,
  } = useVoiceSettings();

  const currentStep = STEPS[stepIndex];

  // Speak Whisper's message for each step
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(currentStep.whisper);
    }, 600);
    return () => clearTimeout(timer);
  }, [stepIndex, speak, currentStep.whisper]);

  const canProceed = useCallback(() => {
    switch (currentStep.key) {
      case 'welcome': return true;
      case 'voice': return true;
      case 'age': return !!data.ageGroup;
      case 'name': return data.name.trim().length >= 2;
      case 'avatar': return !!data.avatar;
      case 'outfit': return !!data.outfit;
      case 'ready': return true;
      default: return true;
    }
  }, [currentStep.key, data]);

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setShowConfetti(true);
      speak(`Let's go, ${data.name}! Your adventure begins!`);
      setTimeout(() => {
        onComplete({
          ...data,
          voiceEnabled: voiceSettings.enabled,
        });
      }, 1500);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  // Background - brand blue with dynamic viewport height for mobile
  return (
    <div 
      className="min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6"
      style={{ 
        paddingTop: 'max(env(safe-area-inset-top), 16px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
        background: stepIndex === STEPS.length - 1
          ? 'linear-gradient(135deg, hsl(215 75% 48%) 0%, hsl(24 95% 53%) 100%)'
          : 'linear-gradient(135deg, hsl(215 70% 52%) 0%, hsl(215 75% 40%) 100%)',
      }}
    >
      {showConfetti && <Confetti />}

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: -50,
              rotate: 0 
            }}
            animate={{ 
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
              rotate: 360 
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              delay: i * 1.5 
            }}
          >
            {['✨', '⭐', '🌟', '💫', '🌸', '🍀', '🌈', '🦋'][i]}
          </motion.div>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mb-4 sm:mb-6 z-10">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 sm:h-3 rounded-full transition-all ${
              i === stepIndex 
                ? 'bg-white w-6 sm:w-8' 
                : i < stepIndex 
                  ? 'bg-white/80 w-2 sm:w-3' 
                  : 'bg-white/30 w-2 sm:w-3'
            }`}
            initial={false}
            animate={{ width: i === stepIndex ? 32 : 12 }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md sm:max-w-lg bg-card rounded-[32px] p-6 sm:p-8 shadow-2xl border-4 border-white/20 backdrop-blur-sm z-10"
      >
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-accent" size={24} />
            <h1 className="text-xl sm:text-2xl font-black text-foreground">{currentStep.title}</h1>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => speak(currentStep.whisper)}
              className="icon-btn h-10 w-10"
              aria-label="Hear again"
            >
              <Volume2 size={18} />
            </button>
            {currentStep.key === 'voice' && (
              <button
                onClick={() => setShowVoiceModal(true)}
                className="icon-btn h-10 w-10"
                aria-label="Voice settings"
              >
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[280px] sm:min-h-[320px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* WELCOME */}
            {currentStep.key === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4"
              >
                <motion.div
                  className="text-8xl sm:text-9xl"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🦉
                </motion.div>
                <div className="bg-accent/10 p-4 rounded-2xl border-2 border-accent/20">
                  <p className="text-foreground font-medium">
                    I'm <span className="font-black text-accent">Whisper the Owl</span>, 
                    and together we'll save Word Wonderland from the 
                    <span className="font-black text-destructive"> Jumble Monster!</span>
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  {['📚', '🏰', '🌲', '✨', '🎯'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VOICE SETUP */}
            {currentStep.key === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="text-center text-6xl mb-4 animate-bounce-slow">🎤</div>
                
                {/* Voice toggle */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔊</span>
                    <div>
                      <div className="font-bold">Voice Reading</div>
                      <div className="text-sm text-muted-foreground">
                        Hear me read to you!
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ enabled: !voiceSettings.enabled })}
                    className={`w-14 h-8 rounded-full transition-all ${
                      voiceSettings.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <motion.div
                      className="w-6 h-6 bg-white rounded-full shadow-md"
                      animate={{ x: voiceSettings.enabled ? 28 : 4 }}
                    />
                  </button>
                </div>

                {/* Test voice button */}
                <button
                  onClick={() => speak("Hello! I'm your reading friend! Let's have fun learning together!")}
                  className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Volume2 size={20} />
                  Test My Voice!
                </button>

                {/* Voice settings link */}
                <button
                  onClick={() => setShowVoiceModal(true)}
                  className="w-full p-4 bg-muted rounded-2xl text-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  ⚙️ Change voice, speed & more
                </button>
              </motion.div>
            )}

            {/* AGE SELECTION */}
            {currentStep.key === 'age' && (
              <motion.div
                key="age"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {AGE_GROUPS.map((group) => (
                  <motion.button
                    key={group.id}
                    onClick={() => {
                      setData({ ...data, ageGroup: group.id as 'young' | 'older' });
                      speak(group.name);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 border-4 transition-all ${
                      data.ageGroup === group.id
                        ? 'bg-primary/20 border-primary scale-[1.02]'
                        : 'bg-muted border-border hover:border-primary/30'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-5xl">{group.emoji}</span>
                    <div className="text-left flex-1">
                      <div className="font-black text-lg">{group.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Ages {group.range} • {group.desc}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {group.features.map((f, i) => (
                          <span 
                            key={i} 
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    {data.ageGroup === group.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-primary"
                      >
                        <Star className="fill-primary" size={24} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* NAME INPUT */}
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
                  className="w-full h-16 text-xl text-center font-bold bg-muted border-4 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                  style={{ fontSize: '16px' }}
                  autoFocus
                  maxLength={20}
                  aria-label="Enter your name"
                />
                {data.name.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-welded/30 rounded-2xl border-2 border-welded-border"
                  >
                    <span className="text-2xl">🎉</span>
                    <p className="text-primary font-bold mt-2">
                      Welcome, {data.name}!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* AVATAR SELECTION */}
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
                  <motion.p 
                    key={data.avatar}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground mt-4 text-sm"
                  >
                    <span className="font-bold text-foreground">
                      {AVATARS.find(a => a.id === data.avatar)?.name}
                    </span>
                    {' - '}
                    {AVATARS.find(a => a.id === data.avatar)?.desc}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* OUTFIT SELECTION */}
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

            {/* READY TO START */}
            {currentStep.key === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4"
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
                
                {/* Story intro */}
                <div className="bg-accent/10 p-4 rounded-2xl border-2 border-accent/20">
                  <p className="text-sm">
                    The <span className="font-bold text-destructive">Jumble Monster</span> has 
                    scrambled all the words in <span className="font-bold">Word Wonderland</span>! 
                    Only <span className="font-bold text-primary">you</span> can save them by 
                    solving word puzzles across magical lands!
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {['🏰', '🌲', '🌊', '🏔️', '✨'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ delay: i * 0.15, repeat: Infinity, duration: 1.2 }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-4 mt-6 w-full max-w-md sm:max-w-lg z-10">
        {stepIndex > 0 && (
          <button
            onClick={handleBack}
            className="h-14 px-6 bg-white/20 text-white font-bold rounded-2xl flex items-center gap-2 backdrop-blur-sm hover:bg-white/30 transition-colors active:scale-95"
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
              ? 'bg-white text-foreground shadow-[0_4px_0] shadow-white/50 active:translate-y-1 active:shadow-none'
              : 'bg-white/30 text-white/50 cursor-not-allowed'
          }`}
        >
          {currentStep.key === 'ready' ? "Begin Adventure! 🚀" : 'Next'}
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        settings={voiceSettings}
        voices={voices}
        selectedVoice={selectedVoice}
        onUpdateSettings={updateSettings}
        onSelectVoice={selectVoice}
        onPreview={previewVoice}
      />
    </div>
  );
};
