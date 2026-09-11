import { TimerMode } from '../hooks/useTimer';

interface DayStats {
  date: string;
  sessions: { mode: TimerMode; duration: number; completedAt: string }[];
  totalFocusMinutes: number;
}

interface StatsProps {
  stats: DayStats;
}

export default function Stats({ stats }: StatsProps) {
  const todaySessions = stats.sessions.filter(
    (s) => s.mode === 'focus'
  );
  const totalFocusToday = stats.totalFocusMinutes;
  const sessionCount = todaySessions.length;

  const goals = 8; // sessions goal
  const goalProgress = Math.min((sessionCount / goals) * 100, 100);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-700">Statistiques du jour</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-rose-50/50 rounded-lg">
            <div className="text-2xl font-light text-rose-600">{sessionCount}</div>
            <div className="text-xs text-gray-500 mt-1">Sessions</div>
          </div>
          <div className="text-center p-3 bg-orange-50/50 rounded-lg">
            <div className="text-2xl font-light text-orange-600">{totalFocusToday}</div>
            <div className="text-xs text-gray-500 mt-1">Minutes</div>
          </div>
          <div className="text-center p-3 bg-amber-50/50 rounded-lg">
            <div className="text-2xl font-light text-amber-600">{Math.round(totalFocusToday / 60 * 10) / 10}</div>
            <div className="text-xs text-gray-500 mt-1">Heures</div>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Objectif quotidien</span>
            <span className="text-xs font-medium text-gray-600">{sessionCount}/{goals} sessions</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-orange-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>

        {/* Recent Sessions */}
        {todaySessions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">Dernières sessions</div>
            <div className="flex flex-wrap gap-1.5">
              {todaySessions.slice(-10).map((s, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-md bg-rose-100 flex items-center justify-center text-xs text-rose-600 font-medium"
                  title={`${s.duration} min - ${new Date(s.completedAt).toLocaleTimeString()}`}
                >
                  ✓
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
