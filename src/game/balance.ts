// ===========================================================================
// Balance tuning — the dials. Pacing target (chosen by the Director):
//   • Marathon idle: full 5-phase run to first prestige spans many hours/days
//   • Idle-forward:  clicks kickstart, generators + automation carry
//   • Strong prestige: Rider Credits give chunky permanent power
//   • Explosive numbers: suffix scaling all the way up
//
// These are imported by both the live store and the headless simulator, so the
// number we ship is the number we tested.
// ===========================================================================

/** Game heartbeat. */
export const TICKS_PER_SECOND = 10;
export const TICK_MS = 1000 / TICKS_PER_SECOND;

// --- Global pacing knobs --------------------------------------------------
// Single dials for the whole economy, respected by the engine AND the headless
// simulator. Tuned empirically (scripts/sim.ts) for marathon-idle pacing.
//
// Cost steepness is the master pacing control: it's ADDED to every generator's
// own costMultiplier. Because income grows exponentially, steeper costs are
// what stretch a run from minutes into the multi-hour/day "marathon" range.
export const GLOBAL_COST_GROWTH_ADD = 0.19;
/** Flat multiplier on every generator's per-second output (fine pacing trim). */
export const GLOBAL_OUTPUT_SCALE = 0.26;

/**
 * The Rising Wall. Phase-unlock thresholds scale with your *persistent* power
 * (talents + artifacts + achievements), raised to this exponent. Because a
 * run's income is proportional to that same power, the time to climb each act
 * stays roughly constant no matter how strong you get — so every run remains a
 * genuine marathon climb, never a one-minute formality. Slightly below 1.0 so
 * runs do get a little quicker as you master the show. (Only phase unlocks
 * scale this way; milestones/achievements never move.)
 */
export const WALL_POWER_TRACK = 0.82;

/** Single tick can't credit more than this much real time (anti-spike). */
export const MAX_TICK_DELTA_SECONDS = 1;

// --- Offline progress -----------------------------------------------------
// Marathon pacing assumes you leave and come back. Offline time is credited at
// a slight discount and capped generously (you can bank up to 3 days).
export const OFFLINE_CAP_SECONDS = 60 * 60 * 24 * 3; // 3 days
export const OFFLINE_EFFICIENCY = 0.6; // 60% of online rate while away (before bonuses)
/** Below this many seconds away, we don't bother with a welcome-back note. */
export const OFFLINE_MIN_SECONDS = 60;

// --- Prestige (Director's Cut) --------------------------------------------
// Rider Credits earned scale with lifetime "production score" (a weighted sum
// of lifetime currency earned). Sub-linear so each run is meaningful but not
// trivially repeatable — tuned for a handful of runs to clear the trees.
export const PRESTIGE_SCORE_DIVISOR = 1.5e17;
export const PRESTIGE_EXPONENT = 0.5;
/** You can't prestige until your run would yield at least this many credits. */
export const PRESTIGE_MIN_CREDITS = 1;
/** Weighted contribution of each lifetime currency to the prestige score. */
export const PRESTIGE_WEIGHTS: Record<string, number> = {
  zoomies: 1,
  bravos: 3,
  kibble: 0.25,
  gforce: 12,
  tension: 12,
  moonlight: 250,
  echoes: 5000,
};

// --- Achievements ---------------------------------------------------------
// Each earned achievement grants a small stacking global multiplier, so
// exploration quietly compounds. (Per-achievement bonus lives on the def.)
export const ACHIEVEMENT_GLOBAL_FLOOR = 1;

// --- Phase 3 balance mechanic ---------------------------------------------
// Output of the Absurd act is amplified when raw G-force and Dramatic Tension
// are kept in harmony, and damped when wildly imbalanced. The multiplier ranges
// across [MIN, MAX] based on how close the two pools are (by ratio).
export const HARMONY_MIN = 0.5;
export const HARMONY_MAX = 3;
/** Ratio (>=1) at or below which harmony is considered "perfect". */
export const HARMONY_PERFECT_RATIO = 1.1;
/** Ratio at/above which harmony bottoms out. */
export const HARMONY_WORST_RATIO = 12;

/** Soft cap helpers — keep click meaningful only early (idle-forward). */
export const BASE_CLICK_POWER = 1;
