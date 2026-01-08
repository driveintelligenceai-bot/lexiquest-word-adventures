import React, { useState } from 'react';
import { X, Volume2, CheckCircle } from 'lucide-react';
import { Quest } from './QuestCard';
import { WordBuilder } from './WordBuilder';
import { ParentGate } from './ParentGate';
import { SubStep } from '@/lib/curriculum';
import { speak } from '@/lib/speech';

interface QuestActivityProps {
  quest: Quest;
  stepData: SubStep;
  onComplete: () => void;
  onBack: () => void;
}

export const QuestActivity: React.FC<QuestActivityProps> = ({
  quest,
  stepData,
  onComplete,
  onBack
}) => {
  const [showGate, setShowGate] = useState(false);
  const [drillIndex, setDrillIndex] = useState(0);

  const IconComponent = quest.icon;

  const handleDrillTap = () => {
    if (quest.type === 'drill' && stepData.tiles) {
      const tile = stepData.tiles[drillIndex];
      if (tile) {
        speak(tile.c);
        if (drillIndex >= Math.min(stepData.tiles.length - 1, 4)) {
          setTimeout(onComplete, 500);
        } else {
          setDrillIndex(drillIndex + 1);
        }
      }
    }
  };

  const handleComplete = () => {
    if (quest.type === 'check') {
      setShowGate(true);
    } else {
      onComplete();
    }
  };

  const renderActivity = () => {
    switch (quest.type) {
      case 'build':
        return <WordBuilder stepData={stepData} onComplete={onComplete} />;

      case 'drill':
        return (
          <div className="text-center max-w-sm space-y-8">
            <div className="flex justify-center gap-3 flex-wrap">
              {stepData.tiles.slice(0, 5).map((tile, i) => (
                <button
                  key={i}
                  onClick={handleDrillTap}
                  className={`w-20 h-24 letter-tile ${
                    tile.t === 'v' ? 'tile-vowel' : 
                    tile.t === 'd' ? 'tile-digraph' : 
                    tile.t === 'w' ? 'tile-welded' : 'tile-consonant'
                  } ${i < drillIndex ? 'opacity-40' : ''} ${i === drillIndex ? 'ring-4 ring-primary ring-offset-2' : ''}`}
                >
                  {tile.c}
                </button>
              ))}
            </div>
            <p className="text-muted-foreground font-medium">
              Tap each card to hear the sound ({drillIndex + 1}/{Math.min(stepData.tiles.length, 5)})
            </p>
          </div>
        );

      case 'read':
        const readContent = quest.data || stepData.words[0];
        return (
          <div className="text-center max-w-sm space-y-8">
            <button
              onClick={() => speak(readContent)}
              className="w-64 h-64 bg-card rounded-[40px] shadow-xl border-b-8 border-border flex items-center justify-center mx-auto cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-3xl font-black text-foreground px-8 leading-relaxed">
                {readContent}
              </span>
            </button>
            <h2 className="text-xl font-bold text-muted-foreground">Tap to hear it read</h2>
            <button
              onClick={handleComplete}
              className="w-full bg-primary text-primary-foreground text-xl font-bold py-5 rounded-2xl shadow-[0_6px_0] shadow-primary/50 active:translate-y-[6px] active:shadow-none transition-all"
            >
              Mark Complete
            </button>
          </div>
        );

      case 'check':
      default:
        return (
          <div className="text-center max-w-sm space-y-8">
            <div className="w-64 h-64 bg-card rounded-[40px] shadow-xl border-b-8 border-border flex items-center justify-center mx-auto">
              <CheckCircle size={80} className="text-welded-border" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{quest.content}</h2>
            <button
              onClick={handleComplete}
              className="w-full bg-primary text-primary-foreground text-xl font-bold py-5 rounded-2xl shadow-[0_6px_0] shadow-primary/50 active:translate-y-[6px] active:shadow-none transition-all"
            >
              {quest.role === 'home' ? 'Parent Verify' : 'Mark Complete'}
            </button>
          </div>
        );
    }
  };

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
        
        <div className="flex items-center gap-2">
          <IconComponent size={20} className="text-primary" />
          <span className="font-bold text-foreground">{quest.title}</span>
        </div>

        <button
          onClick={() => speak(quest.content)}
          className="p-3 bg-consonant rounded-full text-consonant-text"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {renderActivity()}
      </div>

      {/* Parent Gate */}
      {showGate && (
        <ParentGate
          title="Parent Verification"
          onClose={() => setShowGate(false)}
          onSuccess={() => {
            setShowGate(false);
            onComplete();
          }}
        />
      )}
    </div>
  );
};
