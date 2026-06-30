// ===========================================================================
// The G-Force Thespians — core type vocabulary
//
// The whole game is data-driven: balances live in the store, definitions live
// in `content/`, and the engine (`engine.ts`) is a set of PURE functions over
// a plain `GameState`. Nothing here imports React, so the same logic powers
// both the live app and the headless balance simulator.
// ===========================================================================

// --- Currencies -----------------------------------------------------------

/** Every currency. New acts add new entries here. */
export type CurrencyId =
  | 'zoomies' // ⚡ raw kinetic chaos (Phase 1+)
  | 'bravos' // 🎭 theatrical acclaim (Phase 1+)
  | 'kibble' // 🍖 fuel, consumed by automation (Phase 2+)
  | 'gforce' // 🌀 raw G-force (Phase 3+)
  | 'tension' // 🎻 dramatic tension (Phase 3+)
  | 'moonlight' // 🌙 interstellar resonance (Phase 4+)
  | 'echoes' // 🔁 self-referential recursion (Phase 5+)
  | 'riderCredits'; // 🎟️ prestige currency (Phase 6 / Director's Cut)

export interface CurrencyDef {
  id: CurrencyId;
  name: string;
  symbol: string;
  /** Tailwind text color class for amounts, e.g. 'text-amber-200'. */
  color: string;
  blurb: string;
  /** Phase at which this currency becomes relevant (for reveal ordering). */
  phase: number;
  /** Prestige currencies survive a Director's Cut reset. */
  persistent?: boolean;
}

/** A bag of currency amounts. */
export type CurrencyBag = Record<CurrencyId, number>;

// --- Declarative effects --------------------------------------------------
// Upgrades, talents, artifacts and achievements all express their power as a
// list of these. The engine aggregates them into multipliers at tick time, so
// adding a new bonus source never touches the math.

export type Effect =
  /** Add a flat amount to click power (in zoomies). */
  | { kind: 'clickFlat'; amount: number }
  /** Multiply click power. */
  | { kind: 'clickMult'; factor: number }
  /** Multiply one generator's output ('all' = every generator). */
  | { kind: 'genMult'; target: string; factor: number }
  /** Multiply all output (and clicks) of a specific currency. */
  | { kind: 'currencyMult'; currency: CurrencyId; factor: number }
  /** Multiply ALL passive generation globally. */
  | { kind: 'globalMult'; factor: number }
  /** Scale purchase cost of a generator ('all' allowed). factor<1 = discount. */
  | { kind: 'costMult'; target: string; factor: number }
  /** Multiply Rider Credits gained on prestige. */
  | { kind: 'prestigeMult'; factor: number }
  /** Multiply offline-progress efficiency. */
  | { kind: 'offlineMult'; factor: number };

// --- Generators -----------------------------------------------------------

export interface GeneratorDef {
  id: string;
  name: string;
  description: string;
  phase: number;
  /** Currency spent to buy a unit. */
  costCurrency: CurrencyId;
  baseCost: number;
  /** Cost of next unit = baseCost * costMultiplier^owned. */
  costMultiplier: number;
  /** Per-second production per unit owned. */
  output: Partial<CurrencyBag>;
  /** Per-second consumption per unit owned (fuel). Starves if unavailable. */
  consumes?: Partial<CurrencyBag>;
}

// --- Upgrades -------------------------------------------------------------

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  phase: number;
  cost: Partial<CurrencyBag>;
  effects: Effect[];
  /** Optional gate: only purchasable once this condition holds. */
  requires?: UnlockCondition;
  /**
   * Decision-driver: at most ONE upgrade per exclusive group may be bought per
   * run. Buying one locks out its siblings until the next Director's Cut. This
   * is what turns "buy everything" into a real build choice each phase.
   */
  exclusiveGroup?: string;
  /** Short label for the fork this upgrade belongs to (UI grouping). */
  forkLabel?: string;
  /** Marks an upgrade that carries a downside as well as an upside. */
  tradeoff?: boolean;
}

// --- Phases ---------------------------------------------------------------

export interface PhaseDef {
  id: number;
  act: string; // "Act One"
  name: string; // "The Mundane"
  tagline: string;
  blurb: string;
  /** Condition to unlock the phase. Phase 1 is always unlocked. */
  unlock: UnlockCondition | null;
  /** Narrative shown when the phase unlocks. */
  unlockNote: string;
  /** Accent color (tailwind), used for theming the phase. */
  accent: string;
}

// --- Conditions -----------------------------------------------------------
// Reusable predicate descriptors evaluated by the engine.

export type UnlockCondition =
  | { kind: 'lifetime'; currency: CurrencyId; amount: number }
  | { kind: 'currency'; currency: CurrencyId; amount: number }
  | { kind: 'owned'; generator: string; amount: number }
  | { kind: 'phase'; phase: number }
  | { kind: 'prestiges'; amount: number }
  | { kind: 'totalGenerators'; amount: number };

// --- Milestones (Director's Notes) ----------------------------------------

export interface Milestone {
  id: string;
  condition: UnlockCondition;
  text: string;
}

// --- Prestige: talents ----------------------------------------------------

export interface TalentDef {
  id: string;
  name: string;
  description: string;
  /** Tree column/row for layout. */
  tier: number;
  maxRank: number;
  /** Rider Credit cost of rank n (1-indexed) = baseCost * costGrowth^(n-1). */
  baseCost: number;
  costGrowth: number;
  /** Effects scale with rank (see engine for mult^rank / flat*rank rules). */
  effects: Effect[];
  /** Talent ids that must have >=1 rank before this unlocks. */
  requires?: string[];
}

// --- Prestige: artifacts --------------------------------------------------

export interface ArtifactDef {
  id: string;
  name: string;
  description: string;
  cost: number; // rider credits, one-time
  effects: Effect[];
  requires?: string[]; // other artifact ids
}

// --- Prestige: blueprints (permanent structural unlocks) ------------------

export type BlueprintEffect =
  | { kind: 'startingGenerators'; generator: string; amount: number }
  | { kind: 'unlockAutomation'; automation: string }
  | { kind: 'keepUpgrades' }
  | { kind: 'autoUnlockPhase'; phase: number };

export interface BlueprintDef {
  id: string;
  name: string;
  description: string;
  cost: number; // rider credits, one-time
  effect: BlueprintEffect;
  requires?: string[];
}

// --- Automation / logic gates ---------------------------------------------

export interface AutomationDef {
  id: string;
  name: string;
  description: string;
  /** How it's unlocked: via blueprint id, talent, or rider-credit purchase. */
  unlockedBy: 'blueprint' | 'talent' | 'free';
}

/** Per-generator auto-buy rule (a simple "logic gate"). */
export interface AutoRule {
  enabled: boolean;
  /** Keep this % of the cost currency in reserve before auto-buying. 0-100. */
  reservePercent: number;
}

// --- Achievements ---------------------------------------------------------

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  condition: UnlockCondition;
  /** Each earned achievement grants this global production multiplier. */
  bonus: number;
}

// --- Log ------------------------------------------------------------------

export type LogTone = 'note' | 'phase' | 'prestige' | 'achievement' | 'system';

export interface LogEntry {
  id: number;
  text: string;
  tone: LogTone;
}
