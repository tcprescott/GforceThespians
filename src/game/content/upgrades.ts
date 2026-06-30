import type { UpgradeDef } from '../types';

// ===========================================================================
// Upgrades — the per-run decision layer.
//
// Three flavors keep each phase a series of choices rather than a checklist:
//   1. Straight multipliers — affordable, obvious, the bread and butter.
//   2. FORKS (exclusiveGroup) — pick exactly ONE per group, per run. Locks out
//      the siblings until the next Director's Cut. This is the build decision.
//   3. Tradeoffs — bundled upside + downside; powerful but not free.
//
// Because forks reset on prestige, every run you get to commit to a different
// directing style and feel it play out.
// ===========================================================================

export const UPGRADES: UpgradeDef[] = [
  // --- Phase 1 -------------------------------------------------------------
  {
    id: 'p1-up-reinforced-tape',
    name: 'Reinforced Tape',
    description: 'Cardboard Hills produce ×2. Structural integrity is overrated, but nice.',
    phase: 1,
    cost: { zoomies: 500 },
    effects: [{ kind: 'genMult', target: 'p1-cardboard-hill', factor: 2 }],
  },
  {
    id: 'p1-up-laser-pointer',
    name: 'Laser Pointer Discipline',
    description: 'Every Dispatch is ×3 as effective. The cats are extremely motivated.',
    phase: 1,
    cost: { zoomies: 1200 },
    effects: [{ kind: 'clickMult', factor: 3 }],
  },
  {
    id: 'p1-up-cushion-springs',
    name: 'Cushion Springs',
    description: 'Sofa Cushion Airtime ×3.',
    phase: 1,
    cost: { zoomies: 6000 },
    effects: [{ kind: 'genMult', target: 'p1-sofa-airtime', factor: 3 }],
  },
  {
    id: 'p1-up-ensemble',
    name: 'Ensemble Casting',
    description: 'Matinee Troupes ×3. Synergizes with an acclaim-heavy build.',
    phase: 1,
    cost: { bravos: 120 },
    effects: [{ kind: 'genMult', target: 'p1-matinee-troupe', factor: 3 }],
    requires: { kind: 'owned', generator: 'p1-matinee-troupe', amount: 5 },
  },
  // FORK: choose a directing style for this run.
  {
    id: 'p1-fork-spectacle',
    name: 'Style: Pure Spectacle',
    description: 'All generators ×1.8 — but the show is so loud that acclaim suffers (Bravos ×0.6).',
    phase: 1,
    cost: { bravos: 40 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 1.8 },
      { kind: 'currencyMult', currency: 'bravos', factor: 0.6 },
    ],
    exclusiveGroup: 'p1-style',
    forkLabel: 'Directing Style',
    tradeoff: true,
  },
  {
    id: 'p1-fork-prestige-theatre',
    name: 'Style: Prestige Theatre',
    description: 'Bravos ×2.6 — but the artsy restraint slows raw output (generators ×0.85).',
    phase: 1,
    cost: { bravos: 40 },
    effects: [
      { kind: 'currencyMult', currency: 'bravos', factor: 2.6 },
      { kind: 'genMult', target: 'all', factor: 0.85 },
    ],
    exclusiveGroup: 'p1-style',
    forkLabel: 'Directing Style',
    tradeoff: true,
  },
  {
    id: 'p1-fork-crowd-pleaser',
    name: 'Style: Crowd-Pleaser',
    description: 'A balanced hand: all generators ×1.25 and Dispatch ×4. No downside, no fireworks.',
    phase: 1,
    cost: { bravos: 40 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 1.25 },
      { kind: 'clickMult', factor: 4 },
    ],
    exclusiveGroup: 'p1-style',
    forkLabel: 'Directing Style',
  },

  // --- Phase 2 -------------------------------------------------------------
  {
    id: 'p2-up-bigger-hopper',
    name: 'Bigger Hopper',
    description: 'All Kibble production ×2. Fuel is freedom.',
    phase: 2,
    cost: { zoomies: 6e5 },
    effects: [{ kind: 'currencyMult', currency: 'kibble', factor: 2 }],
  },
  {
    id: 'p2-up-roomba-firmware',
    name: 'Roomba Firmware v2',
    description: 'Litterbox Roombas ×3. The patch notes are mostly hissing.',
    phase: 2,
    cost: { kibble: 2500 },
    effects: [{ kind: 'genMult', target: 'p2-litterbox-roomba', factor: 3 }],
  },
  {
    id: 'p2-up-timber-treatment',
    name: 'Pressure-Treated Timber',
    description: 'Backyard Timber Coasters ×3.',
    phase: 2,
    cost: { zoomies: 6e6 },
    effects: [{ kind: 'genMult', target: 'p2-timber-coaster', factor: 3 }],
  },
  {
    id: 'p2-up-press-tour',
    name: 'National Press Tour',
    description: 'Bravos ×2.2. Even the litterbox gets a profile in the Sunday paper.',
    phase: 2,
    cost: { bravos: 6000 },
    effects: [{ kind: 'currencyMult', currency: 'bravos', factor: 2.2 }],
  },
  // FORK: how do you run the automation?
  {
    id: 'p2-fork-lean',
    name: 'Doctrine: Lean & Mean',
    description: 'Everything ×2.2 — but you run the tanks low (Kibble production ×0.7). Risky.',
    phase: 2,
    cost: { kibble: 1500 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 2.2 },
      { kind: 'currencyMult', currency: 'kibble', factor: 0.7 },
    ],
    exclusiveGroup: 'p2-automation',
    forkLabel: 'Automation Doctrine',
    tradeoff: true,
  },
  {
    id: 'p2-fork-sustainable',
    name: 'Doctrine: Sustainable',
    description: 'Kibble ×2.6 and everything ×1.2. Fuel-rich, forgiving, dependable.',
    phase: 2,
    cost: { kibble: 1500 },
    effects: [
      { kind: 'currencyMult', currency: 'kibble', factor: 2.6 },
      { kind: 'genMult', target: 'all', factor: 1.2 },
    ],
    exclusiveGroup: 'p2-automation',
    forkLabel: 'Automation Doctrine',
  },
  {
    id: 'p2-fork-overclock',
    name: 'Doctrine: Overclock the Line',
    description: 'Conveyor Feeders ×6 and Roombas ×4 — but the strain dims everything else (global ×0.85).',
    phase: 2,
    cost: { kibble: 1500 },
    effects: [
      { kind: 'genMult', target: 'p2-conveyor-feeder', factor: 6 },
      { kind: 'genMult', target: 'p2-litterbox-roomba', factor: 4 },
      { kind: 'globalMult', factor: 0.85 },
    ],
    exclusiveGroup: 'p2-automation',
    forkLabel: 'Automation Doctrine',
    tradeoff: true,
  },

  // --- Phase 3 -------------------------------------------------------------
  {
    id: 'p3-up-g-suit',
    name: 'Tailored G-Suits',
    description: 'G-Force Pylons ×3.',
    phase: 3,
    cost: { gforce: 6000 },
    effects: [{ kind: 'genMult', target: 'p3-gforce-pylon', factor: 3 }],
  },
  {
    id: 'p3-up-dramaturgy',
    name: 'Dramaturgy Department',
    description: 'Tension Orchestras ×3.',
    phase: 3,
    cost: { tension: 6000 },
    effects: [{ kind: 'genMult', target: 'p3-tension-orchestra', factor: 3 }],
  },
  {
    id: 'p3-up-resonance',
    name: 'Structural Resonance',
    description: 'ALL passive production ×1.6. The whole house hums in a major key.',
    phase: 3,
    cost: { zoomies: 6e9 },
    effects: [{ kind: 'globalMult', factor: 1.6 }],
  },
  // FORK: which discipline do you master? (Plays directly off the harmony mechanic.)
  {
    id: 'p3-fork-force',
    name: 'Discipline: Brute Force',
    description: 'G-Force ×3.2 — but Tension lags behind (×0.8). Skews your harmony; mind the balance.',
    phase: 3,
    cost: { zoomies: 2e9 },
    effects: [
      { kind: 'currencyMult', currency: 'gforce', factor: 3.2 },
      { kind: 'currencyMult', currency: 'tension', factor: 0.8 },
    ],
    exclusiveGroup: 'p3-discipline',
    forkLabel: 'Absurd Discipline',
    tradeoff: true,
  },
  {
    id: 'p3-fork-feeling',
    name: 'Discipline: Pure Feeling',
    description: 'Tension ×3.2 — but G-Force lags (×0.8). The other skew. Choose your imbalance wisely.',
    phase: 3,
    cost: { zoomies: 2e9 },
    effects: [
      { kind: 'currencyMult', currency: 'tension', factor: 3.2 },
      { kind: 'currencyMult', currency: 'gforce', factor: 0.8 },
    ],
    exclusiveGroup: 'p3-discipline',
    forkLabel: 'Absurd Discipline',
    tradeoff: true,
  },
  {
    id: 'p3-fork-harmony',
    name: 'Discipline: Harmony',
    description: 'Strata-Coasters ×3 and Harmonic Loops ×3 — the balanced engines. Keeps you centered.',
    phase: 3,
    cost: { zoomies: 2e9 },
    effects: [
      { kind: 'genMult', target: 'p3-strata-coaster', factor: 3 },
      { kind: 'genMult', target: 'p3-harmonic-loop', factor: 3 },
    ],
    exclusiveGroup: 'p3-discipline',
    forkLabel: 'Absurd Discipline',
  },

  // --- Phase 4 -------------------------------------------------------------
  {
    id: 'p4-up-warp-rails',
    name: 'Warp Rails',
    description: 'Giga-Coasters ×3.',
    phase: 4,
    cost: { moonlight: 120 },
    effects: [{ kind: 'genMult', target: 'p4-giga-coaster', factor: 3 }],
  },
  {
    id: 'p4-up-choir',
    name: 'Nine Lives Choir',
    description: 'Black-Hole Arias ×3. Nine-part harmony, eight of them ghosts.',
    phase: 4,
    cost: { moonlight: 180 },
    effects: [{ kind: 'genMult', target: 'p4-black-hole-aria', factor: 3 }],
  },
  {
    id: 'p4-up-cosmic-radiation',
    name: 'Cosmic Background Bravado',
    description: 'ALL passive production ×2. The universe itself is now in the cast.',
    phase: 4,
    cost: { zoomies: 1e15 },
    effects: [{ kind: 'globalMult', factor: 2 }],
  },
  {
    id: 'p4-up-prestige-warmup',
    name: 'Encore Rehearsal',
    description: 'Rider Credits earned on your next Director’s Cut ×1.5.',
    phase: 4,
    cost: { moonlight: 600 },
    effects: [{ kind: 'prestigeMult', factor: 1.5 }],
  },
  // FORK: cosmic doctrine.
  {
    id: 'p4-fork-expansion',
    name: 'Doctrine: Endless Expansion',
    description: 'All generators ×2.6 — but cosmic real estate is pricey (all costs ×1.35).',
    phase: 4,
    cost: { moonlight: 90 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 2.6 },
      { kind: 'costMult', target: 'all', factor: 1.35 },
    ],
    exclusiveGroup: 'p4-doctrine',
    forkLabel: 'Cosmic Doctrine',
    tradeoff: true,
  },
  {
    id: 'p4-fork-resonance',
    name: 'Doctrine: Deep Resonance',
    description: 'Moonlight ×3.2 and global ×1.25. Lean into the resonance that ends reality.',
    phase: 4,
    cost: { moonlight: 90 },
    effects: [
      { kind: 'currencyMult', currency: 'moonlight', factor: 3.2 },
      { kind: 'globalMult', factor: 1.25 },
    ],
    exclusiveGroup: 'p4-doctrine',
    forkLabel: 'Cosmic Doctrine',
  },
  {
    id: 'p4-fork-singularity',
    name: 'Doctrine: Sing to the Singularity',
    description: 'Arias ×6 and Singing Comets ×4 — but the obsession dims zoomies (×0.8).',
    phase: 4,
    cost: { moonlight: 90 },
    effects: [
      { kind: 'genMult', target: 'p4-black-hole-aria', factor: 6 },
      { kind: 'genMult', target: 'p4-singing-comet', factor: 4 },
      { kind: 'currencyMult', currency: 'zoomies', factor: 0.8 },
    ],
    exclusiveGroup: 'p4-doctrine',
    forkLabel: 'Cosmic Doctrine',
    tradeoff: true,
  },

  // === Second forks — a second build decision per act ====================

  // Phase 1: Casting Call
  {
    id: 'p1-cast-soloist',
    name: 'Cast: The Soloist',
    description: 'Understudy Tabbies ×5. A star is born; the ensemble seethes.',
    phase: 1,
    cost: { zoomies: 3000 },
    effects: [{ kind: 'genMult', target: 'p1-understudy-tabby', factor: 5 }],
    exclusiveGroup: 'p1-cast',
    forkLabel: 'Casting Call',
  },
  {
    id: 'p1-cast-ensemble',
    name: 'Cast: True Ensemble',
    description: 'A balanced company — all generators ×1.35.',
    phase: 1,
    cost: { zoomies: 3000 },
    effects: [{ kind: 'genMult', target: 'all', factor: 1.35 }],
    exclusiveGroup: 'p1-cast',
    forkLabel: 'Casting Call',
  },
  {
    id: 'p1-cast-stunt',
    name: 'Cast: Stunt Cats',
    description: 'Yarn Catapults ×4 and Cardboard Loops ×4. Pure thrill, no restraint.',
    phase: 1,
    cost: { zoomies: 3000 },
    effects: [
      { kind: 'genMult', target: 'p1-yarn-catapult', factor: 4 },
      { kind: 'genMult', target: 'p1-cardboard-loop', factor: 4 },
    ],
    exclusiveGroup: 'p1-cast',
    forkLabel: 'Casting Call',
  },

  // Phase 2: Fuel Strategy
  {
    id: 'p2-fuel-premium',
    name: 'Fuel: Premium Blend',
    description: 'Kibble ×2.4. Run rich, run easy.',
    phase: 2,
    cost: { zoomies: 4e6 },
    effects: [{ kind: 'currencyMult', currency: 'kibble', factor: 2.4 }],
    exclusiveGroup: 'p2-fuel',
    forkLabel: 'Fuel Strategy',
  },
  {
    id: 'p2-fuel-recycle',
    name: 'Fuel: Closed Loop',
    description: 'Conveyor Feeders ×4. Squeeze every drop from what you burn.',
    phase: 2,
    cost: { zoomies: 4e6 },
    effects: [{ kind: 'genMult', target: 'p2-conveyor-feeder', factor: 4 }],
    exclusiveGroup: 'p2-fuel',
    forkLabel: 'Fuel Strategy',
  },
  {
    id: 'p2-fuel-diversify',
    name: 'Fuel: Diversified',
    description: 'All generators ×1.35. Spread the load across the whole yard.',
    phase: 2,
    cost: { zoomies: 4e6 },
    effects: [{ kind: 'genMult', target: 'all', factor: 1.35 }],
    exclusiveGroup: 'p2-fuel',
    forkLabel: 'Fuel Strategy',
  },

  // Phase 3: Showmanship
  {
    id: 'p3-show-grandeur',
    name: 'Show: Sheer Grandeur',
    description: 'ALL production ×1.5 — but the spectacle is costly (all costs ×1.2).',
    phase: 3,
    cost: { zoomies: 3e9 },
    effects: [
      { kind: 'globalMult', factor: 1.5 },
      { kind: 'costMult', target: 'all', factor: 1.2 },
    ],
    exclusiveGroup: 'p3-show',
    forkLabel: 'Showmanship',
    tradeoff: true,
  },
  {
    id: 'p3-show-precision',
    name: 'Show: Precision',
    description: 'Harmonic Loops ×4. Reward the balanced engine of the act.',
    phase: 3,
    cost: { zoomies: 3e9 },
    effects: [{ kind: 'genMult', target: 'p3-harmonic-loop', factor: 4 }],
    exclusiveGroup: 'p3-show',
    forkLabel: 'Showmanship',
  },
  {
    id: 'p3-show-boxoffice',
    name: 'Show: Box Office',
    description: 'Zoomies ×2.6. Convert every thrill straight into the takings.',
    phase: 3,
    cost: { zoomies: 3e9 },
    effects: [{ kind: 'currencyMult', currency: 'zoomies', factor: 2.6 }],
    exclusiveGroup: 'p3-show',
    forkLabel: 'Showmanship',
  },

  // Phase 4: Cosmic Ambition
  {
    id: 'p4-amb-conquer',
    name: 'Ambition: Conquer',
    description: 'All generators ×2.2 — but spread thin, Moonlight ×0.8.',
    phase: 4,
    cost: { moonlight: 80 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 2.2 },
      { kind: 'currencyMult', currency: 'moonlight', factor: 0.8 },
    ],
    exclusiveGroup: 'p4-ambition',
    forkLabel: 'Cosmic Ambition',
    tradeoff: true,
  },
  {
    id: 'p4-amb-harmonize',
    name: 'Ambition: Harmonize the Spheres',
    description: 'G-Force ×2.2 and Tension ×2.2. Carry Act Three’s balance to the stars.',
    phase: 4,
    cost: { moonlight: 80 },
    effects: [
      { kind: 'currencyMult', currency: 'gforce', factor: 2.2 },
      { kind: 'currencyMult', currency: 'tension', factor: 2.2 },
    ],
    exclusiveGroup: 'p4-ambition',
    forkLabel: 'Cosmic Ambition',
  },
  {
    id: 'p4-amb-transcend',
    name: 'Ambition: Transcend',
    description: 'ALL production ×1.6. Simply become more.',
    phase: 4,
    cost: { moonlight: 80 },
    effects: [{ kind: 'globalMult', factor: 1.6 }],
    exclusiveGroup: 'p4-ambition',
    forkLabel: 'Cosmic Ambition',
  },

  // =========================================================================
  // EXPANSION — a third fork per act + synergy upgrades for the new props.
  // =========================================================================

  // Phase 1 plain
  {
    id: 'p1-up-fog-machine',
    name: 'Fog Machine',
    description: 'Velvet Curtain Rigs ×3. Eighty percent atmosphere, twenty percent hazard.',
    phase: 1,
    cost: { zoomies: 60000 },
    effects: [{ kind: 'genMult', target: 'p1-curtain-rig', factor: 3 }],
  },
  {
    id: 'p1-up-diva-rider',
    name: 'Diva Rider',
    description: 'Prima Donna Persians ×3. The contract is mostly demands.',
    phase: 1,
    cost: { bravos: 220 },
    effects: [{ kind: 'genMult', target: 'p1-prima-donna', factor: 3 }],
  },
  // Phase 1: Opening Number (fork)
  {
    id: 'p1-open-bombast',
    name: 'Opening: Sheer Bombast',
    description: 'All generators ×1.6 — but the pyrotechnics aren’t cheap (all costs ×1.18).',
    phase: 1,
    cost: { bravos: 60 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 1.6 },
      { kind: 'costMult', target: 'all', factor: 1.18 },
    ],
    exclusiveGroup: 'p1-opening',
    forkLabel: 'Opening Number',
    tradeoff: true,
  },
  {
    id: 'p1-open-charm',
    name: 'Opening: Pure Charm',
    description: 'Zoomies ×1.9. Win the room with sheer kinetic delight.',
    phase: 1,
    cost: { bravos: 60 },
    effects: [{ kind: 'currencyMult', currency: 'zoomies', factor: 1.9 }],
    exclusiveGroup: 'p1-opening',
    forkLabel: 'Opening Number',
  },
  {
    id: 'p1-open-prestige',
    name: 'Opening: Art-House',
    description: 'Bravos ×2.3 and Dispatch ×2. Slow, deliberate, devastating.',
    phase: 1,
    cost: { bravos: 60 },
    effects: [
      { kind: 'currencyMult', currency: 'bravos', factor: 2.3 },
      { kind: 'clickMult', factor: 2 },
    ],
    exclusiveGroup: 'p1-opening',
    forkLabel: 'Opening Number',
  },

  // Phase 2 plain
  {
    id: 'p2-up-pellet-science',
    name: 'Pellet Science Division',
    description: 'Industrial Treat Printers ×3. Peer-reviewed deliciousness.',
    phase: 2,
    cost: { zoomies: 1.5e7 },
    effects: [{ kind: 'genMult', target: 'p2-treat-printer', factor: 3 }],
  },
  {
    id: 'p2-up-express-elevators',
    name: 'Express Elevators',
    description: 'Scratching-Post Skyscrapers ×3. Floor forty in four terrifying seconds.',
    phase: 2,
    cost: { kibble: 9000 },
    effects: [{ kind: 'genMult', target: 'p2-scratch-skyscraper', factor: 3 }],
  },
  // Phase 2: Logistics (fork)
  {
    id: 'p2-log-justintime',
    name: 'Logistics: Just-In-Time',
    description: 'Everything ×1.6 — but you carry no slack (Kibble ×0.75). Live dangerously.',
    phase: 2,
    cost: { kibble: 2000 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 1.6 },
      { kind: 'currencyMult', currency: 'kibble', factor: 0.75 },
    ],
    exclusiveGroup: 'p2-logistics',
    forkLabel: 'Logistics',
    tradeoff: true,
  },
  {
    id: 'p2-log-stockpile',
    name: 'Logistics: Deep Stockpile',
    description: 'Kibble ×2.2 and Treat Printers ×3. Reserves for days.',
    phase: 2,
    cost: { kibble: 2000 },
    effects: [
      { kind: 'currencyMult', currency: 'kibble', factor: 2.2 },
      { kind: 'genMult', target: 'p2-treat-printer', factor: 3 },
    ],
    exclusiveGroup: 'p2-logistics',
    forkLabel: 'Logistics',
  },
  {
    id: 'p2-log-flagship',
    name: 'Logistics: Flagship Show',
    description: 'Robo-Ringmasters ×5 and Skyscrapers ×5. Go big or go to the litterbox.',
    phase: 2,
    cost: { kibble: 2000 },
    effects: [
      { kind: 'genMult', target: 'p2-robo-ringmaster', factor: 5 },
      { kind: 'genMult', target: 'p2-scratch-skyscraper', factor: 5 },
    ],
    exclusiveGroup: 'p2-logistics',
    forkLabel: 'Logistics',
  },

  // Phase 3 plain
  {
    id: 'p3-up-altimeter',
    name: 'Precision Altimeter',
    description: 'Vertigo Towers ×3. Now you know exactly how doomed you are.',
    phase: 3,
    cost: { zoomies: 5e10 },
    effects: [{ kind: 'genMult', target: 'p3-vertigo-tower', factor: 3 }],
  },
  {
    id: 'p3-up-leverage',
    name: 'Dramatic Leverage',
    description: 'Cliffhanger Rigs ×3 and Soliloquy Engines ×3 — sharpen both balance levers.',
    phase: 3,
    cost: { zoomies: 5e10 },
    effects: [
      { kind: 'genMult', target: 'p3-cliffhanger-rig', factor: 3 },
      { kind: 'genMult', target: 'p3-soliloquy-engine', factor: 3 },
    ],
  },
  // Phase 3: Physics (fork)
  {
    id: 'p3-phys-relativity',
    name: 'Physics: General Relativity',
    description: 'ALL production ×1.6 — but bending spacetime is expensive (all costs ×1.2).',
    phase: 3,
    cost: { zoomies: 4e9 },
    effects: [
      { kind: 'globalMult', factor: 1.6 },
      { kind: 'costMult', target: 'all', factor: 1.2 },
    ],
    exclusiveGroup: 'p3-physics',
    forkLabel: 'Physics',
    tradeoff: true,
  },
  {
    id: 'p3-phys-equilibrium',
    name: 'Physics: Equilibrium',
    description: 'Vertigo Towers ×4 and both balance levers ×3. Master the centre.',
    phase: 3,
    cost: { zoomies: 4e9 },
    effects: [
      { kind: 'genMult', target: 'p3-vertigo-tower', factor: 4 },
      { kind: 'genMult', target: 'p3-cliffhanger-rig', factor: 3 },
      { kind: 'genMult', target: 'p3-soliloquy-engine', factor: 3 },
    ],
    exclusiveGroup: 'p3-physics',
    forkLabel: 'Physics',
  },
  {
    id: 'p3-phys-spectacle',
    name: 'Physics: Spectacle Over Sense',
    description: 'Zoomies ×2.8. Who needs balance when you have box office?',
    phase: 3,
    cost: { zoomies: 4e9 },
    effects: [{ kind: 'currencyMult', currency: 'zoomies', factor: 2.8 }],
    exclusiveGroup: 'p3-physics',
    forkLabel: 'Physics',
  },

  // Phase 4 plain
  {
    id: 'p4-up-paradox-insurance',
    name: 'Paradox Insurance',
    description: 'Wormhole Junctions ×3. Covers grandfather paradoxes, excludes acts of cat.',
    phase: 4,
    cost: { moonlight: 400 },
    effects: [{ kind: 'genMult', target: 'p4-wormhole-junction', factor: 3 }],
  },
  {
    id: 'p4-up-encore-fuel',
    name: 'Stellar Encore Fuel',
    description: 'Supernova Encores ×3. Each curtain call a little brighter than the last.',
    phase: 4,
    cost: { moonlight: 400 },
    effects: [{ kind: 'genMult', target: 'p4-supernova-encore', factor: 3 }],
  },
  // Phase 4: Destiny (fork)
  {
    id: 'p4-dest-expansionism',
    name: 'Destiny: Expansionism',
    description: 'All generators ×2.4 — but spread across the void, Moonlight ×0.85.',
    phase: 4,
    cost: { moonlight: 120 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 2.4 },
      { kind: 'currencyMult', currency: 'moonlight', factor: 0.85 },
    ],
    exclusiveGroup: 'p4-destiny',
    forkLabel: 'Final Destiny',
    tradeoff: true,
  },
  {
    id: 'p4-dest-resonant',
    name: 'Destiny: Resonant Path',
    description: 'Moonlight ×3 and global ×1.2. Tune yourself to the end of the show.',
    phase: 4,
    cost: { moonlight: 120 },
    effects: [
      { kind: 'currencyMult', currency: 'moonlight', factor: 3 },
      { kind: 'globalMult', factor: 1.2 },
    ],
    exclusiveGroup: 'p4-destiny',
    forkLabel: 'Final Destiny',
  },
  {
    id: 'p4-dest-paradox',
    name: 'Destiny: Embrace the Paradox',
    description: 'Wormhole Junctions ×6 and Supernova Encores ×4. Become a closed timelike curtain call.',
    phase: 4,
    cost: { moonlight: 120 },
    effects: [
      { kind: 'genMult', target: 'p4-wormhole-junction', factor: 6 },
      { kind: 'genMult', target: 'p4-supernova-encore', factor: 4 },
    ],
    exclusiveGroup: 'p4-destiny',
    forkLabel: 'Final Destiny',
  },

  // === Phase 5: The Ouroboros ============================================
  {
    id: 'p5-up-silvering',
    name: 'Fresh Silvering',
    description: 'Halls of Mirrors ×3. The reflections go deeper, and deeper, and—',
    phase: 5,
    cost: { echoes: 5000 },
    effects: [{ kind: 'genMult', target: 'p5-hall-of-mirrors', factor: 3 }],
  },
  {
    id: 'p5-up-recursion-depth',
    name: 'Stack Depth Unlimited',
    description: 'Infinite Encores ×4. The base case was a lie.',
    phase: 5,
    cost: { echoes: 12000 },
    effects: [{ kind: 'genMult', target: 'p5-infinite-encore', factor: 4 }],
  },
  {
    id: 'p5-up-echo-amp',
    name: 'Echo Amplifier',
    description: 'Echoes ×2.5. Say it once; hear it forever.',
    phase: 5,
    cost: { echoes: 4000 },
    effects: [{ kind: 'currencyMult', currency: 'echoes', factor: 2.5 }],
  },
  {
    id: 'p5-up-meta-budget',
    name: 'Unlimited Production Budget',
    description: 'ALL production ×2. The show about the show has an excellent producer (you).',
    phase: 5,
    cost: { zoomies: 1e20 },
    effects: [{ kind: 'globalMult', factor: 2 }],
  },
  // Phase 5: The Meta-Question (fork)
  {
    id: 'p5-meta-loop',
    name: 'Meta: Embrace the Loop',
    description: 'Echoes ×3 — but recursion is expensive (all costs ×1.2). Lean all the way in.',
    phase: 5,
    cost: { echoes: 3000 },
    effects: [
      { kind: 'currencyMult', currency: 'echoes', factor: 3 },
      { kind: 'costMult', target: 'all', factor: 1.2 },
    ],
    exclusiveGroup: 'p5-meta',
    forkLabel: 'The Meta-Question',
    tradeoff: true,
  },
  {
    id: 'p5-meta-break',
    name: 'Meta: Break the Cycle',
    description: 'All generators ×2.2 — but you stop reflecting (Echoes ×0.85). Forward, not inward.',
    phase: 5,
    cost: { echoes: 3000 },
    effects: [
      { kind: 'genMult', target: 'all', factor: 2.2 },
      { kind: 'currencyMult', currency: 'echoes', factor: 0.85 },
    ],
    exclusiveGroup: 'p5-meta',
    forkLabel: 'The Meta-Question',
    tradeoff: true,
  },
  {
    id: 'p5-meta-balance',
    name: 'Meta: Hold the Mirror Steady',
    description: 'ALL production ×1.6. Neither in nor out — simply more.',
    phase: 5,
    cost: { echoes: 3000 },
    effects: [{ kind: 'globalMult', factor: 1.6 }],
    exclusiveGroup: 'p5-meta',
    forkLabel: 'The Meta-Question',
  },
];

export const UPGRADE_META: Record<string, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
);
