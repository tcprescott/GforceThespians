import { useGameStore } from '../game/store';
import { blueprintUnlocked } from '../game/engine';
import { BLUEPRINTS, BLUEPRINT_META } from '../game/content';
import { formatNumber } from '../lib/format';

export function BlueprintsPanel() {
  const state = useGameStore();
  const buy = useGameStore((s) => s.purchaseBlueprint);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {BLUEPRINTS.map((b) => {
        const owned = state.blueprints.includes(b.id);
        const unlocked = blueprintUnlocked(state, b.id);
        const affordable = !owned && unlocked && state.riderCredits >= b.cost;
        return (
          <button
            key={b.id}
            onClick={() => affordable && buy(b.id)}
            disabled={!affordable}
            className={`rounded-lg border p-3 text-left transition-colors ${
              owned
                ? 'border-cyan-400/50 bg-cyan-400/5'
                : !unlocked
                  ? 'border-zinc-800 bg-zinc-900/40 opacity-50'
                  : affordable
                    ? 'border-emerald-500/40 bg-zinc-800/60 hover:border-emerald-400 hover:bg-zinc-800 cursor-pointer'
                    : 'border-zinc-700/50 bg-zinc-900/40 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold text-zinc-100">📐 {b.name}</span>
              {owned ? (
                <span className="shrink-0 text-xs font-bold text-cyan-300">Installed</span>
              ) : (
                <span className="shrink-0 text-xs font-semibold tabular-nums text-emerald-300">
                  ⭐ {formatNumber(b.cost)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-snug text-zinc-400">{b.description}</p>
            {!unlocked && !owned && (
              <p className="mt-1 text-[10px] text-zinc-600">
                Requires: {(b.requires ?? []).map((r) => BLUEPRINT_META[r]?.name).join(', ')}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
