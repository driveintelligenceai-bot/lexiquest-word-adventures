import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, RefreshCw, Sparkles } from 'lucide-react';
import { SubStep, isVowel, getTileStyle } from '@/lib/curriculum';
import { speak, speakLetter, speakCelebration } from '@/lib/speech';

interface BuiltTile {
  id: number;
  char: string;
  type: 'c' | 'v' | 'd' | 'w' | 'b' | 's';
}

interface WordBuilderProps {
  stepData: SubStep;
  onComplete: () => void;
}

export const WordBuilder: React.FC<WordBuilderProps> = ({ stepData, onComplete }) => {
  const [built, setBuilt] = useState<BuiltTile[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  // Pick a random target word
  const targetWord = useMemo(() => {
    return stepData.words[Math.floor(Math.random() * stepData.words.length)];
  }, [stepData]);

  // Create tile pool with correct letters + distractors
  const pool = useMemo(() => {
    const chars = targetWord.split('').map((c, i) => ({
      id: i,
      char: c,
      type: isVowel(c) ? 'v' : 'c' as 'c' | 'v'
    }));

    // Add 2-3 distractors from the step tiles
    const distractorChars = ['s', 't', 'n', 'r'].filter(c => !targetWord.includes(c));
    distractorChars.slice(0, 2).forEach((c, i) => {
      chars.push({ id: 100 + i, char: c, type: 'c' });
    });

    return chars.sort(() => Math.random() - 0.5);
  }, [targetWord]);

  // Announce target word
  useEffect(() => {
    speak(`Build the word... ${targetWord}`);
  }, [targetWord]);

  const handleTile = (tile: BuiltTile) => {
    if (built.find(b => b.id === tile.id) || isCorrect) return;

    const newBuilt = [...built, tile];
    setBuilt(newBuilt);
    speakLetter(tile.char);

    const currentStr = newBuilt.map(t => t.char).join('');
    
    if (currentStr === targetWord) {
      setIsCorrect(true);
      speakCelebration(targetWord);
      setTimeout(onComplete, 1200);
    } else if (currentStr.length >= targetWord.length) {
      // Wrong answer - reset after short delay
      setTimeout(() => setBuilt([]), 600);
    }
  };

  const reset = () => {
    setBuilt([]);
    setIsCorrect(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Drop Zone */}
      <div className={`min-h-32 w-full rounded-3xl border-4 mb-8 flex items-center justify-center gap-2 p-4 transition-all ${
        isCorrect 
          ? 'bg-welded/30 border-welded-border' 
          : 'bg-card border-border border-dashed'
      }`}>
        {built.length > 0 ? (
          <div className="flex gap-2">
            {built.map((tile) => (
              <div
                key={tile.id}
                className={`w-16 h-20 ${getTileStyle(tile.type)} text-4xl font-black rounded-xl flex items-center justify-center border-b-4 animate-zoom-in`}
              >
                {tile.char}
              </div>
            ))}
            {isCorrect && (
              <div className="flex items-center ml-2">
                <Sparkles className="text-accent animate-spin-slow" size={32} />
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground font-bold text-lg opacity-50">
            Spell "{targetWord}"
          </span>
        )}
      </div>

      {/* Tile Pool */}
      <div className="flex justify-center gap-3 flex-wrap">
        {pool.map((tile) => {
          const isUsed = built.find(b => b.id === tile.id);
          return (
            <button
              key={tile.id}
              onClick={() => handleTile(tile)}
              disabled={!!isUsed || isCorrect}
              className={`w-16 h-20 letter-tile ${getTileStyle(tile.type)} ${
                isUsed ? 'opacity-30 cursor-not-allowed border-b-0 translate-y-[6px]' : ''
              }`}
            >
              {tile.char}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={() => speak(targetWord)}
          className="p-4 bg-consonant text-consonant-text rounded-full hover:opacity-80 transition-opacity"
        >
          <Volume2 size={24} />
        </button>
        <button
          onClick={reset}
          className="p-4 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
        >
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};
