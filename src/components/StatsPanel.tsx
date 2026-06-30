import { useGameStore } from '../game/store';
import { aggregateEffects } from '../game/effects';
import { currentHarmony, prestigeScore, totalGeneratorsOwned } from '../game/engine';
import { ACHIEVEMENTS, CURRENCIES, PHASE_META } from '../game/content';
import { revealedCurrencies } from '../game/selectors';
import { formatDuration, formatInt, formatNumber } from '../lib/format';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="text-sm font-bold tabular-nums text-zinc-200">{value}</div>
    </div>
  );
}

export function StatsPanel() {
  const state = useGameStore();
  const totals = aggregateEffects(state);
  const globalPower = totals.global * totals.achievementMult * currentHarmony(state);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="Current Act" value={`${state.phaseUnlocked} · ${PHASE_META[Math.min(state.phaseUnlocked, 6)].name}`} />
        <Stat label="Director's Cuts" value={formatInt(state.stats.prestiges)} />
        <Stat label="Rider Credits" value={formatNumber(state.riderCredits)} />
        <Stat label="Playtime" value={formatDuration(state.stats.playtimeSeconds)} />
        <Stat label="Total Dispatches" value={formatInt(state.stats.totalClicks)} />
        <Stat label="Generators Owned" value={formatInt(totalGeneratorsOwned(state))} />
        <Stat label="Achievements" value={`${state.achievements.length}/${ACHIEVEMENTS.length}`} />
        <Stat label="Global Multiplier" value={`×${formatNumber(globalPower)}`} />
        <Stat label="Prestige Score" value={formatNumber(prestigeScore(state))} />
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          All-Time Earned
        </h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {revealedCurrencies(state)
            .filter((c) => c.id !== 'riderCredits')
            .map((c) => (
              <div
                key={c.id}
                className="flex items-baseline gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2"
              >
                <span className="text-sm">{c.symbol}</span>
                <span className={`text-sm font-bold tabular-nums ${c.color}`}>
                  {formatNumber(state.stats.allTime[c.id])}
                </span>
                <span className="text-[10px] text-zinc-500">{c.name}</span>
              </div>
            ))}
        </div>
      </div>

      <p className="text-[11px] text-zinc-600">
        {CURRENCIES.length} currencies · saved automatically to your browser · offline progress is
        credited when you return.
      </p>
    </div>
  );
}
