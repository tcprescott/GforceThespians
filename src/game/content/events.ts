// "The Cats Improvise" — random, timed buff events that fire during ACTIVE
// play (they're scheduled by the store's tick, which only runs while the tab is
// open). Each applies a temporary global production multiplier. Kept entirely
// out of the pure engine so the headless simulator stays deterministic.

export interface GameEvent {
  id: string;
  name: string;
  emoji: string;
  text: string;
  durationSeconds: number;
  /** Global production (and click) multiplier while active. */
  mult: number;
}

/** A currently-running event, with its wall-clock expiry. */
export interface ActiveEvent extends GameEvent {
  /** Epoch ms when the buff ends. */
  until: number;
}

export const EVENTS: GameEvent[] = [
  {
    id: 'catnip-frenzy',
    name: 'Catnip Frenzy',
    emoji: '🌿',
    text: 'The entire cast hits the catnip at once. Everything blurs and accelerates.',
    durationSeconds: 30,
    mult: 5,
  },
  {
    id: 'standing-o',
    name: 'Standing Ovation',
    emoji: '👏',
    text: 'The audience is on its feet. (The ferns are trembling. One has tears.)',
    durationSeconds: 45,
    mult: 3,
  },
  {
    id: 'golden-coaster',
    name: 'The Golden Coaster',
    emoji: '✨',
    text: 'A shimmering golden coaster glides through the production. Catch the wave!',
    durationSeconds: 20,
    mult: 8,
  },
  {
    id: 'gone-viral',
    name: 'Gone Viral',
    emoji: '📈',
    text: 'A clip of Tyrande’s dramatic meow detonates across the feline internet.',
    durationSeconds: 40,
    mult: 4,
  },
  {
    id: 'understudy-genius',
    name: 'Understudy of Genius',
    emoji: '🎓',
    text: 'The understudy is, inexplicably, a once-in-a-generation prodigy tonight.',
    durationSeconds: 25,
    mult: 6,
  },
  {
    id: 'second-wind',
    name: 'Second Wind',
    emoji: '💨',
    text: 'Somewhere in the third act, the whole troupe finds another gear.',
    durationSeconds: 50,
    mult: 3.5,
  },
  {
    id: 'critic-swoon',
    name: 'The Critic Swoons',
    emoji: '📰',
    text: 'The hallway critic faints from sheer artistry and files five stars on the way down.',
    durationSeconds: 35,
    mult: 4.5,
  },
];

export const EVENT_META: Record<string, GameEvent> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e]),
);

/** Active-play seconds between events (a random gap in this range). */
export const EVENT_MIN_GAP_SECONDS = 120;
export const EVENT_MAX_GAP_SECONDS = 300;
/** Delay before the very first event of a session. */
export const EVENT_FIRST_GAP_SECONDS = 75;
