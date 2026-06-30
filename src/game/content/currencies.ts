import type { CurrencyDef, CurrencyId } from '../types';

// Display metadata for every currency. Order here is reveal/display order.
export const CURRENCIES: CurrencyDef[] = [
  {
    id: 'zoomies',
    name: 'Zoomies',
    symbol: '⚡',
    color: 'text-amber-200',
    blurb: 'Raw kinetic chaos. The universal pulse of every coaster dispatch.',
    phase: 1,
  },
  {
    id: 'bravos',
    name: 'Bravos',
    symbol: '🎭',
    color: 'text-fuchsia-200',
    blurb: 'Theatrical acclaim, earned from props and the morale of your feline cast.',
    phase: 1,
  },
  {
    id: 'kibble',
    name: 'Kibble',
    symbol: '🍖',
    color: 'text-orange-200',
    blurb: 'Fuel. Automation runs on it; let it run dry and the machines sputter.',
    phase: 2,
  },
  {
    id: 'gforce',
    name: 'G-Force',
    symbol: '🌀',
    color: 'text-cyan-200',
    blurb: 'Crushing acceleration. Half of the Absurd act’s delicate balance.',
    phase: 3,
  },
  {
    id: 'tension',
    name: 'Dramatic Tension',
    symbol: '🎻',
    color: 'text-rose-200',
    blurb: 'The held breath before the drop. Harmonize it with G-Force for glory.',
    phase: 3,
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    symbol: '🌙',
    color: 'text-indigo-200',
    blurb: 'Interstellar resonance, sung from giga-coasters into the dark.',
    phase: 4,
  },
  {
    id: 'riderCredits',
    name: 'Rider Credits',
    symbol: '🎟️',
    color: 'text-emerald-200',
    blurb: 'The currency of legend. Spent in the Director’s Cut; survives every reset.',
    phase: 5,
    persistent: true,
  },
];

export const CURRENCY_META: Record<CurrencyId, CurrencyDef> = Object.fromEntries(
  CURRENCIES.map((c) => [c.id, c]),
) as Record<CurrencyId, CurrencyDef>;

export const CURRENCY_IDS: CurrencyId[] = CURRENCIES.map((c) => c.id);
