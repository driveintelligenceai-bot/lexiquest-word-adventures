import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Whisper } from './Whisper';

interface VocabularyQuizProps {
  questionsCount?: number;
  wilsonStep?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

// Wilson 1.1 Vocabulary - Only words with short 'a' and consonants f, l, m, n, r, s (+ t, p)
// These are simple CVC words that match Wilson 1.1 phonics patterns
const VOCABULARY_DATA = {
  easy: [
    { 
      word: 'sat', 
      definition: 'To rest on a chair or seat',
      emoji: '🪑',
      options: ['To stand up tall', 'To rest on a chair or seat', 'To run fast', 'To sleep in bed'],
      correctIndex: 1,
    },
    { 
      word: 'mat', 
      definition: 'A flat piece you step on',
      emoji: '🧹',
      options: ['A tall tree', 'A flat piece you step on', 'A small bug', 'A big box'],
      correctIndex: 1,
    },
    { 
      word: 'rat', 
      definition: 'A small animal with a long tail',
      emoji: '🐀',
      options: ['A big dog', 'A flying bird', 'A small animal with a long tail', 'A swimming fish'],
      correctIndex: 2,
    },
    { 
      word: 'fat', 
      definition: 'Round and big, not thin',
      emoji: '🍔',
      options: ['Very thin', 'Round and big, not thin', 'Very tall', 'Very fast'],
      correctIndex: 1,
    },
    { 
      word: 'fan', 
      definition: 'Makes air to cool you down',
      emoji: '💨',
      options: ['Makes you hot', 'Makes air to cool you down', 'Makes loud sounds', 'Makes food'],
      correctIndex: 1,
    },
    { 
      word: 'ran', 
      definition: 'Moved very fast on your feet',
      emoji: '🏃',
      options: ['Sat very still', 'Moved very fast on your feet', 'Slept in bed', 'Ate some food'],
      correctIndex: 1,
    },
    { 
      word: 'nap', 
      definition: 'A short sleep during the day',
      emoji: '😴',
      options: ['A long run', 'A loud song', 'A short sleep during the day', 'A big meal'],
      correctIndex: 2,
    },
    { 
      word: 'lap', 
      definition: 'The top of your legs when sitting',
      emoji: '🧘',
      options: ['Your head', 'Your feet', 'The top of your legs when sitting', 'Your hands'],
      correctIndex: 2,
    },
  ],
  medium: [
    { 
      word: 'fast', 
      definition: 'Moving very quickly',
      emoji: '⚡',
      options: ['Moving very slowly', 'Standing still', 'Moving very quickly', 'Sleeping'],
      correctIndex: 2,
    },
    { 
      word: 'last', 
      definition: 'At the very end, after all others',
      emoji: '🏁',
      options: ['At the start', 'In the middle', 'At the very end, after all others', 'Nowhere'],
      correctIndex: 2,
    },
    { 
      word: 'raft', 
      definition: 'A flat boat that floats on water',
      emoji: '🚣',
      options: ['A car on the road', 'A flat boat that floats on water', 'A plane in the sky', 'A train on tracks'],
      correctIndex: 1,
    },
    { 
      word: 'mast', 
      definition: 'A tall pole on a boat for sails',
      emoji: '⛵',
      options: ['The bottom of a boat', 'A tall pole on a boat for sails', 'The wheel of a car', 'The wing of a plane'],
      correctIndex: 1,
    },
    { 
      word: 'past', 
      definition: 'Time that has already happened',
      emoji: '⏰',
      options: ['Time right now', 'Time that has already happened', 'Time in the future', 'Time for lunch'],
      correctIndex: 1,
    },
  ],
  hard: [
    { 
      word: 'staff', 
      definition: 'A group of workers at a place',
      emoji: '👥',
      options: ['Just one person', 'A group of workers at a place', 'A type of food', 'A kind of game'],
      correctIndex: 1,
    },
    { 
      word: 'lass', 
      definition: 'A young girl or woman',
      emoji: '👧',
      options: ['A young boy', 'An old man', 'A young girl or woman', 'A baby'],
      correctIndex: 2,
    },
    { 
      word: 'pass', 
      definition: 'To go by something or give it away',
      emoji: '🎫',
      options: ['To stop and stay', 'To go by something or give it away', 'To sleep all day', 'To eat a meal'],
      correctIndex: 1,
    },
  ],
};

export const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({
  questionsCount = 5,
  wilsonStep = 1,
  onComplete,
  onBack,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'tryAgain' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const { speak, playEffect } = useLexiaAudio();

  // Select questions based on difficulty
  const questions = useMemo(() => {
    const difficulty = wilsonStep <= 1 ? 'easy' : wilsonStep <= 2 ? 'medium' : 'hard';
    const questionPool = VOCABULARY_DATA[difficulty];
    return [...questionPool].sort(() => Math.random() - 0.5).slice(0, questionsCount);
  }, [questionsCount, wilsonStep]);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(null);
      setFeedback(null);
      setShowHint(false);
      setTimeout(() => {
        speak(`What does ${currentQuestion.word} mean? ${currentQuestion.emoji}`);
      }, 300);
    }
  }, [questionIndex, currentQuestion]);

  const handleSelectAnswer = (index: number) => {
    if (feedback === 'correct') return;
    
    playEffect('tap');
    setSelectedAnswer(index);
    speak(currentQuestion.options[index]);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    if (isCorrect) {
      setFeedback('correct');
      playEffect('correct');
      setCorrectCount(prev => prev + 1);
      speak(`Fantastic! ${currentQuestion.word} means ${currentQuestion.definition}`);

      setTimeout(() => {
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(prev => prev + 1);
        } else {
          onComplete({
            correct: correctCount + 1,
            total: questions.length,
            hintsUsed,
          });
        }
      }, 2000);
    } else {
      setFeedback('tryAgain');
      playEffect('tryAgain');
      setShowHint(true);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    speak(`Here's a hint: Think about what ${currentQuestion.emoji} makes you feel. ${currentQuestion.word} is about ${currentQuestion.definition.split(' ').slice(0, 3).join(' ')}`);
  };

  const handleSpeakWord = () => {
    speak(`${currentQuestion.word}. ${currentQuestion.word}.`);
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="h-12 w-12 min-h-[44px] min-w-[44px] bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Word Meanings</h1>
          <p className="text-xs text-muted-foreground">
            {questionIndex + 1} of {questions.length}
          </p>
        </div>

        <button
          onClick={handleHint}
          className="h-12 w-12 min-h-[44px] min-w-[44px] bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Get a hint"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(questionIndex / questions.length) * 100}%` }}
        />
      </div>

      {/* Word Card */}
      <motion.div
        className="bg-card border-4 border-primary rounded-3xl p-6 mb-8 text-center shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        key={questionIndex}
      >
        <div className="text-6xl mb-4" aria-hidden="true">{currentQuestion.emoji}</div>
        <motion.button
          onClick={handleSpeakWord}
          className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-2xl"
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-4xl font-black text-primary">{currentQuestion.word}</span>
          <Volume2 size={24} className="text-primary" />
        </motion.button>
        <p className="text-muted-foreground mt-4 text-lg">What does this word mean?</p>
      </motion.div>

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === currentQuestion.correctIndex;
          const showAsCorrect = feedback === 'correct' && isCorrectAnswer;
          const showAsWrong = feedback === 'tryAgain' && isSelected;

          return (
            <motion.button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={`w-full p-4 rounded-2xl text-left font-medium border-4 transition-all min-h-[60px] ${
                showAsCorrect
                  ? 'bg-welded border-welded-border text-welded-text'
                  : showAsWrong
                  ? 'bg-destructive/20 border-destructive text-foreground'
                  : isSelected
                  ? 'bg-primary/20 border-primary text-foreground'
                  : 'bg-card border-border text-foreground hover:border-primary/50'
              }`}
              whileTap={{ scale: 0.98 }}
              disabled={feedback === 'correct'}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg">{option}</span>
                {showAsCorrect && <Sparkles size={20} className="ml-auto text-welded-text" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Check Button */}
      <button
        onClick={handleCheck}
        disabled={selectedAnswer === null || feedback === 'correct'}
        className={`w-full h-16 rounded-2xl font-bold text-lg transition-all active:scale-95 min-h-[44px] ${
          selectedAnswer !== null && feedback !== 'correct'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        Check My Answer!
      </button>

      {/* Whisper Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Whisper 
            message={`Think about ${currentQuestion.emoji}. What feeling or action does it show?`}
            variant="hint" 
          />
        </motion.div>
      )}
    </div>
  );
};
