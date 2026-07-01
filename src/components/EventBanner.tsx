import { useGameStore } from '../game/store';

/** Banner for an active "The Company Improvises" event, with a live countdown. */
export function EventBanner() {
  const ev = useGameStore((s) => s.activeEvent);
  // Re-renders every tick (the store updates ~10x/s), so the countdown is live.
  const lastSeen = useGameStore((s) => s.lastSeen);
  if (!ev) return null;

  const remaining = Math.max(0, (ev.until - lastSeen) / 1000);
  const pct = Math.max(0, Math.min(100, (remaining / ev.durationSeconds) * 100));

  return (
    <div className="border-b border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-600/20 via-violet-600/20 to-fuchsia-600/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xl">{ev.emoji}</span>
          <span className="font-black text-fuchsia-200">{ev.name}</span>
          <span className="rounded-full bg-fuchsia-500/25 px-2 py-0.5 text-xs font-bold text-fuchsia-100">
            ×{ev.mult} production
          </span>
          <span className="hidden text-xs text-zinc-300 sm:inline">{ev.text}</span>
          <span className="ml-auto text-xs font-semibold tabular-nums text-fuchsia-200">
            {remaining.toFixed(0)}s left
          </span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-fuchsia-950/40">
          <div
            className="h-full bg-fuchsia-400 transition-[width] duration-100 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
