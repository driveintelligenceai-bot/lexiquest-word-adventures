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

// Vocabulary questions with pictures and definitions
const VOCABULARY_DATA = {
  easy: [
    { 
      word: 'happy', 
      definition: 'Feeling good and full of joy',
      emoji: '😊',
      options: ['Feeling sad', 'Feeling good and full of joy', 'Feeling tired', 'Feeling angry'],
      correctIndex: 1,
    },
    { 
      word: 'big', 
      definition: 'Very large in size',
      emoji: '🐘',
      options: ['Very small', 'Very large in size', 'Very fast', 'Very quiet'],
      correctIndex: 1,
    },
    { 
      word: 'run', 
      definition: 'Move fast on your feet',
      emoji: '🏃',
      options: ['Sit still', 'Move fast on your feet', 'Sleep', 'Eat food'],
      correctIndex: 1,
    },
    { 
      word: 'cold', 
      definition: 'Not warm, like ice or snow',
      emoji: '🥶',
      options: ['Very hot', 'Not warm, like ice', 'Sweet like candy', 'Loud like thunder'],
      correctIndex: 1,
    },
    { 
      word: 'soft', 
      definition: 'Easy to press, like a pillow',
      emoji: '🧸',
      options: ['Hard like a rock', 'Easy to press, like a pillow', 'Very loud', 'Very bright'],
      correctIndex: 1,
    },
    { 
      word: 'jump', 
      definition: 'Push yourself up into the air',
      emoji: '🦘',
      options: ['Sit down', 'Walk slowly', 'Push yourself up into the air', 'Go to sleep'],
      correctIndex: 2,
    },
    { 
      word: 'loud', 
      definition: 'Making a lot of noise',
      emoji: '📢',
      options: ['Very quiet', 'Making a lot of noise', 'Very small', 'Very soft'],
      correctIndex: 1,
    },
    { 
      word: 'fast', 
      definition: 'Moving very quickly',
      emoji: '🚀',
      options: ['Moving very slowly', 'Standing still', 'Moving very quickly', 'Sleeping'],
      correctIndex: 2,
    },
  ],
  medium: [
    { 
      word: 'brave', 
      definition: 'Not afraid to do hard things',
      emoji: '🦁',
      options: ['Very scared', 'Not afraid to do hard things', 'Very sleepy', 'Very hungry'],
      correctIndex: 1,
    },
    { 
      word: 'curious', 
      definition: 'Wanting to learn new things',
      emoji: '🔍',
      options: ['Not caring about anything', 'Wanting to learn new things', 'Being very loud', 'Being very quiet'],
      correctIndex: 1,
    },
    { 
      word: 'gentle', 
      definition: 'Soft and kind, not rough',
      emoji: '🕊️',
      options: ['Very rough', 'Soft and kind', 'Very loud', 'Very fast'],
      correctIndex: 1,
    },
    { 
      word: 'share', 
      definition: 'Give part of something to others',
      emoji: '🤝',
      options: ['Keep everything', 'Give part to others', 'Take from others', 'Hide things'],
      correctIndex: 1,
    },
    { 
      word: 'patient', 
      definition: 'Able to wait without getting upset',
      emoji: '🧘',
      options: ['Getting angry quickly', 'Able to wait calmly', 'Running away', 'Making noise'],
      correctIndex: 1,
    },
    { 
      word: 'discover', 
      definition: 'Find something new for the first time',
      emoji: '🔭',
      options: ['Lose something', 'Find something new', 'Break something', 'Hide something'],
      correctIndex: 1,
    },
  ],
  hard: [
    { 
      word: 'determined', 
      definition: 'Not giving up even when things are hard',
      emoji: '💪',
      options: ['Giving up easily', 'Not giving up when things are hard', 'Being very lazy', 'Being very quiet'],
      correctIndex: 1,
    },
    { 
      word: 'creative', 
      definition: 'Good at thinking of new ideas',
      emoji: '🎨',
      options: ['Copying others', 'Good at thinking of new ideas', 'Following rules only', 'Being very quiet'],
      correctIndex: 1,
    },
    { 
      word: 'responsible', 
      definition: 'Can be trusted to do what is right',
      emoji: '✅',
      options: ['Breaking rules', 'Can be trusted to do right', 'Forgetting everything', 'Being careless'],
      correctIndex: 1,
    },
    { 
      word: 'adventure', 
      definition: 'An exciting trip or experience',
      emoji: '🗺️',
      options: ['A boring day at home', 'An exciting trip or experience', 'A regular school day', 'A quiet nap'],
      correctIndex: 1,
    },
    { 
      word: 'magnificent', 
      definition: 'Very beautiful and impressive',
      emoji: '👑',
      options: ['Very ugly', 'Very beautiful and impressive', 'Very small', 'Very boring'],
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
