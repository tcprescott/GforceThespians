import { useGameStore } from '../game/store';
import { ACHIEVEMENTS } from '../game/content';

export function AchievementsPanel() {
  const state = useGameStore();
  const earned = new Set(state.achievements);

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-400">
        Earned {earned.size}/{ACHIEVEMENTS.length}. Each achievement is a small, permanent, stacking
        global multiplier — exploration quietly compounds, and they survive every reset.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const has = earned.has(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-lg border p-3 ${
                has ? 'border-amber-400/40 bg-amber-400/5' : 'border-zinc-800 bg-zinc-900/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-bold ${has ? 'text-amber-200' : 'text-zinc-400'}`}>
                  {has ? '🏆' : '🔒'} {a.name}
                </span>
                <span className="shrink-0 text-[10px] font-semibold tabular-nums text-emerald-400/90">
                  ×{a.bonus.toFixed(2)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">{a.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
