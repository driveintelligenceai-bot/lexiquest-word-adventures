import React, { useState, useMemo } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { AudioButton } from './AudioButton';

interface Letter {
  id: number;
  char: string;
  type: 'consonant' | 'vowel';
}

interface WordBuilderProps {
  target: string;
  onComplete: () => void;
}

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export const WordBuilder: React.FC<WordBuilderProps> = ({ target, onComplete }) => {
  const [built, setBuilt] = useState<Letter[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const pool = useMemo(() => {
    const chars = target.split('');
    // Add distractors based on what's NOT in the word
    const distractors = ['s', 't', 'n', 'r'].filter(c => !chars.includes(c)).slice(0, 2);
    chars.push(...distractors);
    
    return chars
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({
        id: i,
        char: c,
        type: VOWELS.includes(c) ? 'vowel' : 'consonant' as 'consonant' | 'vowel',
      }));
  }, [target]);

  const addLetter = (letter: Letter) => {
    if (built.find(l => l.id === letter.id)) return;
    
    const newBuilt = [...built, letter];
    setBuilt(newBuilt);
    
    // Speak the letter
    const utterance = new SpeechSynthesisUtterance(letter.char);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
    
    if (newBuilt.map(l => l.char).join('') === target) {
      setIsCorrect(true);
      setTimeout(() => {
        const wordUtterance = new SpeechSynthesisUtterance(`Correct! ${target}`);
        wordUtterance.rate = 0.9;
        window.speechSynthesis.speak(wordUtterance);
      }, 300);
      setTimeout(onComplete, 1500);
    }
  };

  const reset = () => {
    setBuilt([]);
    setIsCorrect(false);
  };

  const getCardStyle = (type: 'consonant' | 'vowel') => {
    return type === 'vowel' 
      ? 'bg-vowel border-vowel-border text-vowel-text' 
      : 'bg-consonant border-consonant-border text-consonant-text';
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Target Word Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-bold text-muted-foreground">Build:</span>
        <span className="text-2xl font-black text-foreground uppercase tracking-widest">{target}</span>
        <AudioButton text={target} size={20} />
      </div>

      {/* Drop Zone */}
      <div className={`min-h-28 w-full rounded-3xl border-4 border-dashed mb-8 flex items-center justify-center gap-2 p-4 transition-all ${
        isCorrect 
          ? 'bg-welded/30 border-welded-border' 
          : 'bg-card border-border'
      }`}>
        {built.length > 0 ? (
          <div className="flex gap-2">
            {built.map((l, i) => (
              <div
                key={l.id}
                className={`w-16 h-16 ${getCardStyle(l.type)} text-4xl font-black rounded-xl flex items-center justify-center border-b-4 animate-zoom-in`}
              >
                {l.char}
              </div>
            ))}
            {isCorrect && (
              <div className="flex items-center ml-2 animate-bounce-soft">
                <Sparkles className="text-accent" size={32} />
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground font-bold text-lg">Tap letters below</span>
        )}
      </div>

      {/* Tile Pool */}
      <div className="flex justify-center gap-3 flex-wrap">
        {pool.map((l) => {
          const isUsed = built.find(b => b.id === l.id);
          return (
            <button
              key={l.id}
              onClick={() => addLetter(l)}
              disabled={!!isUsed || isCorrect}
              className={`letter-tile ${getCardStyle(l.type)} ${
                isUsed ? 'opacity-30 cursor-not-allowed border-b-0 translate-y-2' : ''
              }`}
            >
              {l.char}
            </button>
          );
        })}
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        className="mt-8 text-muted-foreground font-bold flex items-center gap-2 hover:text-foreground transition-colors"
      >
        <RefreshCw size={16} /> Reset
      </button>
    </div>
  );
};
