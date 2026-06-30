import type { GameState } from '../game/state';
import { HARMONY_MAX } from '../game/balance';
import { formatNumber } from '../lib/format';

/**
 * Visualizes the Act Three balance between G-Force and Dramatic Tension and the
 * resulting global multiplier. A centered marker = harmony = peak output.
 */
export function HarmonyMeter({ harmony, state }: { harmony: number; state: GameState }) {
  const g = state.currencies.gforce;
  const t = state.currencies.tension;
  const total = g + t;
  // 0 = all G-Force, 1 = all Tension, 0.5 = balanced. Guard against Infinity
  // (Infinity/Infinity = NaN would produce `left: NaN%`).
  const split = Number.isFinite(total) && total > 0 ? Math.min(1, Math.max(0, t / total)) : 0.5;
  const quality = harmony / HARMONY_MAX; // 0..1

  const tone =
    quality > 0.8 ? 'text-emerald-300' : quality > 0.45 ? 'text-amber-300' : 'text-rose-300';

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-cyan-300/80">Harmony</span>
        <span className={`font-bold tabular-nums ${tone}`}>×{formatNumber(harmony)} output</span>
      </div>

      {/* Balance bar */}
      <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800">
        <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-500" />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-cyan-300 transition-all"
          style={{ left: `${split * 100}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
        <span>🌀 G-Force {formatNumber(g)}</span>
        <span>{formatNumber(t)} Tension 🎻</span>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-zinc-500">
        Keep G-Force and Tension balanced to amplify <em>all</em> production. Skew too far and the
        show wobbles.
      </p>
    </div>
  );
}
