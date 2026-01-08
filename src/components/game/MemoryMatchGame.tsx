import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, RotateCcw } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';

interface MemoryMatchGameProps {
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

interface Card {
  id: string;
  content: string;
  type: 'word' | 'image';
  pairId: string;
}

// Word-image pairs
const PAIRS = [
  { word: 'cat', image: '🐱' },
  { word: 'dog', image: '🐶' },
  { word: 'sun', image: '☀️' },
  { word: 'hat', image: '🎩' },
  { word: 'bug', image: '🐛' },
  { word: 'pig', image: '🐷' },
  { word: 'bat', image: '🦇' },
  { word: 'cup', image: '☕' },
  { word: 'bed', image: '🛏️' },
  { word: 'fish', image: '🐟' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  questionsCount = 6,
  onComplete,
  onBack,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const { speak, playEffect } = useLexiaAudio();

  // Initialize cards
  useEffect(() => {
    const selectedPairs = [...PAIRS]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionsCount);

    const newCards: Card[] = [];
    selectedPairs.forEach((pair, i) => {
      newCards.push({
        id: `word-${i}`,
        content: pair.word,
        type: 'word',
        pairId: `pair-${i}`,
      });
      newCards.push({
        id: `image-${i}`,
        content: pair.image,
        type: 'image',
        pairId: `pair-${i}`,
      });
    });

    setCards(newCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    
    setTimeout(() => {
      speak('Match the words with the pictures!');
    }, 300);
  }, [questionsCount]);

  const handleCardClick = (card: Card) => {
    if (isChecking || flipped.includes(card.id) || matched.includes(card.id)) {
      return;
    }

    playEffect('tap');
    
    if (card.type === 'word') {
      speak(card.content);
    }

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(m => m + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match!
        playEffect('correct');
        speak('Great match!');
        setMatched(prev => [...prev, firstId, secondId]);
        setFlipped([]);
        setIsChecking(false);

        // Check if game complete
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            onComplete({
              correct: questionsCount,
              total: questionsCount,
              hintsUsed,
            });
          }, 1000);
        }
      } else {
        // No match
        playEffect('tryAgain');
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    
    // Find an unmatched pair and briefly show it
    const unmatchedCard = cards.find(c => !matched.includes(c.id));
    if (unmatchedCard) {
      const pairCard = cards.find(c => c.pairId === unmatchedCard.pairId && c.id !== unmatchedCard.id);
      if (pairCard) {
        speak(`Look for ${unmatchedCard.type === 'word' ? unmatchedCard.content : 'the ' + pairCard.content}`);
      }
    }
  };

  const handleReset = () => {
    setCards(cards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    speak('Cards shuffled! Try again!');
  };

  const pairsMatched = matched.length / 2;
  const totalPairs = cards.length / 2;

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Memory Match</h1>
          <p className="text-xs text-muted-foreground">
            {pairsMatched} of {totalPairs} pairs
          </p>
        </div>

        <button
          onClick={handleHint}
          className="h-12 w-12 bg-muted rounded-full flex items-center justify-center active:scale-95"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${(pairsMatched / totalPairs) * 100}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-black text-foreground">{moves}</div>
          <div className="text-xs text-muted-foreground">Moves</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-primary">{pairsMatched}</div>
          <div className="text-xs text-muted-foreground">Matches</div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-2xl text-2xl font-bold flex items-center justify-center transition-all ${
                isMatched
                  ? 'bg-welded border-4 border-welded-border'
                  : isFlipped
                  ? card.type === 'word'
                    ? 'bg-consonant border-4 border-consonant-border text-consonant-text'
                    : 'bg-vowel border-4 border-vowel-border'
                  : 'bg-card border-4 border-border hover:border-primary/50'
              }`}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotateY: isFlipped ? 0 : 180,
              }}
              transition={{ duration: 0.3 }}
            >
              {isFlipped ? (
                <span className={card.type === 'image' ? 'text-4xl' : 'text-xl'}>
                  {card.content}
                </span>
              ) : (
                <span className="text-3xl">❓</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full h-14 bg-muted text-muted-foreground rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95"
      >
        <RotateCcw size={20} />
        Shuffle Cards
      </button>

      {/* Whisper Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Whisper 
            message="Match each word with its picture!" 
            variant="hint" 
          />
        </motion.div>
      )}
    </div>
  );
};
