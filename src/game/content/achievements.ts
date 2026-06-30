import type { AchievementDef } from '../types';

// ===========================================================================
// Achievements — each earned one grants a small, permanent, STACKING global
// production multiplier (its `bonus`). Exploration quietly compounds. They
// survive prestige (they're a measure of you, not the run).
// ===========================================================================

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'ach-curtain-up',
    name: 'Curtain Up',
    description: 'Dispatch your very first coaster.',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1 },
    bonus: 1.02,
  },
  {
    id: 'ach-bravo',
    name: 'Bravo!',
    description: 'Earn your first Bravo.',
    condition: { kind: 'lifetime', currency: 'bravos', amount: 1 },
    bonus: 1.02,
  },
  {
    id: 'ach-full-house',
    name: 'Full House',
    description: 'Own 50 generators at once.',
    condition: { kind: 'totalGenerators', amount: 50 },
    bonus: 1.03,
  },
  {
    id: 'ach-sold-out',
    name: 'Sold Out',
    description: 'Own 200 generators at once.',
    condition: { kind: 'totalGenerators', amount: 200 },
    bonus: 1.05,
  },
  {
    id: 'ach-standing-room',
    name: 'Standing Room Only',
    description: 'Own 500 generators at once.',
    condition: { kind: 'totalGenerators', amount: 500 },
    bonus: 1.08,
  },
  {
    id: 'ach-six-figures',
    name: 'Six-Figure Zoomies',
    description: 'Reach 100,000 lifetime zoomies.',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1e5 },
    bonus: 1.03,
  },
  {
    id: 'ach-millionaire',
    name: 'Zoomie Millionaire',
    description: 'Reach 1,000,000 lifetime zoomies.',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1e6 },
    bonus: 1.04,
  },
  {
    id: 'ach-billionaire',
    name: 'Zoomie Billionaire',
    description: 'Reach 1,000,000,000 lifetime zoomies.',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1e9 },
    bonus: 1.05,
  },
  {
    id: 'ach-trillionaire',
    name: 'Cosmic Bookkeeping',
    description: 'Reach 1,000,000,000,000 lifetime zoomies.',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1e12 },
    bonus: 1.07,
  },
  {
    id: 'ach-fueled',
    name: 'Fully Fueled',
    description: 'Reach Act Two and produce Kibble.',
    condition: { kind: 'lifetime', currency: 'kibble', amount: 1000 },
    bonus: 1.03,
  },
  {
    id: 'ach-greenhouse',
    name: 'Industrial Morale',
    description: 'Own 25 Catnip Greenhouses.',
    condition: { kind: 'owned', generator: 'p2-catnip-greenhouse', amount: 25 },
    bonus: 1.04,
  },
  {
    id: 'ach-harmony',
    name: 'In Perfect Harmony',
    description: 'Produce 10,000 lifetime G-Force.',
    condition: { kind: 'lifetime', currency: 'gforce', amount: 1e4 },
    bonus: 1.05,
  },
  {
    id: 'ach-tension',
    name: 'The Held Breath',
    description: 'Produce 10,000 lifetime Dramatic Tension.',
    condition: { kind: 'lifetime', currency: 'tension', amount: 1e4 },
    bonus: 1.05,
  },
  {
    id: 'ach-strata',
    name: 'Touching the Sky',
    description: 'Own 50 Strata-Coasters.',
    condition: { kind: 'owned', generator: 'p3-strata-coaster', amount: 50 },
    bonus: 1.06,
  },
  {
    id: 'ach-moonshot',
    name: 'Moonshot',
    description: 'Earn your first Moonlight.',
    condition: { kind: 'lifetime', currency: 'moonlight', amount: 1 },
    bonus: 1.05,
  },
  {
    id: 'ach-to-the-moon',
    name: 'To The Moon, Literally',
    description: 'Reach 100,000 lifetime Moonlight.',
    condition: { kind: 'lifetime', currency: 'moonlight', amount: 1e5 },
    bonus: 1.08,
  },
  {
    id: 'ach-first-cut',
    name: "The Director's Cut",
    description: 'Prestige for the first time.',
    condition: { kind: 'prestiges', amount: 1 },
    bonus: 1.1,
  },
  {
    id: 'ach-auteur',
    name: 'Auteur',
    description: 'Prestige 3 times.',
    condition: { kind: 'prestiges', amount: 3 },
    bonus: 1.12,
  },
  {
    id: 'ach-legend',
    name: 'Living Legend',
    description: 'Prestige 10 times.',
    condition: { kind: 'prestiges', amount: 10 },
    bonus: 1.2,
  },
  {
    id: 'ach-finale',
    name: 'The Grand Finale',
    description: 'Reach Act Four — Interstellar.',
    condition: { kind: 'phase', phase: 4 },
    bonus: 1.1,
  },
];

export const ACHIEVEMENT_META: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);
