import { useState } from 'react';
import { useGameStore } from '../game/store';
import { canPrestige, phaseRequirement, prestigePending } from '../game/engine';
import { CURRENCY_META, PHASE_META, PRESTIGE_PHASE } from '../game/content';
import { formatNumber } from '../lib/format';
import { TalentTree } from './TalentTree';
import { ArtifactsPanel } from './ArtifactsPanel';
import { BlueprintsPanel } from './BlueprintsPanel';

type Sub = 'talents' | 'artifacts' | 'blueprints';

export function DirectorsCut() {
  const state = useGameStore();
  const prestige = useGameStore((s) => s.prestige);
  const [sub, setSub] = useState<Sub>('talents');

  const unlocked = state.phaseUnlocked >= PRESTIGE_PHASE;

  if (!unlocked) {
    const req = phaseRequirement(state, PRESTIGE_PHASE);
    const phase = PHASE_META[PRESTIGE_PHASE];
    return (
      <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/[0.03] p-6 text-center">
        <p className="text-2xl">⭐</p>
        <h3 className="mt-1 text-lg font-bold text-emerald-300">{phase.name}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">{phase.blurb}</p>
        {req && (
          <p className="mt-3 text-xs text-zinc-500">
            Unlocks at{' '}
            <span className="font-semibold text-zinc-300">
              {formatNumber(req.amount)} {CURRENCY_META[req.currency].symbol}{' '}
              {CURRENCY_META[req.currency].name}
            </span>{' '}
            earned this run — you have {formatNumber(state.lifetime[req.currency])}.
          </p>
        )}
      </div>
    );
  }

  const pending = prestigePending(state);
  const ready = canPrestige(state);

  const doPrestige = () => {
    if (!ready) return;
    if (
      window.confirm(
        `Take your final bow? This strikes the set (currencies, generators, upgrades, phase progress) ` +
          `but banks ${pending.toLocaleString()} Legacy and keeps every talent, artifact, blueprint, and achievement.`,
      )
    ) {
      prestige();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Prestige header */}
      <section className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-emerald-200">⭐ The Revival</h3>
            <p className="text-xs text-zinc-400">
              You hold{' '}
              <span className="font-bold text-emerald-300">{formatNumber(state.riderCredits)}</span>{' '}
              Legacy · {state.stats.prestiges} revivals staged
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={doPrestige}
              disabled={!ready}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-black text-emerald-950 enabled:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700/60 disabled:text-zinc-500"
            >
              Take Your Bow {pending > 0 ? `(+${formatNumber(pending)})` : ''}
            </button>
            {!ready && (
              <p className="mt-1 max-w-[14rem] text-[10px] text-zinc-500">
                Build more this run to make a reset worthwhile.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sub-tabs */}
      <div className="flex gap-1 rounded-lg bg-zinc-900/60 p-1 text-sm">
        {(
          [
            ['talents', '🌳 Talents'],
            ['artifacts', '🏺 Artifacts'],
            ['blueprints', '📐 Blueprints'],
          ] as [Sub, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSub(key)}
            className={`flex-1 rounded-md px-3 py-1.5 font-semibold transition-colors ${
              sub === key ? 'bg-emerald-500/20 text-emerald-200' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === 'talents' && <TalentTree />}
      {sub === 'artifacts' && <ArtifactsPanel />}
      {sub === 'blueprints' && <BlueprintsPanel />}
    </div>
  );
}
