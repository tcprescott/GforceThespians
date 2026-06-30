import { useGameStore } from '../game/store';
import { revealedCurrencies } from '../game/selectors';
import { formatDuration, formatNumber } from '../lib/format';
import { OFFLINE_CAP_SECONDS } from '../game/balance';

/** "While you were away..." — shown once on load if offline progress accrued. */
export function OfflineModal() {
  const summary = useGameStore((s) => s.offlineSummary);
  const state = useGameStore();
  const dismiss = useGameStore((s) => s.dismissOffline);
  if (!summary) return null;

  const gains = revealedCurrencies(state).filter(
    (c) => c.id !== 'riderCredits' && (summary.gains[c.id] ?? 0) > 0,
  );
  const capped = summary.seconds > summary.cappedSeconds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 shadow-2xl">
        <h2 className="text-xl font-black text-amber-200">🎭 The show went on without you</h2>
        <p className="mt-1 text-sm text-zinc-400">
          You were away for <span className="font-semibold text-zinc-200">{formatDuration(summary.seconds)}</span>.
          The cats kept performing.
        </p>

        <div className="mt-4 flex flex-col gap-1.5">
          {gains.length === 0 && (
            <p className="text-sm text-zinc-500">Nothing was producing yet — but the stage is set.</p>
          )}
          {gains.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-1.5">
              <span className="text-sm text-zinc-300">
                {c.symbol} {c.name}
              </span>
              <span className={`text-sm font-bold tabular-nums ${c.color}`}>
                +{formatNumber(summary.gains[c.id])}
              </span>
            </div>
          ))}
        </div>

        {capped && (
          <p className="mt-3 text-[11px] text-zinc-500">
            (Offline earnings are capped at {formatDuration(OFFLINE_CAP_SECONDS)} and credited at
            reduced efficiency.)
          </p>
        )}

        <button
          onClick={dismiss}
          className="mt-5 w-full rounded-lg bg-amber-500 px-4 py-2.5 font-bold text-amber-950 hover:bg-amber-400"
        >
          Back to the show
        </button>
      </div>
    </div>
  );
}
