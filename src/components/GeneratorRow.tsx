import type { CurrencyId, GeneratorDef } from '../game/types';
import type { GameState } from '../game/state';
import type { EffectTotals } from '../game/effects';
import { useGameStore } from '../game/store';
import {
  affordableCount,
  generatorCost,
  hasAutomation,
} from '../game/engine';
import { CURRENCY_META } from '../game/content';
import { GLOBAL_OUTPUT_SCALE } from '../game/balance';
import { formatInt, formatNumber } from '../lib/format';

function flow(map: Partial<Record<CurrencyId, number>>, sign: string, perUnitScale = 1): string {
  return (Object.entries(map) as [CurrencyId, number][])
    .map(([cur, amt]) => `${sign}${formatNumber(amt * perUnitScale)} ${CURRENCY_META[cur].symbol}`)
    .join('  ');
}

export function GeneratorRow({
  def,
  state,
  totals,
}: {
  def: GeneratorDef;
  state: GameState;
  totals: EffectTotals;
}) {
  const buyGen = useGameStore((s) => s.buyGen);
  const buyGenMax = useGameStore((s) => s.buyGenMax);
  const setAutoRule = useGameStore((s) => s.setAutoRule);

  const owned = state.owned[def.id] ?? 0;
  const cost = generatorCost(state, def.id, totals);
  const balance = state.currencies[def.costCurrency];
  const affordable = balance >= cost;
  const maxBuy = affordableCount(state, def.id, balance, totals);
  const costMeta = CURRENCY_META[def.costCurrency];

  const autoBuyUnlocked = hasAutomation(state, 'auto-buy');
  const rule = state.autoRules[def.id];
  const autoOn = !!rule?.enabled;

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        affordable ? 'border-amber-500/30 bg-zinc-800/50' : 'border-zinc-700/50 bg-zinc-900/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-100">{def.name}</span>
            <span className="rounded bg-zinc-700/60 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-zinc-300">
              ×{formatInt(owned)}
            </span>
            {autoOn && <span className="text-[10px] text-emerald-400" title="Auto-buyer on">⚙️</span>}
          </div>
          <p className="mt-0.5 text-xs leading-snug text-zinc-400">{def.description}</p>
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs">
            <span className="tabular-nums text-emerald-400">{flow(def.output, '+', GLOBAL_OUTPUT_SCALE)}/s ea</span>
            {def.consumes && (
              <span className="tabular-nums text-rose-400/80">{flow(def.consumes, '−')}/s ea</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className={`text-sm font-semibold tabular-nums ${affordable ? 'text-amber-300' : 'text-rose-400/80'}`}>
            {costMeta.symbol} {formatNumber(cost)}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => buyGen(def.id, 1)}
              disabled={!affordable}
              className="rounded-md bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-amber-950 enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700/60 disabled:text-zinc-500"
            >
              Buy
            </button>
            <button
              onClick={() => buyGenMax(def.id)}
              disabled={maxBuy <= 0}
              className="rounded-md border border-amber-500/40 px-2.5 py-1 text-xs font-bold text-amber-300 enabled:hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:border-zinc-700/60 disabled:text-zinc-600"
              title={maxBuy > 0 ? `Buy ${maxBuy}` : 'Cannot afford'}
            >
              Max{maxBuy > 0 ? ` (${formatInt(maxBuy)})` : ''}
            </button>
          </div>
          {autoBuyUnlocked && (
            <label className="mt-0.5 flex cursor-pointer items-center gap-1 text-[10px] text-zinc-400">
              <input
                type="checkbox"
                checked={autoOn}
                onChange={(e) => setAutoRule(def.id, { enabled: e.target.checked })}
                className="h-3 w-3 accent-emerald-500"
              />
              auto
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
