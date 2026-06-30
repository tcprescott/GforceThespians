import type { PhaseDef } from '../types';

// The five acts. Phases 1-4 carry generators/upgrades; Phase 5 (the Director's
// Cut) unlocks the prestige layer rather than a new shop.
export const PHASES: PhaseDef[] = [
  {
    id: 1,
    act: 'Act One',
    name: 'The Mundane',
    tagline: 'Cats. Cardboard. Curtain up.',
    blurb:
      'A beige living room. Cats perform theatre atop cardboard rollercoasters. The audience is mostly houseplants. It is, against all odds, magnificent.',
    unlock: null,
    unlockNote: 'The curtain rises on a beige living room. A desk-lamp spotlight hums to life.',
    accent: 'amber',
  },
  {
    id: 2,
    act: 'Act Two',
    name: 'The Escalation',
    tagline: 'Backyard timber and the smell of kibble.',
    blurb:
      'The production spills into the backyard. Wooden coasters, automated litterboxes, and the first taste of industrial Kibble fuel. The cats have agents now.',
    unlock: { kind: 'lifetime', currency: 'zoomies', amount: 1e5 },
    unlockNote:
      'A contractor cat in a tiny hard-hat surveys the backyard. Act Two begins: timber, automation, and the unmistakable reek of Kibble.',
    accent: 'orange',
  },
  {
    id: 3,
    act: 'Act Three',
    name: 'The Absurd',
    tagline: 'Strata-coasters and the physics of feeling.',
    blurb:
      'Strata-coasters pierce the clouds. Here you balance raw G-Force against Dramatic Tension — keep them in harmony and the whole production sings.',
    unlock: { kind: 'lifetime', currency: 'kibble', amount: 1.5e5 },
    unlockNote:
      'The roof is gone. A strata-coaster spears the troposphere. To go higher you must balance G-Force with Dramatic Tension — harmony is everything now.',
    accent: 'cyan',
  },
  {
    id: 4,
    act: 'Act Four',
    name: 'Interstellar',
    tagline: 'Giga-coasters that wrap the moon.',
    blurb:
      'The coasters leave the atmosphere entirely, looping the moon and singing arias into black holes. Moonlight pours back as pure resonance.',
    unlock: { kind: 'lifetime', currency: 'gforce', amount: 4e7 },
    unlockNote:
      'A giga-coaster slingshots past the Kármán line and lassos the moon. The cats are singing to a black hole, and the black hole is listening.',
    accent: 'indigo',
  },
  {
    id: 5,
    act: 'Act Five',
    name: 'The Ouroboros',
    tagline: 'The show performs for itself, forever.',
    blurb:
      'The coasters loop back through their own opening night. The production becomes self-aware, staging itself inside itself inside itself — and every recursion rings out as an Echo. Some engines here burn Moonlight to fold the show into the next mirror.',
    unlock: { kind: 'lifetime', currency: 'moonlight', amount: 4e6 },
    unlockNote:
      'The final coaster crests its hill and arrives at its own starting station, mid-performance. The audience is the cast. The cast is you. The first Echo rings out.',
    accent: 'violet',
  },
  {
    id: 6,
    act: 'Act Six',
    name: "The Director's Cut",
    tagline: 'Strike the reality. Roll the credits.',
    blurb:
      'You have seen how the show ends, and how it begins again, and how it watches itself do both. Now you may end it on purpose — collapsing the entire production into Rider Credits to fund talent trees, blueprints, and artifacts that persist beyond reality itself.',
    unlock: { kind: 'lifetime', currency: 'echoes', amount: 1.2e6 },
    unlockNote:
      'A figure in the back row stands and applauds — slowly, deliberately. It is you, from the next run. The Director’s Cut is now available.',
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
