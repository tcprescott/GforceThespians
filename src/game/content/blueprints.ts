import type { BlueprintDef } from '../types';

// ===========================================================================
// Blueprints — permanent STRUCTURAL unlocks bought once with Legacy.
// They don't multiply numbers; they change how a run is shaped: head-starts,
// automation, and skipping the slow opening of later acts.
// ===========================================================================

export const BLUEPRINTS: BlueprintDef[] = [
  {
    id: 'bp-auto-dispatch',
    name: 'The Prompter’s Box',
    description: 'Unlocks the Auto-Cue: the scenes call themselves, hands-free.',
    cost: 6,
    effect: { kind: 'unlockAutomation', automation: 'auto-dispatch' },
  },
  {
    id: 'bp-head-start',
    name: 'Opening-Night Head Start',
    description: 'Begin every run with 25 Cardboard Flats already built. Skip the cold open.',
    cost: 12,
    effect: { kind: 'startingGenerators', generator: 'p1-cardboard-hill', amount: 25 },
  },
  {
    id: 'bp-auto-buy',
    name: 'Stage-Manager Clipboard',
    description: 'Unlocks Auto-Buyers — toggle any generator to purchase itself whenever affordable.',
    cost: 28,
    effect: { kind: 'unlockAutomation', automation: 'auto-buy' },
    requires: ['bp-auto-dispatch'],
  },
  {
    id: 'bp-backyard-permit',
    name: 'Pre-Approved Playhouse Lease',
    description: 'Act Two is unlocked from the very start of every run. The playhouse is on retainer.',
    cost: 150,
    effect: { kind: 'autoUnlockPhase', phase: 2 },
    requires: ['bp-head-start'],
  },
  {
    id: 'bp-fuel-reserves',
    name: 'Strategic Coffee Reserve',
    description: 'Begin every run with 15 Coffee Urns humming. No more cold-starting the fuel economy.',
    cost: 500,
    effect: { kind: 'startingGenerators', generator: 'p2-kibble-dispenser', amount: 15 },
    requires: ['bp-backyard-permit', 'bp-auto-buy'],
  },
  {
    id: 'bp-logic-gates',
    name: 'Automation Logic Gates',
    description: 'Unlocks reserve thresholds on Auto-Buyers — hold back a % of each currency so you never bankrupt a fork.',
    cost: 120,
    effect: { kind: 'unlockAutomation', automation: 'logic-gates' },
    requires: ['bp-auto-buy'],
  },
  {
    id: 'bp-stratosphere-clearance',
    name: 'Permanent Main-Stage Lease',
    description: 'Act Three is unlocked from the start of every run. The grand stage is booked in perpetuity.',
    cost: 1200,
    effect: { kind: 'autoUnlockPhase', phase: 3 },
    requires: ['bp-backyard-permit'],
  },
  {
    id: 'bp-launch-window',
    name: 'Permanent Cosmic Residency',
    description: 'Act Four is unlocked from the start of every run. The cosmos keeps a seat warm.',
    cost: 6000,
    effect: { kind: 'autoUnlockPhase', phase: 4 },
    requires: ['bp-stratosphere-clearance'],
  },

  // === EXPANSION blueprints ==============================================
  {
    id: 'bp-season-pass',
    name: 'Lifetime Season Subscription',
    description: 'Begin every run with 15 Painted Backdrops already hung. The regulars never left.',
    cost: 80,
    effect: { kind: 'startingGenerators', generator: 'p1-cardboard-loop', amount: 15 },
    requires: ['bp-head-start'],
  },
  {
    id: 'bp-orchestra-pit',
    name: 'Standing Orchestra Pit',
    description: 'Begin every run with 10 Main Stages already piercing the sky.',
    cost: 250,
    effect: { kind: 'startingGenerators', generator: 'p3-strata-coaster', amount: 10 },
    requires: ['bp-stratosphere-clearance'],
  },
  {
    id: 'bp-moon-base',
    name: 'Permanent Lunar Residency',
    description: 'Begin every run with 8 Command Performances already in orbit. The moon kept the lights on.',
    cost: 1800,
    effect: { kind: 'startingGenerators', generator: 'p4-giga-coaster', amount: 8 },
    requires: ['bp-launch-window'],
  },
];

export const BLUEPRINT_META: Record<string, BlueprintDef> = Object.fromEntries(
  BLUEPRINTS.map((b) => [b.id, b]),
);
