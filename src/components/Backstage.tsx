import { useGameStore } from '../game/store';
import { aggregateEffects } from '../game/effects';
import { phaseRequirement } from '../game/engine';
import { GENERATORS, PHASES, PHASE_META, CURRENCY_META, LAST_CONTENT_PHASE } from '../game/content';
import { accentFor } from './theme';
import { GeneratorRow } from './GeneratorRow';
import { formatNumber } from '../lib/format';

/** Middle tab — generators grouped by act, plus a teaser for the next act. */
export function Backstage() {
  const state = useGameStore();
  const totals = aggregateEffects(state);

  const phasesToShow = PHASES.filter((p) => p.id <= state.phaseUnlocked && p.id <= LAST_CONTENT_PHASE);
  const nextPhase = PHASE_META[state.phaseUnlocked + 1];
  const nextReq =
    nextPhase && nextPhase.id <= LAST_CONTENT_PHASE ? phaseRequirement(state, nextPhase.id) : null;

  return (
    <div className="flex flex-col gap-5">
      {phasesToShow.map((phase) => {
        const accent = accentFor(phase.accent);
        const gens = GENERATORS.filter((g) => g.phase === phase.id);
        return (
          <section key={phase.id}>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className={`text-sm font-bold ${accent.text}`}>
                {phase.act}: {phase.name}
              </h3>
              <span className="text-[11px] text-zinc-500">{phase.tagline}</span>
            </div>
            <div className="flex flex-col gap-2">
              {gens.map((g) => (
                <GeneratorRow key={g.id} def={g} state={state} totals={totals} />
              ))}
            </div>
          </section>
        );
      })}

      {nextPhase && nextReq && (
        <section className="rounded-xl border border-dashed border-zinc-700/70 bg-zinc-900/40 p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Next: {nextPhase.act}</p>
          <p className={`mt-1 text-base font-bold ${accentFor(nextPhase.accent).text}`}>
            🔒 {nextPhase.name}
          </p>
          <p className="mt-1 text-xs text-zinc-400">{nextPhase.tagline}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Unlocks at{' '}
            <span className="font-semibold text-zinc-300">
              {formatNumber(nextReq.amount)} {CURRENCY_META[nextReq.currency].symbol}{' '}
              {CURRENCY_META[nextReq.currency].name}
            </span>{' '}
            earned this run
            <span className="block text-zinc-600">
              (you have {formatNumber(state.lifetime[nextReq.currency])})
            </span>
          </p>
        </section>
      )}
    </div>
  );
}
