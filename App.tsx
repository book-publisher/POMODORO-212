import { useCallback, useRef, useEffect } from 'react';
import TimerDisplay from './components/TimerDisplay';
import Settings from './components/Settings';
import Stats from './components/Stats';
import AudioUpload from './components/AudioUpload';
import { useTimer, TimerMode } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';

interface DayStats {
  date: string;
  sessions: { mode: TimerMode; duration: number; completedAt: string }[];
  totalFocusMinutes: number;
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getInitialStats(): DayStats {
  return { date: getTodayKey(), sessions: [], totalFocusMinutes: 0 };
}

export default function App() {
  const [durations, setDurations] = useLocalStorage<Record<TimerMode, number>>('pomodoro-durations', {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const [stats, setStats] = useLocalStorage<DayStats>('pomodoro-stats', getInitialStats());
  const [audioUrl, setAudioUrl] = useLocalStorage<string | null>('pomodoro-audio-url', null);
  const [audioName, setAudioName] = useLocalStorage<string | null>('pomodoro-audio-name', null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Keep audioUrlRef in sync
  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  // Reset stats if it's a new day
  useEffect(() => {
    if (stats.date !== getTodayKey()) {
      setStats(getInitialStats());
    }
  }, [stats.date, setStats]);

  const playAudio = useCallback(() => {
    const url = audioUrlRef.current;
    if (url) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play().catch(() => {
          // Autoplay might be blocked
        });
      } catch {
        // Audio playback failed
      }
    } else {
      // Play default beep sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          audioContext.close();
        }, 500);
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 1000;
          osc2.type = 'sine';
          gain2.gain.value = 0.3;
          osc2.start();
          setTimeout(() => {
            osc2.stop();
            audioContext.close();
          }, 500);
        }, 600);
      } catch {
        // Web Audio API not available
      }
    }
  }, []);

  const handleTimerComplete = useCallback((mode: TimerMode) => {
    playAudio();

    if (mode === 'focus') {
      setStats((prev) => {
        const today = getTodayKey();
        if (prev.date !== today) {
          return {
            date: today,
            sessions: [{ mode, duration: durations.focus, completedAt: new Date().toISOString() }],
            totalFocusMinutes: durations.focus,
          };
        }
        return {
          ...prev,
          sessions: [...prev.sessions, { mode, duration: durations.focus, completedAt: new Date().toISOString() }],
          totalFocusMinutes: prev.totalFocusMinutes + durations.focus,
        };
      });
    }
  }, [durations, playAudio, setStats]);

  const { mode, timeLeft, isRunning, progress, start, pause, reset, switchMode } = useTimer({
    durations,
    onComplete: handleTimerComplete,
  });

  const handleDurationChange = useCallback((m: TimerMode, value: number) => {
    setDurations((prev) => ({ ...prev, [m]: value }));
  }, [setDurations]);

  const handleAudioChange = useCallback((url: string | null, name: string | null) => {
    setAudioUrl(url);
    setAudioName(name);
  }, [setAudioUrl, setAudioName]);

  const handlePlayAudio = useCallback(() => {
    playAudio();
  }, [playAudio]);

  // Update document title with timer
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const modeLabel = mode === 'focus' ? '🎯' : mode === 'shortBreak' ? '☕' : '🌿';
    document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${modeLabel} FocusFlow`;
    return () => {
      document.title = 'FocusFlow - Pomodoro Timer';
    };
  }, [timeLeft, mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-4 text-center">
        <h1 className="text-2xl font-light text-gray-800 tracking-wide">
          <span className="font-semibold">Focus</span>Flow
        </h1>
        <p className="text-xs text-gray-400 mt-1">Restez concentré, progressez chaque jour</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center gap-8 px-4 pb-12">
        {/* Timer */}
        <div className="mt-4">
          <TimerDisplay
            timeLeft={timeLeft}
            progress={progress}
            mode={mode}
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSwitchMode={switchMode}
          />
        </div>

        {/* Audio Upload */}
        <AudioUpload
          audioUrl={audioUrl}
          audioName={audioName}
          onAudioChange={handleAudioChange}
          onPlay={handlePlayAudio}
        />

        {/* Settings */}
        <Settings
          durations={durations}
          onDurationChange={handleDurationChange}
        />

        {/* Stats */}
        <Stats stats={stats} />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-gray-300">FocusFlow © 2026 — Concentrez-vous sur l'essentiel</p>
      </footer>
    </div>
  );
}
