/* eslint-disable no-console */
// Static content integrity check: every id referenced by an effect target,
// requires-chain, blueprint, achievement or milestone must actually exist.
import {
  ACHIEVEMENTS,
  ARTIFACTS,
  BLUEPRINTS,
  GENERATORS,
  MILESTONES,
  TALENTS,
  UPGRADES,
} from '../src/game/content';
import type { Effect, UnlockCondition } from '../src/game/types';

const genIds = new Set(GENERATORS.map((g) => g.id));
const talentIds = new Set(TALENTS.map((t) => t.id));
const artifactIds = new Set(ARTIFACTS.map((a) => a.id));
const blueprintIds = new Set(BLUEPRINTS.map((b) => b.id));
const upgradeIds = new Set(UPGRADES.map((u) => u.id));

const errors: string[] = [];
const err = (m: string) => errors.push(m);

function checkEffectTarget(where: string, e: Effect) {
  if ((e.kind === 'genMult' || e.kind === 'costMult') && e.target !== 'all' && !genIds.has(e.target)) {
    err(`${where}: effect ${e.kind} -> unknown generator '${e.target}'`);
  }
}

function checkCondition(where: string, c: UnlockCondition) {
  if (c.kind === 'owned' && !genIds.has(c.generator)) {
    err(`${where}: condition owns unknown generator '${c.generator}'`);
  }
}

// Duplicate id check across each list.
function dupes(name: string, ids: string[]) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) err(`${name}: duplicate id '${id}'`);
    seen.add(id);
  }
}
dupes('generators', GENERATORS.map((g) => g.id));
dupes('upgrades', UPGRADES.map((u) => u.id));
dupes('talents', TALENTS.map((t) => t.id));
dupes('artifacts', ARTIFACTS.map((a) => a.id));
dupes('blueprints', BLUEPRINTS.map((b) => b.id));
dupes('achievements', ACHIEVEMENTS.map((a) => a.id));
dupes('milestones', MILESTONES.map((m) => m.id));

for (const u of UPGRADES) {
  u.effects.forEach((e) => checkEffectTarget(`upgrade ${u.id}`, e));
  if (u.requires) checkCondition(`upgrade ${u.id}`, u.requires);
}
for (const t of TALENTS) {
  t.effects.forEach((e) => checkEffectTarget(`talent ${t.id}`, e));
  (t.requires ?? []).forEach((r) => {
    if (!talentIds.has(r)) err(`talent ${t.id}: requires unknown talent '${r}'`);
  });
}
for (const a of ARTIFACTS) {
  a.effects.forEach((e) => checkEffectTarget(`artifact ${a.id}`, e));
  (a.requires ?? []).forEach((r) => {
    if (!artifactIds.has(r)) err(`artifact ${a.id}: requires unknown artifact '${r}'`);
  });
}
for (const b of BLUEPRINTS) {
  (b.requires ?? []).forEach((r) => {
    if (!blueprintIds.has(r)) err(`blueprint ${b.id}: requires unknown blueprint '${r}'`);
  });
  if (b.effect.kind === 'startingGenerators' && !genIds.has(b.effect.generator)) {
    err(`blueprint ${b.id}: starts unknown generator '${b.effect.generator}'`);
  }
}
for (const a of ACHIEVEMENTS) checkCondition(`achievement ${a.id}`, a.condition);
for (const m of MILESTONES) checkCondition(`milestone ${m.id}`, m.condition);

// Fork sanity: every exclusiveGroup option shares the same forkLabel.
const groups = new Map<string, Set<string>>();
for (const u of UPGRADES) {
  if (!u.exclusiveGroup) continue;
  const set = groups.get(u.exclusiveGroup) ?? new Set();
  set.add(u.forkLabel ?? '(none)');
  groups.set(u.exclusiveGroup, set);
}
for (const [g, labels] of groups) {
  if (labels.size > 1) err(`fork group '${g}': inconsistent labels ${[...labels].join(' / ')}`);
}

console.log(
  `Content: ${GENERATORS.length} generators, ${UPGRADES.length} upgrades ` +
    `(${groups.size} forks), ${TALENTS.length} talents, ${ARTIFACTS.length} artifacts, ` +
    `${BLUEPRINTS.length} blueprints, ${ACHIEVEMENTS.length} achievements, ${MILESTONES.length} milestones.`,
);
void upgradeIds;
if (errors.length) {
  console.error(`\n❌ ${errors.length} integrity error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('✅ content integrity OK — all references resolve.');
