import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useSessionTimer Hook
 * 
 * Evidence-based session management for dyslexic learners.
 * Research shows optimal session duration is 15-20 minutes
 * before cognitive fatigue impacts learning effectiveness.
 * 
 * Features:
 * - Configurable warning and limit thresholds
 * - Gentle break reminders (not punitive)
 * - Pause/resume functionality
 * - Persists across component re-renders
 */

interface UseSessionTimerOptions {
  /** Warning threshold in minutes (default: 15) */
  warningMinutes?: number;
  /** Session limit in minutes (default: 20) */
  limitMinutes?: number;
  /** Called when warning threshold is reached */
  onWarning?: () => void;
  /** Called when session limit is reached */
  onLimit?: () => void;
  /** Auto-start the timer (default: true) */
  autoStart?: boolean;
}

interface SessionTimerState {
  /** Elapsed time in seconds */
  elapsedSeconds: number;
  /** Whether timer is currently running */
  isRunning: boolean;
  /** Whether warning threshold has been reached */
  hasWarned: boolean;
  /** Whether session limit has been reached */
  hasReachedLimit: boolean;
  /** Formatted time string (MM:SS) */
  formattedTime: string;
  /** Minutes remaining until limit */
  minutesRemaining: number;
}

interface SessionTimerActions {
  /** Start or resume the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset the timer to zero */
  reset: () => void;
  /** Extend the session by specified minutes */
  extendSession: (minutes: number) => void;
  /** Dismiss the warning */
  dismissWarning: () => void;
}

export function useSessionTimer(
  options: UseSessionTimerOptions = {}
): SessionTimerState & SessionTimerActions {
  const {
    warningMinutes = 15,
    limitMinutes = 20,
    onWarning,
    onLimit,
    autoStart = true,
  } = options;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasWarned, setHasWarned] = useState(false);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [extendedMinutes, setExtendedMinutes] = useState(0);
  
  // Use refs for callbacks to avoid re-creating interval
  const onWarningRef = useRef(onWarning);
  const onLimitRef = useRef(onLimit);
  
  useEffect(() => {
    onWarningRef.current = onWarning;
    onLimitRef.current = onLimit;
  }, [onWarning, onLimit]);

  // Calculate thresholds in seconds
  const warningThreshold = warningMinutes * 60;
  const limitThreshold = (limitMinutes + extendedMinutes) * 60;

  // Timer tick effect
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        
        // Check warning threshold
        if (!hasWarned && next >= warningThreshold) {
          setHasWarned(true);
          onWarningRef.current?.();
        }
        
        // Check limit threshold
        if (!hasReachedLimit && next >= limitThreshold) {
          setHasReachedLimit(true);
          onLimitRef.current?.();
        }
        
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, warningThreshold, limitThreshold, hasWarned, hasReachedLimit]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate minutes remaining
  const minutesRemaining = Math.max(
    0, 
    Math.ceil((limitThreshold - elapsedSeconds) / 60)
  );

  // Actions
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setHasWarned(false);
    setHasReachedLimit(false);
    setExtendedMinutes(0);
    setIsRunning(autoStart);
  }, [autoStart]);

  const extendSession = useCallback((minutes: number) => {
    setExtendedMinutes(prev => prev + minutes);
    setHasReachedLimit(false);
  }, []);

  const dismissWarning = useCallback(() => {
    setHasWarned(false);
  }, []);

  return {
    // State
    elapsedSeconds,
    isRunning,
    hasWarned,
    hasReachedLimit,
    formattedTime: formatTime(elapsedSeconds),
    minutesRemaining,
    // Actions
    start,
    pause,
    reset,
    extendSession,
    dismissWarning,
  };
}

export default useSessionTimer;
