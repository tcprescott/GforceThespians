/* eslint-disable no-console */
// ===========================================================================
// Headless balance simulator for The G-Force Thespians.
//
//   npx tsx scripts/sim.ts            # single fresh run to first prestige
//   npx tsx scripts/sim.ts --runs 4  # simulate 4 prestige cycles
//
// Drives the PURE engine with an idle-player strategy and reports how long
// (in simulated game-time) each act takes to unlock — so we can tune for the
// chosen "marathon idle" pacing without waiting actual days.
// ===========================================================================
import type { CurrencyId } from '../src/game/types';
import type { GameState } from '../src/game/state';
import { createInitialState, zeroBag } from '../src/game/state';
import {
  buyArtifact,
  buyBlueprint,
  buyGenerator,
  buyTalent,
  buyUpgrade,
  canPrestige,
  dispatchCoaster,
  doPrestige,
  generatorCost,
  prestigePending,
  productionRates,
  tick as engineTick,
  totalGeneratorsOwned,
  upgradeStatus,
} from '../src/game/engine';
import {
  ARTIFACTS,
  BLUEPRINTS,
  GENERATORS,
  PHASES,
  TALENTS,
  UPGRADES,
} from '../src/game/content';
import { formatNumber } from '../src/lib/format';

// --- A rough "value" for each currency, used to rank purchases. ------------
const VALUE: Record<CurrencyId, number> = {
  zoomies: 1,
  bravos: 8,
  kibble: 3,
  gforce: 50,
  tension: 50,
  moonlight: 3000,
  riderCredits: 0,
};

// For forks, the simulated player picks the "safe / balanced" build.
const PREFERRED_FORK: Record<string, string> = {
  'p1-style': 'p1-fork-crowd-pleaser',
  'p2-automation': 'p2-fork-sustainable',
  'p3-discipline': 'p3-fork-harmony',
  'p4-doctrine': 'p4-fork-resonance',
};

function fmtTime(sec: number): string {
  if (sec < 60) return `${sec.toFixed(0)}s`;
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m || (!d && !h)) parts.push(`${m}m`);
  return parts.join(' ');
}

// --- Strategy ---------------------------------------------------------------

function buyUpgrades(s: GameState): GameState {
  for (const u of UPGRADES) {
    if (u.phase > s.phaseUnlocked) continue;
    if (upgradeStatus(s, u.id) !== 'available') continue;
    if (u.exclusiveGroup && PREFERRED_FORK[u.exclusiveGroup] !== u.id) continue;
    s = buyUpgrade(s, u.id);
  }
  return s;
}

/** Keep fuel currencies non-negative by buying their best producers. */
function fuelGuard(s: GameState): GameState {
  const fuels: CurrencyId[] = ['kibble'];
  for (const fuel of fuels) {
    for (let i = 0; i < 25; i++) {
      const net = productionRates(s).net[fuel];
      if (net >= 0) break;
      // best affordable producer of this fuel
      let best: string | null = null;
      let bestRatio = 0;
      for (const g of GENERATORS) {
        if (g.phase > s.phaseUnlocked) continue;
        const out = g.output[fuel] ?? 0;
        if (out <= 0) continue;
        const cost = generatorCost(s, g.id);
        if (s.currencies[g.costCurrency] < cost) continue;
        const ratio = out / (cost * VALUE[g.costCurrency]);
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = g.id;
        }
      }
      if (!best) break;
      const ns = buyGenerator(s, best, 1);
      if (ns === s) break;
      s = ns;
    }
  }
  return s;
}

function bestGenerator(s: GameState): string | null {
  let best: string | null = null;
  let bestRatio = 0;
  for (const g of GENERATORS) {
    if (g.phase > s.phaseUnlocked) continue;
    const cost = generatorCost(s, g.id);
    if (s.currencies[g.costCurrency] < cost) continue;
    let value = 0;
    for (const cur in g.output) value += (g.output[cur as CurrencyId] ?? 0) * VALUE[cur as CurrencyId];
    const costValue = cost * VALUE[g.costCurrency];
    const ratio = costValue > 0 ? value / costValue : 0;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = g.id;
    }
  }
  return best;
}

function decide(s: GameState): GameState {
  // Cold-start: click to bootstrap until something passively produces zoomies
  // (models the idle-forward "click kickstart"). Stops the instant a generator
  // is making zoomies on its own.
  let guard = 0;
  while (productionRates(s).net.zoomies <= 0 && guard++ < 2000) {
    s = dispatchCoaster(s);
    const id = bestGenerator(s);
    if (id) s = buyGenerator(s, id, 1);
  }
  s = buyUpgrades(s);
  s = fuelGuard(s);
  for (let i = 0; i < 60; i++) {
    const id = bestGenerator(s);
    if (!id) break;
    const ns = buyGenerator(s, id, 1);
    if (ns === s) break;
    s = ns;
  }
  return s;
}

/** Spend Rider Credits greedily on talents/blueprints/artifacts after a reset. */
function spendCredits(s: GameState): GameState {
  let changed = true;
  while (changed) {
    changed = false;
    // Cheapest useful thing first.
    type Buy = { kind: 'talent' | 'artifact' | 'blueprint'; id: string; cost: number };
    const options: Buy[] = [];
    for (const t of TALENTS) {
      const rank = s.talents[t.id] ?? 0;
      if (rank >= t.maxRank) continue;
      if (t.requires && !t.requires.every((r) => (s.talents[r] ?? 0) > 0)) continue;
      options.push({ kind: 'talent', id: t.id, cost: Math.floor(t.baseCost * t.costGrowth ** rank) });
    }
    for (const a of ARTIFACTS) {
      if (s.artifacts.includes(a.id)) continue;
      if (a.requires && !a.requires.every((r) => s.artifacts.includes(r))) continue;
      options.push({ kind: 'artifact', id: a.id, cost: a.cost });
    }
    for (const b of BLUEPRINTS) {
      if (s.blueprints.includes(b.id)) continue;
      if (b.requires && !b.requires.every((r) => s.blueprints.includes(r))) continue;
      options.push({ kind: 'blueprint', id: b.id, cost: b.cost });
    }
    options.sort((a, b) => a.cost - b.cost);
    for (const opt of options) {
      if (opt.cost > s.riderCredits) continue;
      const before = s;
      if (opt.kind === 'talent') s = buyTalent(s, opt.id);
      else if (opt.kind === 'artifact') s = buyArtifact(s, opt.id);
      else s = buyBlueprint(s, opt.id);
      if (s !== before) {
        changed = true;
        break;
      }
    }
  }
  return s;
}

// --- Main loop --------------------------------------------------------------

const DT = 1; // simulate at 1 game-second granularity
const DECISION_EVERY = 3;
const MAX_RUN_SECONDS = 14 * 86400; // give up after 14 sim-days per run

function simulateRun(s: GameState, runIndex: number): GameState {
  const phaseAt: Record<number, number> = {};
  phaseAt[s.phaseUnlocked] = 0;
  let lastPhase = s.phaseUnlocked;
  let t = 0;
  let nextDay = 86400;

  console.log(`\n========== RUN ${runIndex + 1} ==========`);
  console.log(
    `start: phase ${s.phaseUnlocked}, riderCredits ${s.riderCredits}, talents ${Object.keys(s.talents).length}, artifacts ${s.artifacts.length}, blueprints ${s.blueprints.length}`,
  );

  while (t < MAX_RUN_SECONDS) {
    s = engineTick(s, DT, t * 1000);
    t += DT;
    if (t % DECISION_EVERY === 0) s = decide(s);

    if (s.phaseUnlocked > lastPhase) {
      for (let p = lastPhase + 1; p <= s.phaseUnlocked; p++) phaseAt[p] = t;
      lastPhase = s.phaseUnlocked;
      const ph = PHASES.find((p) => p.id === lastPhase)!;
      console.log(`  [${fmtTime(t).padStart(10)}] unlocked Phase ${lastPhase}: ${ph.name}`);
    }

    if (t >= nextDay) {
      const r = productionRates(s).net;
      console.log(
        `  · day ${(t / 86400).toFixed(0)}: P${s.phaseUnlocked} gens=${totalGeneratorsOwned(s)} ` +
          `Z=${formatNumber(s.currencies.zoomies)} (${formatNumber(r.zoomies)}/s) ` +
          `K=${formatNumber(s.currencies.kibble)} G=${formatNumber(s.currencies.gforce)} ` +
          `T=${formatNumber(s.currencies.tension)} M=${formatNumber(s.currencies.moonlight)} ` +
          `pending🎟️=${prestigePending(s)}`,
      );
      nextDay += 86400;
    }

    if (canPrestige(s)) {
      console.log(
        `  [${fmtTime(t).padStart(10)}] PRESTIGE available: ${prestigePending(s)} Rider Credits ` +
          `(total gens ${totalGeneratorsOwned(s)})`,
      );
      break;
    }
  }

  if (!canPrestige(s)) {
    const r = productionRates(s).net;
    console.log(
      `  !! STALLED after ${fmtTime(t)} at Phase ${s.phaseUnlocked}. ` +
        `Z=${formatNumber(s.currencies.zoomies)}(${formatNumber(r.zoomies)}/s) ` +
        `K=${formatNumber(s.currencies.kibble)}(${formatNumber(r.kibble)}/s) ` +
        `G=${formatNumber(s.currencies.gforce)} T=${formatNumber(s.currencies.tension)} ` +
        `M=${formatNumber(s.currencies.moonlight)}`,
    );
  }

  console.log('  phase unlock times:');
  for (const p of PHASES) {
    if (phaseAt[p.id] !== undefined) console.log(`    Phase ${p.id} (${p.name}): ${fmtTime(phaseAt[p.id])}`);
  }
  return s;
}

function main() {
  const runsArg = process.argv.indexOf('--runs');
  const runs = runsArg >= 0 ? parseInt(process.argv[runsArg + 1], 10) : 1;

  let s = createInitialState(0);
  for (let i = 0; i < runs; i++) {
    s = simulateRun(s, i);
    if (canPrestige(s)) {
      const before = s.riderCredits;
      const pending = prestigePending(s);
      s = doPrestige(s, 0);
      s = spendCredits(s);
      console.log(
        `  prestiged → +${pending} credits (had ${before}), now own ` +
          `${Object.keys(s.talents).length} talent lines, ${s.artifacts.length} artifacts, ${s.blueprints.length} blueprints`,
      );
    } else {
      console.log('  (no prestige — stopping)');
      break;
    }
  }
  void zeroBag; // (kept for debugging imports)
  console.log('\ndone.');
}

main();
