import type { PhaseDef } from '../types';

// The six acts. Phases 1-5 carry generators/upgrades; Phase 6 (The Revival)
// unlocks the prestige layer rather than a new shop.
export const PHASES: PhaseDef[] = [
  {
    id: 1,
    act: 'Act One',
    name: 'The Mundane',
    tagline: 'A bedsheet curtain and boundless nerve.',
    blurb:
      'A beige living room, rearranged into a stage. A ragtag troupe performs to an audience of mostly houseplants, on cardboard sets held up by tape and hope. It is, against all odds, magnificent.',
    unlock: null,
    unlockNote: 'The curtain — a bedsheet on a clothesline — rises. A desk-lamp spotlight hums to life.',
    accent: 'amber',
  },
  {
    id: 2,
    act: 'Act Two',
    name: 'The Escalation',
    tagline: 'A real playhouse, and the smell of fresh coffee.',
    blurb:
      'The production takes over the old downtown playhouse. A proper crew, automated stagehands, and the first taste of industrial Coffee to keep it all running. The troupe has agents now.',
    unlock: { kind: 'lifetime', currency: 'zoomies', amount: 1e5 },
    unlockNote:
      'A contractor in a tiny hard-hat surveys the empty playhouse. Act Two begins: rigging, automation, and the unmistakable reek of fresh Coffee.',
    accent: 'orange',
  },
  {
    id: 3,
    act: 'Act Three',
    name: 'The Absurd',
    tagline: 'The grand stage, and the physics of feeling.',
    blurb:
      'A cathedral of a proscenium stage. Here you balance raw Comedy against Tragedy — the two masks of theatre — and when you keep them in harmony, the whole production sings.',
    unlock: { kind: 'lifetime', currency: 'kibble', amount: 1.5e5 },
    unlockNote:
      'The house lights dim on a stage the size of a cathedral. To go higher you must balance Comedy with Tragedy — harmony is everything now.',
    accent: 'cyan',
  },
  {
    id: 4,
    act: 'Act Four',
    name: 'Interstellar',
    tagline: 'A command performance for the cosmos.',
    blurb:
      'The show leaves the atmosphere entirely, playing sold-out planets and singing arias into black holes. Limelight pours back as pure, incandescent applause.',
    unlock: { kind: 'lifetime', currency: 'gforce', amount: 4e7 },
    unlockNote:
      'The troupe takes a bow past the Kármán line, and the moon returns for a curtain call. The cast is singing to a black hole, and the black hole is listening.',
    accent: 'indigo',
  },
  {
    id: 5,
    act: 'Act Five',
    name: 'The Ouroboros',
    tagline: 'The show performs for itself, forever.',
    blurb:
      'The show loops back through its own opening night. The production becomes self-aware, staging itself inside itself inside itself — and every recursion rings out as an Echo. Some engines here burn Limelight to fold the show into the next mirror.',
    unlock: { kind: 'lifetime', currency: 'moonlight', amount: 4e6 },
    unlockNote:
      'The final scene ends exactly where it began, mid-performance. The audience is the cast. The cast is you. The first Echo rings out.',
    accent: 'violet',
  },
  {
    id: 6,
    act: 'Act Six',
    name: 'The Revival',
    tagline: 'Strike the set. Take your final bow.',
    blurb:
      'You have seen how the show ends, and how it begins again, and how it watches itself do both. Now you may close it on purpose — striking the entire production for Legacy to fund talent trees, blueprints, and artifacts that persist beyond reality itself.',
    unlock: { kind: 'lifetime', currency: 'echoes', amount: 1.2e6 },
    unlockNote:
      'A figure in the back row stands and applauds — slowly, deliberately. It is you, from the next run. The Revival is now available.',
    accent: 'emerald',
  },
];

export const PHASE_META: Record<number, PhaseDef> = Object.fromEntries(
  PHASES.map((p) => [p.id, p]),
);

/** The last phase that has a generator shop (the final phase is prestige-only). */
export const LAST_CONTENT_PHASE = 5;
/** Phase whose unlock reveals the prestige (Director's Cut) tab. */
export const PRESTIGE_PHASE = 6;
