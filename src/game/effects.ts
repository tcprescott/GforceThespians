import type { CurrencyId, Effect } from './types';
import type { GameState } from './state';
import { UPGRADE_META } from './content/upgrades';
import { TALENT_META } from './content/talents';
import { ARTIFACT_META } from './content/artifacts';
import { ACHIEVEMENT_META } from './content/achievements';

// Aggregated multipliers, computed once per tick from every active bonus source.
export interface EffectTotals {
  clickFlat: number;
  clickMult: number;
  /** Per-target generator multiplier (key 'all' applies to every generator). */
  genMult: Record<string, number>;
  currencyMult: Partial<Record<CurrencyId, number>>;
  global: number;
  /** Per-target cost multiplier (key 'all' applies to every generator). */
  costMult: Record<string, number>;
  prestigeMult: number;
  offlineMult: number;
  /** Stacking product of earned-achievement bonuses. */
  achievementMult: number;
}

function emptyTotals(): EffectTotals {
  return {
    clickFlat: 0,
    clickMult: 1,
    genMult: {},
    currencyMult: {},
    global: 1,
    costMult: {},
    prestigeMult: 1,
    offlineMult: 1,
    achievementMult: 1,
  };
}

/**
 * Fold one effect into the totals, applied `rank` times.
 *   • multiplicative effects → factor^rank
 *   • flat effects → amount*rank
 */
function fold(t: EffectTotals, effect: Effect, rank: number): void {
  switch (effect.kind) {
    case 'clickFlat':
      t.clickFlat += effect.amount * rank;
      break;
    case 'clickMult':
      t.clickMult *= Math.pow(effect.factor, rank);
      break;
    case 'genMult':
      t.genMult[effect.target] = (t.genMult[effect.target] ?? 1) * Math.pow(effect.factor, rank);
      break;
    case 'currencyMult':
      t.currencyMult[effect.currency] =
        (t.currencyMult[effect.currency] ?? 1) * Math.pow(effect.factor, rank);
      break;
    case 'globalMult':
      t.global *= Math.pow(effect.factor, rank);
      break;
    case 'costMult':
      t.costMult[effect.target] = (t.costMult[effect.target] ?? 1) * Math.pow(effect.factor, rank);
      break;
    case 'prestigeMult':
      t.prestigeMult *= Math.pow(effect.factor, rank);
      break;
    case 'offlineMult':
      t.offlineMult *= Math.pow(effect.factor, rank);
      break;
  }
}

/** Aggregate every active bonus (upgrades, talents, artifacts, achievements). */
export function aggregateEffects(state: GameState): EffectTotals {
  const t = emptyTotals();

  // Upgrades — purchased once each.
  for (const id of state.upgrades) {
    const def = UPGRADE_META[id];
    if (!def) continue;
    for (const e of def.effects) fold(t, e, 1);
  }

  // Talents — ranked.
  for (const [id, rank] of Object.entries(state.talents)) {
    if (rank <= 0) continue;
    const def = TALENT_META[id];
    if (!def) continue;
    for (const e of def.effects) fold(t, e, rank);
  }

  // Artifacts — owned once each.
  for (const id of state.artifacts) {
    const def = ARTIFACT_META[id];
    if (!def) continue;
    for (const e of def.effects) fold(t, e, 1);
  }

  // Achievements — each contributes a small stacking global multiplier.
  for (const id of state.achievements) {
    const def = ACHIEVEMENT_META[id];
    if (!def) continue;
    t.achievementMult *= def.bonus;
  }

  return t;
}

/** Effective generator output multiplier for a given generator id. */
export function genMultFor(t: EffectTotals, generatorId: string): number {
  return (t.genMult['all'] ?? 1) * (t.genMult[generatorId] ?? 1);
}

/** Effective cost multiplier for a given generator id. */
export function costMultFor(t: EffectTotals, generatorId: string): number {
  return (t.costMult['all'] ?? 1) * (t.costMult[generatorId] ?? 1);
}

/** Currency multiplier (defaults to 1). */
export function currencyMultFor(t: EffectTotals, currency: CurrencyId): number {
  return t.currencyMult[currency] ?? 1;
}
