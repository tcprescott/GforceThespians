import type { AutomationDef } from '../types';

// Automation features, each gated behind a blueprint. The store tracks which
// are unlocked (derived from owned blueprints) plus the player's toggles.
export const AUTOMATIONS: AutomationDef[] = [
  {
    id: 'auto-dispatch',
    name: 'Auto-Cue',
    description: 'Calls every cue for you, continuously. Pure idle convenience.',
    unlockedBy: 'blueprint',
  },
  {
    id: 'auto-buy',
    name: 'Auto-Buyers',
    description: 'Each generator can buy itself whenever you can afford it.',
    unlockedBy: 'blueprint',
  },
  {
    id: 'logic-gates',
    name: 'Logic Gates',
    description: 'Reserve thresholds: keep a % of a currency in the bank before auto-buying.',
    unlockedBy: 'blueprint',
  },
];

export const AUTOMATION_IDS = AUTOMATIONS.map((a) => a.id);

/** How many cues/second the Auto-Cue performs when enabled. */
export const AUTO_DISPATCH_PER_SECOND = 10;
/** Auto-buyers evaluate this many times per second (cheaper than every tick). */
export const AUTO_BUY_HZ = 2;
