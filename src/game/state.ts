import type { AutoRule, CurrencyBag, CurrencyId, LogEntry } from './types';
import { CURRENCY_IDS } from './content/currencies';
import { BLUEPRINT_META } from './content/blueprints';

// ===========================================================================
// GameState — pure data. No functions, no React. The engine transforms it and
// the store/simulator hold it. Split into "run" fields (wiped by a Director's
// Cut) and "persistent" fields (carried across resets forever).
// ===========================================================================

export interface GameStats {
  totalClicks: number;
  prestiges: number;
  /** Wall-clock seconds played (accumulated each tick). */
  playtimeSeconds: number;
  /** Highest phase ever reached, across all runs. */
  maxPhaseEver: number;
  /** All-time earned, for the Stats panel (persists across resets). */
  allTime: CurrencyBag;
  /** Epoch ms of the current run's start. */
  runStartedAt: number;
}

export interface GameState {
  // --- Run fields (reset on prestige) ---
  currencies: CurrencyBag;
  /** Cumulative earned THIS run — drives phase unlocks + prestige score. */
  lifetime: CurrencyBag;
  owned: Record<string, number>; // generatorId -> count
  upgrades: string[]; // purchased upgrade ids this run
  exclusiveChosen: Record<string, string>; // fork group -> chosen upgrade id
  phaseUnlocked: number; // highest phase available this run (1..5)

  // --- Persistent fields (survive prestige) ---
  riderCredits: number;
  talents: Record<string, number>; // talentId -> rank
  artifacts: string[];
  blueprints: string[];
  achievements: string[];
  firedMilestones: string[]; // includes 'phase-N' unlock notes — fire once ever
  autoDispatch: boolean;
  autoRules: Record<string, AutoRule>;
  stats: GameStats;

  // --- Narrative + bookkeeping ---
  log: LogEntry[];
  nextLogId: number;
  /** Epoch ms when the state was last "seen" (for offline progress). */
  lastSeen: number;
  /**
   * Transient global multiplier from a currently-active "The Company Improvises" event
   * (1 = none). Set by the store during active play; the pure engine only reads
   * it, so the simulator (which never sets it) stays deterministic. Not persisted.
   */
  eventMult: number;
}

export const MAX_LOG_ENTRIES = 140;

const INTRO_NOTE =
  'The curtain rises on a beige living room. A desk-lamp spotlight hums to life. Somewhere in the wings, the lead clears her throat.';

/** A zeroed bag of every currency. */
export function zeroBag(): CurrencyBag {
  const bag = {} as CurrencyBag;
  for (const id of CURRENCY_IDS) bag[id as CurrencyId] = 0;
  return bag;
}

/** Copy a currency bag. */
export function copyBag(bag: CurrencyBag): CurrencyBag {
  return { ...bag };
}

/**
 * Build the owned-generator map and phase floor implied by owned blueprints
 * (head-starts and auto-unlocked acts). Used at the start of every run.
 */
function blueprintStart(blueprints: string[]): {
  owned: Record<string, number>;
  phaseFloor: number;
} {
  const owned: Record<string, number> = {};
  let phaseFloor = 1;
  for (const id of blueprints) {
    const bp = BLUEPRINT_META[id];
    if (!bp) continue;
    if (bp.effect.kind === 'startingGenerators') {
      owned[bp.effect.generator] = (owned[bp.effect.generator] ?? 0) + bp.effect.amount;
    } else if (bp.effect.kind === 'autoUnlockPhase') {
      phaseFloor = Math.max(phaseFloor, bp.effect.phase);
    }
  }
  return { owned, phaseFloor };
}

interface Persistent {
  riderCredits: number;
  talents: Record<string, number>;
  artifacts: string[];
  blueprints: string[];
  achievements: string[];
  firedMilestones: string[];
  autoDispatch: boolean;
  autoRules: Record<string, AutoRule>;
  stats: GameStats;
  log: LogEntry[];
  nextLogId: number;
}

/** Construct a fresh RUN on top of the given persistent progress. */
export function freshRunState(persistent: Persistent, now: number): GameState {
  const { owned, phaseFloor } = blueprintStart(persistent.blueprints);
  return {
    currencies: zeroBag(),
    lifetime: zeroBag(),
    owned,
    upgrades: [],
    exclusiveChosen: {},
    phaseUnlocked: phaseFloor,

    riderCredits: persistent.riderCredits,
    talents: persistent.talents,
    artifacts: persistent.artifacts,
    blueprints: persistent.blueprints,
    achievements: persistent.achievements,
    firedMilestones: persistent.firedMilestones,
    autoDispatch: persistent.autoDispatch,
    autoRules: persistent.autoRules,
    stats: { ...persistent.stats, runStartedAt: now },

    log: persistent.log,
    nextLogId: persistent.nextLogId,
    lastSeen: now,
    eventMult: 1,
  };
}

/** A brand-new game (no persistent progress at all). */
export function createInitialState(now: number): GameState {
  const stats: GameStats = {
    totalClicks: 0,
    prestiges: 0,
    playtimeSeconds: 0,
    maxPhaseEver: 1,
    allTime: zeroBag(),
    runStartedAt: now,
  };
  return freshRunState(
    {
      riderCredits: 0,
      talents: {},
      artifacts: [],
      blueprints: [],
      achievements: [],
      firedMilestones: [],
      autoDispatch: false,
      autoRules: {},
      stats,
      log: [{ id: 0, text: INTRO_NOTE, tone: 'system' }],
      nextLogId: 1,
    },
    now,
  );
}
