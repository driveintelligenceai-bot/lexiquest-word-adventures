import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Quest } from './QuestCard';
import { AudioButton } from './AudioButton';
import { WordBuilder } from './WordBuilder';
import { ParentGate } from './ParentGate';

interface QuestViewProps {
  quest: Quest;
  onComplete: () => void;
  onBack: () => void;
}

export const QuestView: React.FC<QuestViewProps> = ({ quest, onComplete, onBack }) => {
  const [showGate, setShowGate] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVerify = () => {
    setShowGate(true);
  };

  const handleGateSuccess = () => {
    setShowGate(false);
    onComplete();
  };

  const handleDrillComplete = () => {
    // For drill type, we simulate tapping sounds
    if (progress < 3) {
      setProgress(progress + 1);
      const sounds = ['mmmm', 'aaaa', 'pppp', 'tttt', 'ssss'];
      const utterance = new SpeechSynthesisUtterance(sounds[progress]);
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
    if (progress >= 2) {
      setTimeout(onComplete, 500);
    }
  };

  const IconComponent = quest.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-border bg-card">
        <button
          onClick={onBack}
          className="p-3 bg-muted rounded-full text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: quest.type === 'drill' ? `${((progress + 1) / 3) * 100}%` : '50%' }}
          />
        </div>
        
        <AudioButton text={quest.content} size={24} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Quest Icon & Title */}
        <div className="mb-8 bg-card p-6 rounded-3xl shadow-sm border-2 border-border">
          <IconComponent 
            size={48} 
            className={quest.role === 'tutor' ? 'text-consonant-text' : 'text-vowel-text'} 
          />
          <h2 className="text-2xl font-black text-foreground mt-2">{quest.title}</h2>
        </div>

        {/* Quest Content */}
        {quest.type === 'build' && quest.target ? (
          <WordBuilder target={quest.target} onComplete={onComplete} />
        ) : quest.type === 'drill' ? (
          <div className="w-full max-w-md">
            <p className="text-xl text-muted-foreground mb-8 font-medium">
              Tap each sound card below
            </p>
            
            {/* Sound Cards */}
            <div className="flex justify-center gap-4 mb-8">
              {['m', 'a', 'p'].map((letter, i) => (
                <button
                  key={letter}
                  onClick={handleDrillComplete}
                  className={`w-20 h-20 text-4xl font-black rounded-2xl border-b-4 transition-all ${
                    i <= progress 
                      ? 'bg-welded border-welded-border text-welded-text scale-95' 
                      : ['a', 'e', 'i', 'o', 'u'].includes(letter)
                        ? 'bg-vowel border-vowel-border text-vowel-text'
                        : 'bg-consonant border-consonant-border text-consonant-text'
                  } active:scale-90`}
                >
                  {letter}
                </button>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {progress + 1} of 3 sounds
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <p className="text-xl text-muted-foreground mb-12 font-medium">
              "{quest.content}"
            </p>
            
            <button
              onClick={handleVerify}
              className="w-full bg-primary text-primary-foreground text-xl font-black py-6 rounded-2xl shadow-[0_6px_0] shadow-primary/50 active:translate-y-[6px] active:shadow-none transition-all"
            >
              {quest.type === 'check' ? 'Parent/Tutor Verify' : 'Complete Quest'}
            </button>
          </div>
        )}
      </div>

      {/* Parent Gate Modal */}
      {showGate && (
        <ParentGate
          onClose={() => setShowGate(false)}
          onSuccess={handleGateSuccess}
        />
      )}
    </div>
  );
};
