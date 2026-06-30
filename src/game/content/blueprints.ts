import type { BlueprintDef } from '../types';

// ===========================================================================
// Blueprints — permanent STRUCTURAL unlocks bought once with Rider Credits.
// They don't multiply numbers; they change how a run is shaped: head-starts,
// automation, and skipping the slow opening of later acts.
// ===========================================================================

export const BLUEPRINTS: BlueprintDef[] = [
  {
    id: 'bp-auto-dispatch',
    name: 'Automated Dispatch Lever',
    description: 'Unlocks the Auto-Dispatcher: the coasters launch themselves, hands-free.',
    cost: 6,
    effect: { kind: 'unlockAutomation', automation: 'auto-dispatch' },
  },
  {
    id: 'bp-head-start',
    name: 'Opening-Night Head Start',
    description: 'Begin every run with 25 Cardboard Hills already built. Skip the cold open.',
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
    name: 'Pre-Approved Backyard Permit',
    description: 'Act Two is unlocked from the very start of every run. The contractors are on retainer.',
    cost: 150,
    effect: { kind: 'autoUnlockPhase', phase: 2 },
    requires: ['bp-head-start'],
  },
  {
    id: 'bp-fuel-reserves',
    name: 'Strategic Kibble Reserve',
    description: 'Begin every run with 15 Kibble Dispensers humming. No more cold-starting the fuel economy.',
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
    name: 'Stratosphere Clearance',
    description: 'Act Three is unlocked from the start of every run. The FAA gave up.',
    cost: 1200,
    effect: { kind: 'autoUnlockPhase', phase: 3 },
    requires: ['bp-backyard-permit'],
  },
  {
    id: 'bp-launch-window',
    name: 'Permanent Launch Window',
    description: 'Act Four is unlocked from the start of every run. The moon has a standing reservation.',
    cost: 6000,
    effect: { kind: 'autoUnlockPhase', phase: 4 },
    requires: ['bp-stratosphere-clearance'],
  },
];

export const BLUEPRINT_META: Record<string, BlueprintDef> = Object.fromEntries(
  BLUEPRINTS.map((b) => [b.id, b]),
);
