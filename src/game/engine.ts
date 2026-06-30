import type { CurrencyBag, CurrencyId, LogEntry, UnlockCondition } from './types';
import type { GameState } from './state';
import { MAX_LOG_ENTRIES, freshRunState, zeroBag } from './state';
import { aggregateEffects, costMultFor, currencyMultFor, genMultFor } from './effects';
import type { EffectTotals } from './effects';
import {
  ACHIEVEMENTS,
  AUTO_DISPATCH_PER_SECOND,
  ARTIFACT_META,
  BLUEPRINT_META,
  CURRENCY_IDS,
  GENERATORS,
  GENERATOR_META,
  MILESTONES,
  PHASES,
  PHASE_META,
  TALENT_META,
  UPGRADE_META,
} from './content';
import {
  WALL_POWER_TRACK,
  BASE_CLICK_POWER,
  GLOBAL_COST_GROWTH_ADD,
  GLOBAL_OUTPUT_SCALE,
  HARMONY_MAX,
  HARMONY_MIN,
  HARMONY_PERFECT_RATIO,
  HARMONY_WORST_RATIO,
  OFFLINE_CAP_SECONDS,
  OFFLINE_EFFICIENCY,
  OFFLINE_MIN_SECONDS,
  PRESTIGE_EXPONENT,
  PRESTIGE_MIN_CREDITS,
  PRESTIGE_SCORE_DIVISOR,
  PRESTIGE_WEIGHTS,
} from './balance';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Effective per-tier cost growth = the generator's own multiplier + global steepness. */
const costGrowth = (mult: number) => mult + GLOBAL_COST_GROWTH_ADD;

// ---------------------------------------------------------------------------
// Conditions
// ---------------------------------------------------------------------------

export function totalGeneratorsOwned(state: GameState): number {
  let sum = 0;
  for (const id in state.owned) sum += state.owned[id];
  return sum;
}

export function evaluateCondition(state: GameState, cond: UnlockCondition): boolean {
  switch (cond.kind) {
    case 'lifetime':
      return state.lifetime[cond.currency] >= cond.amount;
    case 'currency':
      return state.currencies[cond.currency] >= cond.amount;
    case 'owned':
      return (state.owned[cond.generator] ?? 0) >= cond.amount;
    case 'phase':
      return state.phaseUnlocked >= cond.phase;
    case 'prestiges':
      return state.stats.prestiges >= cond.amount;
    case 'totalGenerators':
      return totalGeneratorsOwned(state) >= cond.amount;
  }
}

// ---------------------------------------------------------------------------
// The Rising Wall — phase thresholds scale with prestige count
// ---------------------------------------------------------------------------

export function ascensionFactor(state: GameState): number {
  // Persistent power = bonuses that survive a reset (talents/artifacts/
  // achievements), i.e. aggregate effects with this run's upgrades removed.
  const persistent = aggregateEffects({ ...state, upgrades: [] });
  const power = persistent.global * persistent.achievementMult;
  return Math.max(1, Math.pow(power, WALL_POWER_TRACK));
}

/** Wall-scaled requirement for a phase unlock (for checks and UI display). */
export function phaseRequirement(
  state: GameState,
  phaseId: number,
): { currency: CurrencyId; amount: number } | null {
  const phase = PHASE_META[phaseId];
  if (!phase || !phase.unlock || phase.unlock.kind !== 'lifetime') return null;
  return {
    currency: phase.unlock.currency,
    amount: phase.unlock.amount * ascensionFactor(state),
  };
}

function phaseUnlockMet(state: GameState, phaseId: number): boolean {
  const req = phaseRequirement(state, phaseId);
  if (!req) {
    const phase = PHASE_META[phaseId];
    return phase?.unlock ? evaluateCondition(state, phase.unlock) : false;
  }
  return state.lifetime[req.currency] >= req.amount;
}

// ---------------------------------------------------------------------------
// The Phase 3 harmony mechanic
// ---------------------------------------------------------------------------

/** Multiplier (HARMONY_MIN..HARMONY_MAX) from how balanced G-Force & Tension are. */
export function harmonyMultiplier(gforce: number, tension: number): number {
  if (gforce <= 0 || tension <= 0) return HARMONY_MIN;
  const ratio = Math.max(gforce, tension) / Math.min(gforce, tension); // >= 1
  if (ratio <= HARMONY_PERFECT_RATIO) return HARMONY_MAX;
  if (ratio >= HARMONY_WORST_RATIO) return HARMONY_MIN;
  // Interpolate in log space between "perfect" and "worst".
  const t =
    (Math.log(ratio) - Math.log(HARMONY_PERFECT_RATIO)) /
    (Math.log(HARMONY_WORST_RATIO) - Math.log(HARMONY_PERFECT_RATIO));
  return HARMONY_MAX + (HARMONY_MIN - HARMONY_MAX) * t;
}

/** Current harmony multiplier (1 before Act Three). */
export function currentHarmony(state: GameState): number {
  if (state.phaseUnlocked < 3) return 1;
  return harmonyMultiplier(state.currencies.gforce, state.currencies.tension);
}

// ---------------------------------------------------------------------------
// Production
// ---------------------------------------------------------------------------

export interface Production {
  /** Net per-second change per currency, after multipliers and fuel efficiency. */
  net: CurrencyBag;
  /** Gross per-second production (positive sources only). */
  gross: CurrencyBag;
  harmony: number;
  /** Per-currency fuel efficiency in [0,1] (1 = unconstrained). */
  efficiency: Partial<Record<CurrencyId, number>>;
}

/**
 * Compute production. `useBuffer` lets the current balance cover a fuel
 * shortfall this tick (true during real ticks, false for steady-state display).
 */
export function computeProduction(
  state: GameState,
  totals: EffectTotals,
  dt: number,
  useBuffer: boolean,
): Production {
  const harmony = currentHarmony(state);
  const globalMult = totals.global * totals.achievementMult * harmony;

  const gross = zeroBag();
  const consume = zeroBag();
  // Per-generator output/consume contributions, so efficiency can scale each.
  const contribs: { outs: Partial<CurrencyBag>; cons: Partial<CurrencyBag> }[] = [];

  for (const gen of GENERATORS) {
    const n = state.owned[gen.id] ?? 0;
    if (n <= 0) continue;
    const gf = genMultFor(totals, gen.id);

    const outs: Partial<CurrencyBag> = {};
    for (const cur in gen.output) {
      const c = cur as CurrencyId;
      const amt =
        (gen.output[c] ?? 0) * GLOBAL_OUTPUT_SCALE * n * gf * currencyMultFor(totals, c) * globalMult;
      outs[c] = amt;
      gross[c] += amt;
    }

    const cons: Partial<CurrencyBag> = {};
    if (gen.consumes) {
      for (const cur in gen.consumes) {
        const c = cur as CurrencyId;
        const amt = (gen.consumes[c] ?? 0) * n * gf; // appetite scales with the gen's own boosts
        cons[c] = amt;
        consume[c] += amt;
      }
    }

    contribs.push({ outs, cons });
  }

  // Fuel efficiency per consumed currency.
  const efficiency: Partial<Record<CurrencyId, number>> = {};
  for (const id of CURRENCY_IDS) {
    if (consume[id] > 0) {
      const buffer = useBuffer && dt > 0 ? state.currencies[id] / dt : 0;
      efficiency[id] = clamp((gross[id] + buffer) / consume[id], 0, 1);
    }
  }

  // Net = sum of (outputs - consumption), each generator scaled by its worst
  // fuel efficiency.
  const net = zeroBag();
  for (const c of contribs) {
    let eff = 1;
    for (const cur in c.cons) eff = Math.min(eff, efficiency[cur as CurrencyId] ?? 1);
    for (const cur in c.outs) net[cur as CurrencyId] += (c.outs[cur as CurrencyId] ?? 0) * eff;
    for (const cur in c.cons) net[cur as CurrencyId] -= (c.cons[cur as CurrencyId] ?? 0) * eff;
  }

  return { net, gross, harmony, efficiency };
}

/** Steady-state net rates for display (no buffer smoothing). */
export function productionRates(state: GameState, totals?: EffectTotals): Production {
  const t = totals ?? aggregateEffects(state);
  return computeProduction(state, t, 1, false);
}

// ---------------------------------------------------------------------------
// Clicking
// ---------------------------------------------------------------------------

export function clickValue(state: GameState, totals?: EffectTotals): number {
  const t = totals ?? aggregateEffects(state);
  return (BASE_CLICK_POWER + t.clickFlat) * t.clickMult * currencyMultFor(t, 'zoomies');
}

// ---------------------------------------------------------------------------
// Costs & buying
// ---------------------------------------------------------------------------

export function generatorCost(state: GameState, id: string, totals?: EffectTotals): number {
  const def = GENERATOR_META[id];
  if (!def) return Infinity;
  const owned = state.owned[id] ?? 0;
  const t = totals ?? aggregateEffects(state);
  return def.baseCost * Math.pow(costGrowth(def.costMultiplier), owned) * costMultFor(t, id);
}

/** Total cost to buy `count` units starting from current ownership. */
export function generatorBulkCost(
  state: GameState,
  id: string,
  count: number,
  totals?: EffectTotals,
): number {
  const def = GENERATOR_META[id];
  if (!def || count <= 0) return Infinity;
  const owned = state.owned[id] ?? 0;
  const t = totals ?? aggregateEffects(state);
  const unit = def.baseCost * costMultFor(t, id);
  const r = costGrowth(def.costMultiplier);
  // Geometric series: unit * r^owned * (r^count - 1) / (r - 1)
  return (unit * Math.pow(r, owned) * (Math.pow(r, count) - 1)) / (r - 1);
}

/** Largest count buyable for `budget` from current ownership. */
export function affordableCount(
  state: GameState,
  id: string,
  budget: number,
  totals?: EffectTotals,
): number {
  const def = GENERATOR_META[id];
  if (!def) return 0;
  const owned = state.owned[id] ?? 0;
  const t = totals ?? aggregateEffects(state);
  const r = costGrowth(def.costMultiplier);
  const unit = def.baseCost * costMultFor(t, id) * Math.pow(r, owned);
  if (budget < unit) return 0;
  // budget >= unit * (r^k - 1)/(r - 1)  →  solve for k
  const k = Math.log((budget * (r - 1)) / unit + 1) / Math.log(r);
  return Math.max(0, Math.floor(k));
}

/** Buy `count` units (default 1). Returns a new state, or the same if unaffordable. */
export function buyGenerator(
  state: GameState,
  id: string,
  count = 1,
  totals?: EffectTotals,
): GameState {
  const def = GENERATOR_META[id];
  if (!def || count <= 0) return state;
  const t = totals ?? aggregateEffects(state);
  const cost = generatorBulkCost(state, id, count, t);
  if (state.currencies[def.costCurrency] < cost) return state;
  const currencies = { ...state.currencies };
  currencies[def.costCurrency] -= cost;
  const owned = { ...state.owned, [id]: (state.owned[id] ?? 0) + count };
  return { ...state, currencies, owned };
}

/** Buy as many as affordable, keeping `reserveFraction` of the cost currency. */
export function buyGeneratorMax(
  state: GameState,
  id: string,
  reserveFraction = 0,
  totals?: EffectTotals,
): GameState {
  const def = GENERATOR_META[id];
  if (!def) return state;
  const t = totals ?? aggregateEffects(state);
  const budget = state.currencies[def.costCurrency] * (1 - clamp(reserveFraction, 0, 1));
  const count = affordableCount(state, id, budget, t);
  if (count <= 0) return state;
  return buyGenerator(state, id, count, t);
}

// --- Upgrades -------------------------------------------------------------

export type UpgradeStatus =
  | 'owned'
  | 'available'
  | 'unaffordable'
  | 'locked-requires'
  | 'locked-exclusive';

export function upgradeStatus(state: GameState, id: string): UpgradeStatus {
  const def = UPGRADE_META[id];
  if (!def) return 'locked-requires';
  if (state.upgrades.includes(id)) return 'owned';
  if (def.exclusiveGroup && state.exclusiveChosen[def.exclusiveGroup]) return 'locked-exclusive';
  if (def.requires && !evaluateCondition(state, def.requires)) return 'locked-requires';
  for (const cur in def.cost) {
    if (state.currencies[cur as CurrencyId] < (def.cost[cur as CurrencyId] ?? 0))
      return 'unaffordable';
  }
  return 'available';
}

export function buyUpgrade(state: GameState, id: string): GameState {
  if (upgradeStatus(state, id) !== 'available') return state;
  const def = UPGRADE_META[id]!;
  const currencies = { ...state.currencies };
  for (const cur in def.cost) currencies[cur as CurrencyId] -= def.cost[cur as CurrencyId] ?? 0;
  const upgrades = [...state.upgrades, id];
  const exclusiveChosen = def.exclusiveGroup
    ? { ...state.exclusiveChosen, [def.exclusiveGroup]: id }
    : state.exclusiveChosen;
  return { ...state, currencies, upgrades, exclusiveChosen };
}

// ---------------------------------------------------------------------------
// Unlock checks (phases, milestones, achievements) — run after any earning.
// ---------------------------------------------------------------------------

export function runUnlocks(state: GameState): GameState {
  let phaseUnlocked = state.phaseUnlocked;
  let firedMilestones = state.firedMilestones;
  let achievements = state.achievements;
  const newLogs: LogEntry[] = [];
  let nextLogId = state.nextLogId;

  // Phases (ascending — a big jump can unlock several at once).
  for (const phase of PHASES) {
    if (phase.id <= phaseUnlocked || !phase.unlock) continue;
    if (phaseUnlockMet(state, phase.id)) {
      phaseUnlocked = phase.id;
      const noteId = `phase-${phase.id}`;
      if (!firedMilestones.includes(noteId)) {
        if (firedMilestones === state.firedMilestones) firedMilestones = [...firedMilestones];
        firedMilestones.push(noteId);
        newLogs.push({ id: nextLogId++, text: phase.unlockNote, tone: 'phase' });
      }
    }
  }

  // Milestones.
  for (const m of MILESTONES) {
    if (firedMilestones.includes(m.id)) continue;
    if (evaluateCondition({ ...state, phaseUnlocked }, m.condition)) {
      if (firedMilestones === state.firedMilestones) firedMilestones = [...firedMilestones];
      firedMilestones.push(m.id);
      newLogs.push({ id: nextLogId++, text: m.text, tone: 'note' });
    }
  }

  // Achievements.
  for (const a of ACHIEVEMENTS) {
    if (achievements.includes(a.id)) continue;
    if (evaluateCondition({ ...state, phaseUnlocked }, a.condition)) {
      if (achievements === state.achievements) achievements = [...achievements];
      achievements.push(a.id);
      newLogs.push({ id: nextLogId++, text: `🏆 Achievement: ${a.name} — ${a.description}`, tone: 'achievement' });
    }
  }

  if (
    phaseUnlocked === state.phaseUnlocked &&
    firedMilestones === state.firedMilestones &&
    achievements === state.achievements
  ) {
    return state; // nothing changed
  }

  const maxPhaseEver = Math.max(state.stats.maxPhaseEver, phaseUnlocked);
  const log = newLogs.length ? [...newLogs.reverse(), ...state.log].slice(0, MAX_LOG_ENTRIES) : state.log;

  return {
    ...state,
    phaseUnlocked,
    firedMilestones,
    achievements,
    stats: maxPhaseEver !== state.stats.maxPhaseEver ? { ...state.stats, maxPhaseEver } : state.stats,
    log,
    nextLogId,
  };
}

// ---------------------------------------------------------------------------
// Automation
// ---------------------------------------------------------------------------

export function hasAutomation(state: GameState, automationId: string): boolean {
  for (const bpId of state.blueprints) {
    const bp = BLUEPRINT_META[bpId];
    if (bp && bp.effect.kind === 'unlockAutomation' && bp.effect.automation === automationId)
      return true;
  }
  return false;
}

const logicGatesUnlocked = (s: GameState) => hasAutomation(s, 'logic-gates');

/** Run all enabled auto-buyers once. */
export function runAutoBuy(state: GameState): GameState {
  if (!hasAutomation(state, 'auto-buy')) return state;
  let next = state;
  const totals = aggregateEffects(state); // costs barely change within one pass
  const gatesOn = logicGatesUnlocked(state);
  for (const gen of GENERATORS) {
    const rule = next.autoRules[gen.id];
    if (!rule || !rule.enabled) continue;
    // Only auto-buy generators in unlocked phases.
    if (gen.phase > next.phaseUnlocked) continue;
    const reserve = gatesOn ? clamp(rule.reservePercent / 100, 0, 0.99) : 0;
    next = buyGeneratorMax(next, gen.id, reserve, totals);
  }
  return next;
}

// ---------------------------------------------------------------------------
// Tick
// ---------------------------------------------------------------------------

export function tick(state: GameState, dt: number, now: number): GameState {
  if (dt <= 0) return { ...state, lastSeen: now };
  const totals = aggregateEffects(state);
  const { net } = computeProduction(state, totals, dt, true);

  const currencies = { ...state.currencies };
  const lifetime = { ...state.lifetime };
  const allTime = { ...state.stats.allTime };

  for (const cur of CURRENCY_IDS) {
    const delta = net[cur] * dt;
    if (delta !== 0) currencies[cur] = Math.max(0, currencies[cur] + delta);
    if (delta > 0) {
      lifetime[cur] += delta;
      allTime[cur] += delta;
    }
  }

  // Auto-Dispatcher.
  if (state.autoDispatch && hasAutomation(state, 'auto-dispatch')) {
    const gain = clickValue(state, totals) * AUTO_DISPATCH_PER_SECOND * dt;
    currencies.zoomies += gain;
    lifetime.zoomies += gain;
    allTime.zoomies += gain;
  }

  const stats = {
    ...state.stats,
    playtimeSeconds: state.stats.playtimeSeconds + dt,
    allTime,
  };

  let next: GameState = { ...state, currencies, lifetime, stats, lastSeen: now };
  next = runUnlocks(next);
  next = runAutoBuy(next);
  return next;
}

export function dispatchCoaster(state: GameState): GameState {
  const totals = aggregateEffects(state);
  const gain = clickValue(state, totals);
  const currencies = { ...state.currencies, zoomies: state.currencies.zoomies + gain };
  const lifetime = { ...state.lifetime, zoomies: state.lifetime.zoomies + gain };
  const stats = {
    ...state.stats,
    totalClicks: state.stats.totalClicks + 1,
    allTime: { ...state.stats.allTime, zoomies: state.stats.allTime.zoomies + gain },
  };
  return runUnlocks({ ...state, currencies, lifetime, stats });
}

// ---------------------------------------------------------------------------
// Prestige (The Director's Cut)
// ---------------------------------------------------------------------------

export function prestigeScore(state: GameState): number {
  let score = 0;
  for (const cur of CURRENCY_IDS) {
    const w = PRESTIGE_WEIGHTS[cur] ?? 0;
    if (w) score += state.lifetime[cur] * w;
  }
  return score;
}

export function prestigePending(state: GameState, totals?: EffectTotals): number {
  const t = totals ?? aggregateEffects(state);
  const score = prestigeScore(state);
  if (score <= 0) return 0;
  const raw = Math.pow(score / PRESTIGE_SCORE_DIVISOR, PRESTIGE_EXPONENT) * t.prestigeMult;
  const credits = Math.floor(raw);
  return credits >= PRESTIGE_MIN_CREDITS ? credits : 0;
}

export function canPrestige(state: GameState): boolean {
  return state.phaseUnlocked >= 5 && prestigePending(state) > 0;
}

export function doPrestige(state: GameState, now: number): GameState {
  const pending = prestigePending(state);
  if (!canPrestige(state) || pending <= 0) return state;

  const note: LogEntry = {
    id: state.nextLogId,
    text: `🎟️ The Director's Cut: reality strikes its set. You bank ${pending.toLocaleString()} Rider Credits and walk back to Act One.`,
    tone: 'prestige',
  };

  const persistent = {
    riderCredits: state.riderCredits + pending,
    talents: state.talents,
    artifacts: state.artifacts,
    blueprints: state.blueprints,
    achievements: state.achievements,
    firedMilestones: state.firedMilestones,
    autoDispatch: state.autoDispatch,
    autoRules: state.autoRules,
    stats: {
      ...state.stats,
      prestiges: state.stats.prestiges + 1,
    },
    log: [note, ...state.log].slice(0, MAX_LOG_ENTRIES),
    nextLogId: state.nextLogId + 1,
  };

  // Fresh run, then immediately evaluate unlocks (prestige-count milestones/achievements).
  return runUnlocks(freshRunState(persistent, now));
}

// ---------------------------------------------------------------------------
// Prestige purchases: talents, artifacts, blueprints
// ---------------------------------------------------------------------------

export function talentRank(state: GameState, id: string): number {
  return state.talents[id] ?? 0;
}

/** Rider-Credit cost to buy the NEXT rank of a talent. */
export function talentCost(state: GameState, id: string): number {
  const def = TALENT_META[id];
  if (!def) return Infinity;
  const rank = talentRank(state, id);
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, rank));
}

export function talentUnlocked(state: GameState, id: string): boolean {
  const def = TALENT_META[id];
  if (!def) return false;
  if (!def.requires) return true;
  return def.requires.every((req) => talentRank(state, req) > 0);
}

export function buyTalent(state: GameState, id: string): GameState {
  const def = TALENT_META[id];
  if (!def) return state;
  const rank = talentRank(state, id);
  if (rank >= def.maxRank) return state;
  if (!talentUnlocked(state, id)) return state;
  const cost = talentCost(state, id);
  if (state.riderCredits < cost) return state;
  return {
    ...state,
    riderCredits: state.riderCredits - cost,
    talents: { ...state.talents, [id]: rank + 1 },
  };
}

export function artifactUnlocked(state: GameState, id: string): boolean {
  const def = ARTIFACT_META[id];
  if (!def) return false;
  if (!def.requires) return true;
  return def.requires.every((req) => state.artifacts.includes(req));
}

export function buyArtifact(state: GameState, id: string): GameState {
  const def = ARTIFACT_META[id];
  if (!def || state.artifacts.includes(id)) return state;
  if (!artifactUnlocked(state, id)) return state;
  if (state.riderCredits < def.cost) return state;
  return {
    ...state,
    riderCredits: state.riderCredits - def.cost,
    artifacts: [...state.artifacts, id],
  };
}

export function blueprintUnlocked(state: GameState, id: string): boolean {
  const def = BLUEPRINT_META[id];
  if (!def) return false;
  if (!def.requires) return true;
  return def.requires.every((req) => state.blueprints.includes(req));
}

export function buyBlueprint(state: GameState, id: string): GameState {
  const def = BLUEPRINT_META[id];
  if (!def || state.blueprints.includes(id)) return state;
  if (!blueprintUnlocked(state, id)) return state;
  if (state.riderCredits < def.cost) return state;

  let next: GameState = {
    ...state,
    riderCredits: state.riderCredits - def.cost,
    blueprints: [...state.blueprints, id],
  };

  // Apply structural effects to the current run immediately where it makes sense.
  const eff = def.effect;
  if (eff.kind === 'autoUnlockPhase') {
    const phaseUnlocked = Math.max(next.phaseUnlocked, eff.phase);
    next = runUnlocks({ ...next, phaseUnlocked });
  } else if (eff.kind === 'startingGenerators') {
    next = {
      ...next,
      owned: { ...next.owned, [eff.generator]: (next.owned[eff.generator] ?? 0) + eff.amount },
    };
  }
  return next;
}

// ---------------------------------------------------------------------------
// Offline progress
// ---------------------------------------------------------------------------

export interface OfflineResult {
  state: GameState;
  /** null when the away time was too short to bother reporting. */
  summary: { seconds: number; cappedSeconds: number; gains: CurrencyBag } | null;
}

export function applyOffline(state: GameState, now: number): OfflineResult {
  const elapsed = (now - state.lastSeen) / 1000;
  if (!Number.isFinite(elapsed) || elapsed < OFFLINE_MIN_SECONDS) {
    return { state: { ...state, lastSeen: now }, summary: null };
  }
  const capped = Math.min(elapsed, OFFLINE_CAP_SECONDS);
  const totals = aggregateEffects(state);
  const { net } = computeProduction(state, totals, 1, false);
  const rate = OFFLINE_EFFICIENCY * totals.offlineMult;

  const currencies = { ...state.currencies };
  const lifetime = { ...state.lifetime };
  const allTime = { ...state.stats.allTime };
  const gains = zeroBag();

  for (const cur of CURRENCY_IDS) {
    const gain = Math.max(0, net[cur]) * capped * rate;
    if (gain > 0) {
      currencies[cur] += gain;
      lifetime[cur] += gain;
      allTime[cur] += gain;
      gains[cur] = gain;
    }
  }

  let next: GameState = {
    ...state,
    currencies,
    lifetime,
    stats: { ...state.stats, allTime },
    lastSeen: now,
  };
  next = runUnlocks(next);
  return { state: next, summary: { seconds: elapsed, cappedSeconds: capped, gains } };
}
