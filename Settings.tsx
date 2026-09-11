import { useState } from 'react';
import { TimerMode } from '../hooks/useTimer';

interface SettingsProps {
  durations: Record<TimerMode, number>;
  onDurationChange: (mode: TimerMode, value: number) => void;
}

const modeLabels: Record<TimerMode, string> = {
  focus: 'Concentration',
  shortBreak: 'Pause Courte',
  longBreak: 'Pause Longue',
};

const modeIcons: Record<TimerMode, string> = {
  focus: '🎯',
  shortBreak: '☕',
  longBreak: '🌿',
};

export default function Settings({ durations, onDurationChange }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Durées personnalisées</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 p-5 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm space-y-4 animate-in">
          {(Object.keys(modeLabels) as TimerMode[]).map((m) => (
            <div key={m} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{modeIcons[m]}</span>
                <span className="text-sm text-gray-600">{modeLabels[m]}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max={m === 'focus' ? 90 : 30}
                  value={durations[m]}
                  onChange={(e) => onDurationChange(m, parseInt(e.target.value))}
                  className="w-28 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-600"
                />
                <span className="text-sm font-mono text-gray-700 w-12 text-right">
                  {durations[m]} min
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
