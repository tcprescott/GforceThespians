import { useGameStore } from '../game/store';
import { artifactUnlocked } from '../game/engine';
import { ARTIFACTS, ARTIFACT_META } from '../game/content';
import { formatNumber } from '../lib/format';

export function ArtifactsPanel() {
  const state = useGameStore();
  const buy = useGameStore((s) => s.purchaseArtifact);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {ARTIFACTS.map((a) => {
        const owned = state.artifacts.includes(a.id);
        const unlocked = artifactUnlocked(state, a.id);
        const affordable = !owned && unlocked && state.riderCredits >= a.cost;
        return (
          <button
            key={a.id}
            onClick={() => affordable && buy(a.id)}
            disabled={!affordable}
            className={`rounded-lg border p-3 text-left transition-colors ${
              owned
                ? 'border-amber-400/50 bg-amber-400/5'
                : !unlocked
                  ? 'border-zinc-800 bg-zinc-900/40 opacity-50'
                  : affordable
                    ? 'border-emerald-500/40 bg-zinc-800/60 hover:border-emerald-400 hover:bg-zinc-800 cursor-pointer'
                    : 'border-zinc-700/50 bg-zinc-900/40 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold text-zinc-100">🏺 {a.name}</span>
              {owned ? (
                <span className="shrink-0 text-xs font-bold text-amber-300">Acquired</span>
              ) : (
                <span className="shrink-0 text-xs font-semibold tabular-nums text-emerald-300">
                  ⭐ {formatNumber(a.cost)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-snug text-zinc-400">{a.description}</p>
            {!unlocked && !owned && (
              <p className="mt-1 text-[10px] text-zinc-600">
                Requires: {(a.requires ?? []).map((r) => ARTIFACT_META[r]?.name).join(', ')}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
