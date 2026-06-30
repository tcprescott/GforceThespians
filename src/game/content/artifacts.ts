import type { ArtifactDef } from '../types';

// ===========================================================================
// Artifacts — one-time, expensive, PERSISTENT Rider-Credit purchases. Each is a
// chunky permanent power that changes how every future run feels. Unlike
// talents, artifacts don't rank up — you either possess the legend or you don't.
// ===========================================================================

export const ARTIFACTS: ArtifactDef[] = [
  {
    id: 'a-the-first-box',
    name: 'The First Cardboard Box',
    description: 'The very box where it all began, bronzed. All production ×3, permanently.',
    cost: 5,
    effects: [{ kind: 'globalMult', factor: 3 }],
  },
  {
    id: 'a-perpetual-spotlight',
    name: 'The Perpetual Spotlight',
    description: 'A spotlight that never dims. Bravos ×5 and Dispatch ×10.',
    cost: 15,
    effects: [
      { kind: 'currencyMult', currency: 'bravos', factor: 5 },
      { kind: 'clickMult', factor: 10 },
    ],
    requires: ['a-the-first-box'],
  },
  {
    id: 'a-bottomless-bowl',
    name: 'The Bottomless Bowl',
    description: 'A Kibble bowl that refills from nothing. Kibble ×8 and all generator costs ×0.8.',
    cost: 30,
    effects: [
      { kind: 'currencyMult', currency: 'kibble', factor: 8 },
      { kind: 'costMult', target: 'all', factor: 0.8 },
    ],
    requires: ['a-the-first-box'],
  },
  {
    id: 'a-tuning-fork-of-the-spheres',
    name: 'Tuning Fork of the Spheres',
    description: 'Strike it and the cosmos resolves to a perfect chord. G-Force ×6, Tension ×6.',
    cost: 60,
    effects: [
      { kind: 'currencyMult', currency: 'gforce', factor: 6 },
      { kind: 'currencyMult', currency: 'tension', factor: 6 },
    ],
    requires: ['a-perpetual-spotlight'],
  },
  {
    id: 'a-pocket-moon',
    name: 'A Moon, Pocket-Sized',
    description: 'You kept one. Moonlight ×12 and all production ×2.',
    cost: 120,
    effects: [
      { kind: 'currencyMult', currency: 'moonlight', factor: 12 },
      { kind: 'globalMult', factor: 2 },
    ],
    requires: ['a-bottomless-bowl', 'a-tuning-fork-of-the-spheres'],
  },
  {
    id: 'a-the-ninth-life',
    name: 'The Ninth Life',
    description: 'The last life, saved for an encore. Rider Credits ×4 and offline efficiency ×3.',
    cost: 200,
    effects: [
      { kind: 'prestigeMult', factor: 4 },
      { kind: 'offlineMult', factor: 3 },
    ],
    requires: ['a-pocket-moon'],
  },
  {
    id: 'a-standing-ovation-eternal',
    name: 'The Eternal Standing Ovation',
    description: 'An audience that never stops, in every reality at once. ALL production ×10.',
    cost: 500,
    effects: [{ kind: 'globalMult', factor: 10 }],
    requires: ['a-the-ninth-life'],
  },

  // === EXPANSION artifacts ===============================================
  {
    id: 'a-rosin-of-the-gods',
    name: 'Rosin of the Gods',
    description: 'Rub it on anything and it performs. Zoomies ×8 and Dispatch ×20.',
    cost: 90,
    effects: [
      { kind: 'currencyMult', currency: 'zoomies', factor: 8 },
      { kind: 'clickMult', factor: 20 },
    ],
    requires: ['a-tuning-fork-of-the-spheres'],
  },
  {
    id: 'a-eternal-litterbox',
    name: 'The Eternal Litterbox',
    description: 'Self-cleaning across all of spacetime. Kibble ×15 and all costs ×0.7.',
    cost: 150,
    effects: [
      { kind: 'currencyMult', currency: 'kibble', factor: 15 },
      { kind: 'costMult', target: 'all', factor: 0.7 },
    ],
    requires: ['a-bottomless-bowl'],
  },
  {
    id: 'a-script-of-everything',
    name: 'The Script of Everything',
    description: 'Every line ever, perfectly delivered. ALL production ×6.',
    cost: 320,
    effects: [{ kind: 'globalMult', factor: 6 }],
    requires: ['a-pocket-moon'],
  },
  {
    id: 'a-the-encore-key',
    name: 'The Encore Key',
    description: 'Unlocks the door marked "again". Rider Credits ×8 and ALL production ×3.',
    cost: 800,
    effects: [
      { kind: 'prestigeMult', factor: 8 },
      { kind: 'globalMult', factor: 3 },
    ],
    requires: ['a-standing-ovation-eternal'],
  },
];

export const ARTIFACT_META: Record<string, ArtifactDef> = Object.fromEntries(
  ARTIFACTS.map((a) => [a.id, a]),
);
