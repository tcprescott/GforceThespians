import type { CurrencyDef, CurrencyId } from './types';
import type { GameState } from './state';
import { CURRENCIES, PRESTIGE_PHASE } from './content';

// UI-facing derived helpers that don't belong in the core engine.

/** A currency is "revealed" once you've touched it or reached its phase. */
export function isCurrencyRevealed(state: GameState, def: CurrencyDef): boolean {
  if (def.id === 'riderCredits')
    return state.riderCredits > 0 || state.phaseUnlocked >= PRESTIGE_PHASE;
  return (
    state.currencies[def.id] > 0 ||
    state.lifetime[def.id] > 0 ||
    state.phaseUnlocked >= def.phase
  );
}

export function revealedCurrencies(state: GameState): CurrencyDef[] {
  return CURRENCIES.filter((c) => isCurrencyRevealed(state, c));
}

/** Canonical balance for a currency (Rider Credits live outside the bag). */
export function currencyBalance(state: GameState, id: CurrencyId): number {
  return id === 'riderCredits' ? state.riderCredits : state.currencies[id];
}
