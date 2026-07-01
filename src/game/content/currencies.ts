import type { CurrencyDef, CurrencyId } from '../types';

// Display metadata for every currency. Order here is reveal/display order.
export const CURRENCIES: CurrencyDef[] = [
  {
    id: 'zoomies',
    name: 'Buzz',
    symbol: '✨',
    color: 'text-amber-200',
    blurb: 'Raw audience electricity — the word-of-mouth pulse of a show that’s landing.',
    phase: 1,
  },
  {
    id: 'bravos',
    name: 'Bravos',
    symbol: '🎭',
    color: 'text-fuchsia-200',
    blurb: 'Theatrical acclaim, earned from your props and the morale of the cast.',
    phase: 1,
  },
  {
    id: 'kibble',
    name: 'Coffee',
    symbol: '☕',
    color: 'text-orange-200',
    blurb: 'Craft-services fuel. Automation runs on it; let it run dry and the crew sputters.',
    phase: 2,
  },
  {
    id: 'gforce',
    name: 'Comedy',
    symbol: '😄',
    color: 'text-cyan-200',
    blurb: 'Uproarious laughter. Half of the Absurd act’s delicate balance.',
    phase: 3,
  },
  {
    id: 'tension',
    name: 'Tragedy',
    symbol: '😢',
    color: 'text-rose-200',
    blurb: 'The held breath before the tears. Harmonize it with Comedy for glory.',
    phase: 3,
  },
  {
    id: 'moonlight',
    name: 'Limelight',
    symbol: '🌟',
    color: 'text-indigo-200',
    blurb: 'Incandescent stage glow, sung from the greatest stages in the cosmos.',
    phase: 4,
  },
  {
    id: 'echoes',
    name: 'Echoes',
    symbol: '🔁',
    color: 'text-violet-200',
    blurb: 'The show performing for itself, forever. Recursion made currency.',
    phase: 5,
  },
  {
    id: 'riderCredits',
    name: 'Legacy',
    symbol: '⭐',
    color: 'text-emerald-200',
    blurb: 'The currency of legend. Spent in The Revival; survives every reset.',
    phase: 6,
    persistent: true,
  },
];

export const CURRENCY_META: Record<CurrencyId, CurrencyDef> = Object.fromEntries(
  CURRENCIES.map((c) => [c.id, c]),
) as Record<CurrencyId, CurrencyDef>;

export const CURRENCY_IDS: CurrencyId[] = CURRENCIES.map((c) => c.id);
