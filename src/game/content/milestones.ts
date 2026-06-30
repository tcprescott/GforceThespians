import type { Milestone } from '../types';

// Director's Notes — narrative that fires once when its condition first holds.
// Phase-unlock notes live on PhaseDef; these are the in-between beats.
export const MILESTONES: Milestone[] = [
  {
    id: 'm-first-dispatch',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1 },
    text: 'You dispatch the first cardboard coaster. Tyrande the tabby blinks slowly from the wings. The show has begun.',
  },
  {
    id: 'm-first-bravo',
    condition: { kind: 'lifetime', currency: 'bravos', amount: 1 },
    text: 'A single "bravo" drifts up from the houseplants. It is technically a fern photosynthesizing, but you take it.',
  },
  {
    id: 'm-z-1k',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1000 },
    text: 'A thousand zoomies. Sir Reginald Pounce demands a bigger trailer (it is a shoebox; he wants two shoeboxes).',
  },
  {
    id: 'm-troupe',
    condition: { kind: 'owned', generator: 'p1-matinee-troupe', amount: 1 },
    text: 'Your first troupe arrives, smelling of greasepaint and tuna. They unionize within the hour.',
  },
  {
    id: 'm-z-50k',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 5e4 },
    text: 'The living room can no longer contain the production. Someone mentions "the backyard" in a hushed, reverent tone.',
  },
  {
    id: 'm-kibble-first',
    condition: { kind: 'lifetime', currency: 'kibble', amount: 1 },
    text: 'The first pellet of industrial Kibble clatters into the hopper. The automation stirs, hungry.',
  },
  {
    id: 'm-kibble-starve',
    condition: { kind: 'owned', generator: 'p2-conveyor-feeder', amount: 3 },
    text: 'A Conveyor Feeder coughs and stalls — out of fuel. Lesson learned: appetite must be matched with Kibble.',
  },
  {
    id: 'm-harmony',
    condition: { kind: 'lifetime', currency: 'gforce', amount: 1000 },
    text: 'G-Force and Tension swirl together for the first time. When they balance, the coasters seem to glow. When they don’t, things wobble.',
  },
  {
    id: 'm-strata',
    condition: { kind: 'owned', generator: 'p3-strata-coaster', amount: 10 },
    text: 'Ten strata-coasters needle the stratosphere. Air traffic control files a complaint, then buys a season pass.',
  },
  {
    id: 'm-moon-first',
    condition: { kind: 'lifetime', currency: 'moonlight', amount: 1 },
    text: 'The first drop of Moonlight returns down the rails. It tastes like applause and vacuum.',
  },
  {
    id: 'm-blackhole',
    condition: { kind: 'owned', generator: 'p4-black-hole-aria', amount: 5 },
    text: 'The cats hold a high C into the event horizon. Spacetime holds its breath. Somewhere, a critic weeps.',
  },
  {
    id: 'm-prestige-ready',
    condition: { kind: 'lifetime', currency: 'moonlight', amount: 3e4 },
    text: 'You understand now how the show ends — and that you could choose to end it, and begin again, stronger. The Director’s Cut beckons.',
  },
  {
    id: 'm-first-prestige',
    condition: { kind: 'prestiges', amount: 1 },
    text: 'Reality strikes its set. The cats bow to an empty house, pocket their Rider Credits, and walk back to Act One — wiser, and unmistakably the same cats.',
  },
  {
    id: 'm-veteran',
    condition: { kind: 'prestiges', amount: 5 },
    text: 'Five productions deep. The cats greet each reset like seasoned touring performers. "Again," says Tyrande. "From the top."',
  },
];
