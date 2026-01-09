import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, RotateCcw, Check, X, Hand } from 'lucide-react';
import { useLexiaAudio } from '@/hooks/useLexiaAudio';
import { Button } from '@/components/ui/button';

/**
 * LetterFlipGame - b/d/p/q Reversal Remediation
 * 
 * This game specifically targets the most common letter reversals in dyslexia:
 * - b vs d (horizontal flip)
 * - p vs q (horizontal flip)
 * - b vs p (vertical flip)
 * - d vs q (vertical flip)
 * 
 * Educational Approach:
 * 1. Kinesthetic Tracing - finger/mouse tracing to build motor memory
 * 2. Directional Cues - "b has belly on right, d has belly on left"
 * 3. Mnemonic Anchors - "bed" trick (b-e-d spells bed shape)
 * 4. Multi-sensory - visual + auditory + kinesthetic reinforcement
 */

interface LetterFlipGameProps {
  questionsCount?: number;
  onComplete: (results: { correct: number; total: number; hintsUsed: number }) => void;
  onBack: () => void;
}

interface Challenge {
  targetLetter: string;
  options: string[];
  mnemonic: string;
  directionHint: string;
  tracePath: { x: number; y: number }[];
}

// Reversal pairs with mnemonics
const REVERSAL_CHALLENGES: Challenge[] = [
  {
    targetLetter: 'b',
    options: ['b', 'd'],
    mnemonic: "b has a BAT then a BALL (line first, then circle right)",
    directionHint: "The belly is on the RIGHT →",
    tracePath: [
      { x: 20, y: 10 }, { x: 20, y: 90 }, // vertical line down
      { x: 20, y: 70 }, { x: 50, y: 50 }, { x: 80, y: 70 }, { x: 50, y: 90 }, { x: 20, y: 70 } // circle right
    ],
  },
  {
    targetLetter: 'd',
    options: ['d', 'b'],
    mnemonic: "d starts with a CIRCLE then a line (c + line = d)",
    directionHint: "The belly is on the LEFT ←",
    tracePath: [
      { x: 50, y: 50 }, { x: 20, y: 70 }, { x: 50, y: 90 }, { x: 80, y: 70 }, { x: 80, y: 10 }, { x: 80, y: 90 } // circle then line
    ],
  },
  {
    targetLetter: 'p',
    options: ['p', 'q'],
    mnemonic: "p points DOWN and belly RIGHT (like b upside down)",
    directionHint: "Line goes DOWN ↓, belly RIGHT →",
    tracePath: [
      { x: 20, y: 10 }, { x: 20, y: 90 }, // line down past baseline
      { x: 20, y: 30 }, { x: 50, y: 10 }, { x: 80, y: 30 }, { x: 50, y: 50 }, { x: 20, y: 30 } // circle right at top
    ],
  },
  {
    targetLetter: 'q',
    options: ['q', 'p'],
    mnemonic: "q has a TAIL that kicks RIGHT (like writing number 9)",
    directionHint: "Circle LEFT ←, tail kicks RIGHT →",
    tracePath: [
      { x: 50, y: 10 }, { x: 20, y: 30 }, { x: 50, y: 50 }, { x: 80, y: 30 }, { x: 80, y: 90 }, // circle then line
      { x: 80, y: 80 }, { x: 95, y: 90 } // tail kick
    ],
  },
];

// "bed" mnemonic visual
const BedMnemonic: React.FC = () => (
  <div className="flex items-center justify-center gap-0 text-5xl font-bold">
    <span className="text-primary">b</span>
    <span className="text-muted-foreground">e</span>
    <span className="text-primary">d</span>
  </div>
);

export const LetterFlipGame: React.FC<LetterFlipGameProps> = ({
  questionsCount = 8,
  onComplete,
  onBack,
}) => {
  const { speak, playEffect } = useLexiaAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [phase, setPhase] = useState<'intro' | 'learn' | 'trace' | 'test' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [traceProgress, setTraceProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [learnStep, setLearnStep] = useState(0);

  // Generate challenges
  useEffect(() => {
    const shuffled = [...REVERSAL_CHALLENGES, ...REVERSAL_CHALLENGES]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionsCount);
    setChallenges(shuffled);
  }, [questionsCount]);

  const currentChallenge = challenges[currentIndex];
  const correctCount = results.filter(Boolean).length;

  // Canvas drawing for tracing
  const handleCanvasStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const handleCanvasMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Update progress based on canvas coverage
    setTraceProgress(prev => Math.min(prev + 1, 100));
  }, [isDrawing]);

  const handleCanvasEnd = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTraceProgress(0);
  };

  // Draw guide path on canvas
  const drawGuidePath = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentChallenge) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw dotted guide path
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'hsl(var(--muted-foreground) / 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    const path = currentChallenge.tracePath;
    const scaleX = canvas.width / 100;
    const scaleY = canvas.height / 100;
    
    ctx.moveTo(path[0].x * scaleX, path[0].y * scaleY);
    path.forEach(point => {
      ctx.lineTo(point.x * scaleX, point.y * scaleY);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }, [currentChallenge]);

  useEffect(() => {
    if (phase === 'trace') {
      drawGuidePath();
    }
  }, [phase, drawGuidePath]);

  // Handle answer selection
  const handleAnswer = (selectedLetter: string) => {
    if (feedback) return;
    
    const isCorrect = selectedLetter === currentChallenge.targetLetter;
    
    if (isCorrect) {
      setFeedback('correct');
      playEffect('correct');
      speak("Excellent! You got it!");
      setResults(prev => [...prev, true]);
    } else {
      setFeedback('incorrect');
      playEffect('tryAgain');
      speak(`That's ${selectedLetter}. Let's try again!`);
      setResults(prev => [...prev, false]);
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
    
    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      
      if (currentIndex < challenges.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setPhase('learn');
        setLearnStep(0);
      } else {
        setPhase('results');
        playEffect('complete');
      }
    }, 2000);
  };

  // Start learning phase
  const handleStartLearn = () => {
    playEffect('tap');
    speak("Let's learn about letters that look similar!");
    setPhase('learn');
  };

  // Progress through learning
  const handleNextLearnStep = () => {
    playEffect('tap');
    if (learnStep < 2) {
      setLearnStep(prev => prev + 1);
    } else {
      setPhase('trace');
      speak(`Now trace the letter ${currentChallenge.targetLetter} with your finger!`);
    }
  };

  // Move from trace to test
  const handleTraceComplete = () => {
    if (traceProgress < 30) {
      speak("Keep tracing! Follow the dotted line.");
      return;
    }
    playEffect('tap');
    speak(`Great tracing! Now find the letter ${currentChallenge.targetLetter}`);
    setPhase('test');
    clearCanvas();
  };

  // Finish game
  const handleFinish = () => {
    onComplete({
      correct: correctCount,
      total: challenges.length,
      hintsUsed,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-area-inset">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Letter Flip</h1>
        <div className="flex items-center gap-1">
          <Check className="text-primary" size={18} />
          <span className="font-bold">{correctCount}/{challenges.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / challenges.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
            >
              <motion.div
                className="text-6xl"
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                🔄
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground">Letter Flip</h2>
              <p className="text-muted-foreground max-w-xs">
                Some letters look alike! Let's learn the tricks to tell them apart.
              </p>
              
              {/* bed mnemonic preview */}
              <div className="bg-card border-2 border-primary/30 rounded-2xl p-6">
                <p className="text-sm text-muted-foreground mb-3">Remember the "bed" trick:</p>
                <BedMnemonic />
                <p className="text-xs text-muted-foreground mt-3">
                  Make fists with thumbs up - left hand is "b", right hand is "d"!
                </p>
              </div>
              
              <Button size="lg" onClick={handleStartLearn} className="text-lg px-8 py-6">
                Let's Learn! 🎯
              </Button>
            </motion.div>
          )}

          {/* Learn Phase */}
          {phase === 'learn' && currentChallenge && (
            <motion.div
              key={`learn-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
            >
              {learnStep === 0 && (
                <>
                  <p className="text-muted-foreground">This is the letter:</p>
                  <motion.div
                    className="text-9xl font-bold text-primary"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {currentChallenge.targetLetter}
                  </motion.div>
                  <Button 
                    variant="outline" 
                    onClick={() => speak(currentChallenge.targetLetter)}
                    className="gap-2"
                  >
                    <Volume2 size={18} />
                    Hear it
                  </Button>
                </>
              )}
              
              {learnStep === 1 && (
                <>
                  <div className="text-6xl font-bold text-primary mb-4">
                    {currentChallenge.targetLetter}
                  </div>
                  <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-4 max-w-xs">
                    <p className="font-bold text-foreground mb-2">Direction Clue:</p>
                    <p className="text-lg text-accent font-bold">{currentChallenge.directionHint}</p>
                  </div>
                </>
              )}
              
              {learnStep === 2 && (
                <>
                  <div className="text-6xl font-bold text-primary mb-4">
                    {currentChallenge.targetLetter}
                  </div>
                  <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-4 max-w-xs">
                    <p className="font-bold text-foreground mb-2">Remember:</p>
                    <p className="text-sm text-muted-foreground">{currentChallenge.mnemonic}</p>
                  </div>
                </>
              )}
              
              <Button onClick={handleNextLearnStep} className="mt-4">
                {learnStep < 2 ? "Next →" : "Now Trace It! ✋"}
              </Button>
            </motion.div>
          )}

          {/* Trace Phase */}
          {phase === 'trace' && currentChallenge && (
            <motion.div
              key={`trace-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-4">
                <Hand className="text-primary" size={20} />
                <p className="text-muted-foreground">
                  Trace the letter <span className="font-bold text-primary">{currentChallenge.targetLetter}</span> with your finger
                </p>
              </div>
              
              {/* Tracing canvas */}
              <div className="relative w-full max-w-xs aspect-square bg-card rounded-3xl border-4 border-primary/30 overflow-hidden mb-4">
                {/* Guide letter in background */}
                <div className="absolute inset-0 flex items-center justify-center text-[200px] font-bold text-muted/20 pointer-events-none">
                  {currentChallenge.targetLetter}
                </div>
                
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                  onMouseDown={handleCanvasStart}
                  onMouseMove={handleCanvasMove}
                  onMouseUp={handleCanvasEnd}
                  onMouseLeave={handleCanvasEnd}
                  onTouchStart={handleCanvasStart}
                  onTouchMove={handleCanvasMove}
                  onTouchEnd={handleCanvasEnd}
                />
              </div>
              
              {/* Trace progress */}
              <div className="w-full max-w-xs mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Trace Progress</span>
                  <span className="font-bold">{Math.min(traceProgress, 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${Math.min(traceProgress, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={clearCanvas}>
                  <RotateCcw size={18} className="mr-2" />
                  Clear
                </Button>
                <Button onClick={handleTraceComplete} disabled={traceProgress < 30}>
                  Done Tracing ✓
                </Button>
              </div>
            </motion.div>
          )}

          {/* Test Phase */}
          {phase === 'test' && currentChallenge && (
            <motion.div
              key={`test-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <p className="text-muted-foreground mb-4">Which one is the letter:</p>
              
              <Button 
                variant="outline" 
                onClick={() => speak(currentChallenge.targetLetter)}
                className="gap-2 mb-6"
              >
                <Volume2 size={18} />
                "{currentChallenge.targetLetter}"
              </Button>
              
              {/* Answer options */}
              <div className="flex gap-6">
                {currentChallenge.options.map((letter, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(letter)}
                    className={`w-32 h-40 rounded-3xl border-4 text-7xl font-bold flex items-center justify-center transition-all ${
                      feedback === 'correct' && letter === currentChallenge.targetLetter
                        ? 'bg-primary/20 border-primary text-primary'
                        : feedback === 'incorrect' && letter !== currentChallenge.targetLetter
                          ? 'bg-muted border-muted-foreground/30 text-muted-foreground'
                          : 'bg-card border-border hover:border-primary/50 text-foreground'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={feedback !== null}
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>
              
              {/* Hint */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 bg-accent/10 border-2 border-accent/30 rounded-2xl p-4 max-w-xs text-center"
                  >
                    <p className="text-sm text-accent font-bold">{currentChallenge.directionHint}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`mt-6 flex items-center gap-2 text-xl font-bold ${
                      feedback === 'correct' ? 'text-primary' : 'text-destructive'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <>
                        <Check size={24} />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <X size={24} />
                        <span>Try again!</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results Phase */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
            >
              <motion.div
                className="text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {correctCount >= challenges.length * 0.8 ? '🏆' : '💪'}
              </motion.div>
              
              <h2 className="text-2xl font-bold text-foreground">
                {correctCount >= challenges.length * 0.8 ? 'Amazing!' : 'Good Effort!'}
              </h2>
              
              <div className="bg-card border-2 border-border rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">{correctCount}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-muted-foreground">{challenges.length}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground max-w-xs">
                {correctCount >= challenges.length * 0.8
                  ? "You're getting great at telling these letters apart!"
                  : "Keep practicing! The more you trace, the better you'll remember."}
              </p>
              
              <Button size="lg" onClick={handleFinish} className="text-lg px-8">
                Continue 🎉
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
