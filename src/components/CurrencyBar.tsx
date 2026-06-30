import { useGameStore } from '../game/store';
import { aggregateEffects } from '../game/effects';
import { productionRates } from '../game/engine';
import { revealedCurrencies, currencyBalance } from '../game/selectors';
import { formatNumber, formatRate } from '../lib/format';

/** Sticky readout of every revealed currency, with live per-second rates. */
export function CurrencyBar() {
  const state = useGameStore();
  const totals = aggregateEffects(state);
  const rates = productionRates(state, totals).net;
  const shown = revealedCurrencies(state);

  return (
    <div className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
        {shown.map((c) => {
          const rate = c.id === 'riderCredits' ? 0 : rates[c.id];
          return (
            <div key={c.id} className="flex items-baseline gap-1.5" title={c.blurb}>
              <span className="text-sm">{c.symbol}</span>
              <span className={`font-bold tabular-nums ${c.color}`}>
                {formatNumber(currencyBalance(state, c.id))}
              </span>
              <span className="text-[11px] text-zinc-500">{c.name}</span>
              {rate !== 0 && (
                <span
                  className={`text-[11px] tabular-nums ${rate >= 0 ? 'text-emerald-500/80' : 'text-rose-400/80'}`}
                >
                  {formatRate(rate)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
