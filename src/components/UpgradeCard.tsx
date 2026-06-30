import type { CurrencyId, UpgradeDef } from '../game/types';
import type { GameState } from '../game/state';
import { useGameStore } from '../game/store';
import { upgradeStatus } from '../game/engine';
import { CURRENCY_META } from '../game/content';
import { formatNumber } from '../lib/format';

function costLabel(cost: UpgradeDef['cost']): string {
  return (Object.entries(cost) as [CurrencyId, number][])
    .map(([cur, amt]) => `${formatNumber(amt)} ${CURRENCY_META[cur].symbol}`)
    .join('  ');
}

export function UpgradeCard({ def, state }: { def: UpgradeDef; state: GameState }) {
  const purchase = useGameStore((s) => s.purchaseUpgrade);
  const status = upgradeStatus(state, def.id);
  const owned = status === 'owned';
  const canBuy = status === 'available';
  const lockedExclusive = status === 'locked-exclusive';

  return (
    <button
      onClick={() => canBuy && purchase(def.id)}
      disabled={!canBuy}
      className={`w-full rounded-lg border p-3 text-left transition-colors ${
        owned
          ? 'border-emerald-500/40 bg-emerald-500/5'
          : canBuy
            ? 'border-amber-500/40 bg-zinc-800/60 hover:border-amber-400 hover:bg-zinc-800 cursor-pointer'
            : 'border-zinc-700/50 bg-zinc-900/40 opacity-60'
      } ${lockedExclusive ? 'opacity-35' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-zinc-100">{def.name}</span>
        <div className="flex shrink-0 items-center gap-1">
          {def.tradeoff && (
            <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-300">
              Tradeoff
            </span>
          )}
          {owned ? (
            <span className="text-xs font-bold text-emerald-400">✓ Owned</span>
          ) : (
            <span className="text-xs font-semibold tabular-nums text-amber-300">
              {costLabel(def.cost)}
            </span>
          )}
        </div>
      </div>
      <p className="mt-1 text-xs leading-snug text-zinc-400">{def.description}</p>
      {status === 'locked-requires' && (
        <p className="mt-1 text-[10px] text-zinc-600">Requires more progress to unlock.</p>
      )}
      {lockedExclusive && (
        <p className="mt-1 text-[10px] text-rose-400/70">Locked — you chose a different path this run.</p>
      )}
    </button>
  );
}
