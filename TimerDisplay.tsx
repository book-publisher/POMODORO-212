import { TimerMode } from '../hooks/useTimer';

interface TimerDisplayProps {
  timeLeft: number;
  progress: number;
  mode: TimerMode;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSwitchMode: (mode: TimerMode) => void;
}

const modeLabels: Record<TimerMode, string> = {
  focus: 'Concentration',
  shortBreak: 'Pause Courte',
  longBreak: 'Pause Longue',
};

const modeColors: Record<TimerMode, { ring: string; bg: string; text: string; btn: string }> = {
  focus: {
    ring: 'stroke-rose-500',
    bg: 'from-rose-50 to-orange-50',
    text: 'text-rose-600',
    btn: 'bg-rose-500 hover:bg-rose-600',
  },
  shortBreak: {
    ring: 'stroke-emerald-500',
    bg: 'from-emerald-50 to-teal-50',
    text: 'text-emerald-600',
    btn: 'bg-emerald-500 hover:bg-emerald-600',
  },
  longBreak: {
    ring: 'stroke-blue-500',
    bg: 'from-blue-50 to-indigo-50',
    text: 'text-blue-600',
    btn: 'bg-blue-500 hover:bg-blue-600',
  },
};

export default function TimerDisplay({
  timeLeft,
  progress,
  mode,
  isRunning,
  onStart,
  onPause,
  onReset,
  onSwitchMode,
}: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const colors = modeColors[mode];

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-gray-100">
        {(Object.keys(modeLabels) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onSwitchMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === m
                ? `${modeColors[m].btn} text-white shadow-md`
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className={`relative w-72 h-72 flex items-center justify-center bg-gradient-to-br ${colors.bg} rounded-full shadow-lg`}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
            opacity="0.3"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            className={colors.ring}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className={`text-6xl font-light tracking-tight ${colors.text} tabular-nums`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-400 mt-2 font-medium">{modeLabels[mode]}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all shadow-sm"
          title="Réinitialiser"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          onClick={isRunning ? onPause : onStart}
          className={`w-16 h-16 rounded-full ${colors.btn} text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
        >
          {isRunning ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="w-12 h-12" />
      </div>
    </div>
  );
}
