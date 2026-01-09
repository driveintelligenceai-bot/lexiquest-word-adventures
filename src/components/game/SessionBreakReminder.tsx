import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Coffee, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * SessionBreakReminder Component
 * 
 * Gentle, non-punitive break reminder for dyslexic learners.
 * Research shows 15-20 minute optimal session duration.
 * 
 * Design principles:
 * - Friendly, not alarming
 * - Celebrates work done
 * - Offers choice (continue or break)
 * - Never forces stopping
 */

interface SessionBreakReminderProps {
  /** Whether to show the reminder */
  isVisible: boolean;
  /** Type of reminder */
  variant: 'warning' | 'limit';
  /** Session duration in formatted string */
  sessionTime: string;
  /** Minutes remaining (for warning) */
  minutesRemaining?: number;
  /** Continue playing callback */
  onContinue: () => void;
  /** Take a break callback */
  onBreak: () => void;
  /** Dismiss the reminder */
  onDismiss: () => void;
}

export const SessionBreakReminder: React.FC<SessionBreakReminderProps> = ({
  isVisible,
  variant,
  sessionTime,
  minutesRemaining,
  onContinue,
  onBreak,
  onDismiss,
}) => {
  const isWarning = variant === 'warning';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card rounded-3xl p-6 shadow-2xl border-2 border-border"
          >
            {/* Close button */}
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isWarning 
                    ? 'bg-accent/20 text-accent' 
                    : 'bg-primary/20 text-primary'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isWarning ? (
                  <Clock size={40} />
                ) : (
                  <Coffee size={40} />
                )}
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground text-center mb-2">
              {isWarning ? "Great Progress! 🌟" : "Super Star Learner! 🏆"}
            </h2>

            {/* Message */}
            <p className="text-muted-foreground text-center mb-4">
              {isWarning ? (
                <>
                  You've been learning for <span className="font-bold text-foreground">{sessionTime}</span>!
                  {minutesRemaining && minutesRemaining > 0 && (
                    <> Just {minutesRemaining} more minutes until break time.</>
                  )}
                </>
              ) : (
                <>
                  Wow! <span className="font-bold text-foreground">{sessionTime}</span> of amazing learning!
                  Your brain might need a little rest.
                </>
              )}
            </p>

            {/* Celebration */}
            <div className="bg-muted/50 rounded-2xl p-4 mb-6">
              <p className="text-center text-sm text-muted-foreground">
                {isWarning ? (
                  <>🧠 Your brain is working hard! Keep it up!</>
                ) : (
                  <>
                    💪 Taking breaks helps your brain remember better!
                    <br />
                    Try stretching, getting water, or looking at something far away.
                  </>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-14 text-lg gap-2"
                onClick={onBreak}
              >
                <Coffee size={20} />
                Take Break
              </Button>
              <Button
                className="flex-1 h-14 text-lg gap-2"
                onClick={onContinue}
              >
                <Play size={20} />
                {isWarning ? "Keep Going!" : "5 More Min"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionBreakReminder;
