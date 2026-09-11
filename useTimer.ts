import { useState, useRef, useCallback, useEffect } from 'react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface UseTimerProps {
  durations: Record<TimerMode, number>;
  onComplete: (mode: TimerMode) => void;
}

export function useTimer({ durations, onComplete }: UseTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(durations.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const totalTime = durations[mode] * 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const remaining = totalTime - elapsed;

    if (remaining <= 0) {
      setTimeLeft(0);
      setProgress(0);
      setIsRunning(false);
      clearTimer();
      onComplete(mode);
    } else {
      setTimeLeft(remaining);
      setProgress((remaining / totalTime) * 100);
    }
  }, [totalTime, mode, onComplete, clearTimer]);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - pausedTimeRef.current * 1000;
    intervalRef.current = window.setInterval(tick, 250);
  }, [isRunning, tick]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    clearTimer();
    pausedTimeRef.current = timeLeft;
  }, [isRunning, clearTimer, timeLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setTimeLeft(totalTime);
    setProgress(100);
    pausedTimeRef.current = 0;
  }, [clearTimer, totalTime]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false);
    clearTimer();
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
    setProgress(100);
    pausedTimeRef.current = 0;
  }, [clearTimer, durations]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(durations[mode] * 60);
      setProgress(100);
    }
  }, [durations, mode, isRunning]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    mode,
    timeLeft,
    isRunning,
    progress,
    start,
    pause,
    reset,
    switchMode,
  };
}
