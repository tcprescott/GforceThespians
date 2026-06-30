import type { TalentDef } from '../types';

// ===========================================================================
// The Talent Tree — spent in the Director's Cut with Rider Credits. Talents are
// PERSISTENT: they survive every reset and compound across runs. Ranked, with a
// few prerequisite chains so there's a tree to climb. Effects scale with rank:
//   • multiplicative effects (genMult/currencyMult/globalMult/clickMult/...) use
//     factor^rank
//   • flat effects (clickFlat) use amount*rank
// (see engine.ts: aggregateEffects)
// ===========================================================================

export const TALENTS: TalentDef[] = [
  // Tier 0 — roots
  {
    id: 't-kinetic-soul',
    name: 'Kinetic Soul',
    description: 'Every rank: all passive production ×1.25. The foundation of every legend.',
    tier: 0,
    maxRank: 10,
    baseCost: 1,
    costGrowth: 1.6,
    effects: [{ kind: 'globalMult', factor: 1.25 }],
  },
  {
    id: 't-standing-ovation',
    name: 'Standing Ovation',
    description: 'Every rank: Bravos ×1.3. Acclaim remembers you between lives.',
    tier: 0,
    maxRank: 8,
    baseCost: 1,
    costGrowth: 1.7,
    effects: [{ kind: 'currencyMult', currency: 'bravos', factor: 1.3 }],
  },
  {
    id: 't-muscle-memory',
    name: 'Muscle Memory',
    description: 'Every rank: Dispatch power ×2 and +5 flat. For when you feel like clicking.',
    tier: 0,
    maxRank: 6,
    baseCost: 1,
    costGrowth: 1.8,
    effects: [
      { kind: 'clickMult', factor: 2 },
      { kind: 'clickFlat', amount: 5 },
    ],
  },

  // Tier 1
  {
    id: 't-full-tanks',
    name: 'Full Tanks',
    description: 'Every rank: Kibble production ×1.4. Never starve your machines again.',
    tier: 1,
    maxRank: 8,
    baseCost: 3,
    costGrowth: 1.6,
    effects: [{ kind: 'currencyMult', currency: 'kibble', factor: 1.4 }],
    requires: ['t-kinetic-soul'],
  },
  {
    id: 't-method-school',
    name: 'The Method School',
    description: 'Every rank: G-Force ×1.35 and Tension ×1.35. Feeling and force, in lockstep.',
    tier: 1,
    maxRank: 8,
    baseCost: 4,
    costGrowth: 1.65,
    effects: [
      { kind: 'currencyMult', currency: 'gforce', factor: 1.35 },
      { kind: 'currencyMult', currency: 'tension', factor: 1.35 },
    ],
    requires: ['t-standing-ovation'],
  },
  {
    id: 't-early-call',
    name: 'Early Call Time',
    description: 'Every rank: all generator costs ×0.92. Start each run a little richer.',
    tier: 1,
    maxRank: 6,
    baseCost: 5,
    costGrowth: 1.9,
    effects: [{ kind: 'costMult', target: 'all', factor: 0.92 }],
    requires: ['t-kinetic-soul'],
  },

  // Tier 2
  {
    id: 't-lunar-resonance',
    name: 'Lunar Resonance',
    description: 'Every rank: Moonlight ×1.5. The dark hums your name.',
    tier: 2,
    maxRank: 8,
    baseCost: 12,
    costGrowth: 1.7,
    effects: [{ kind: 'currencyMult', currency: 'moonlight', factor: 1.5 }],
    requires: ['t-method-school'],
  },
  {
    id: 't-night-shift',
    name: 'Night Shift',
    description: 'Every rank: offline progress efficiency ×1.3. The show runs while you sleep.',
    tier: 2,
    maxRank: 5,
    baseCost: 10,
    costGrowth: 1.8,
    effects: [{ kind: 'offlineMult', factor: 1.3 }],
    requires: ['t-full-tanks'],
  },
  {
    id: 't-compound-interest',
    name: 'Compound Acclaim',
    description: 'Every rank: ALL production ×1.4. Pricey. Worth it.',
    tier: 2,
    maxRank: 10,
    baseCost: 20,
    costGrowth: 1.85,
    effects: [{ kind: 'globalMult', factor: 1.4 }],
    requires: ['t-early-call', 't-method-school'],
  },

  // Tier 3 — the crown
  {
    id: 't-rider-royalties',
    name: 'Rider Royalties',
    description: 'Every rank: Rider Credits earned on prestige ×1.5. Get paid to end the world.',
    tier: 3,
    maxRank: 8,
    baseCost: 40,
    costGrowth: 2.0,
    effects: [{ kind: 'prestigeMult', factor: 1.5 }],
    requires: ['t-lunar-resonance', 't-compound-interest'],
  },
  {
    id: 't-the-show-goes-on',
    name: 'The Show Must Go On',
    description: 'Every rank: ALL production ×1.8. The final, glorious snowball.',
    tier: 3,
    maxRank: 12,
    baseCost: 75,
    costGrowth: 1.9,
    effects: [{ kind: 'globalMult', factor: 1.8 }],
    requires: ['t-compound-interest'],
  },

  // Tier 4 — the endless encore. No practical ceiling: this is where the
  // snowball lives forever, absorbing every Rider Credit you'll ever earn and
  // keeping the marathon a marathon. Because the Rising Wall tracks your power,
  // ranking this up raises the bar in lockstep — you grow, the show grows.
  {
    id: 't-eternal-encore',
    name: 'Eternal Encore',
    description:
      'Every rank: ALL production ×1.1. There is no maximum. There is only the next encore, forever.',
    tier: 4,
    maxRank: 100000,
    baseCost: 200,
    costGrowth: 1.45,
    effects: [{ kind: 'globalMult', factor: 1.1 }],
    requires: ['t-the-show-goes-on', 't-rider-royalties'],
  },
];

export const TALENT_META: Record<string, TalentDef> = Object.fromEntries(
  TALENTS.map((t) => [t.id, t]),
);
