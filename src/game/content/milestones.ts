import type { Milestone } from '../types';

// Director's Notes — narrative that fires once when its condition first holds.
// Phase-unlock notes live on PhaseDef; these are the in-between beats.
export const MILESTONES: Milestone[] = [
  {
    id: 'm-first-dispatch',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1 },
    text: 'You raise the curtain on the very first scene. Dame Beatrix blinks slowly from the wings. The show has begun.',
  },
  {
    id: 'm-first-bravo',
    condition: { kind: 'lifetime', currency: 'bravos', amount: 1 },
    text: 'A single "bravo" drifts up from the houseplants. It is technically a fern photosynthesizing, but you take it.',
  },
  {
    id: 'm-z-1k',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1000 },
    text: 'A thousand Buzz. Sir Reginald Ravensworth demands a bigger dressing room (it is a broom closet; he wants two broom closets).',
  },
  {
    id: 'm-troupe',
    condition: { kind: 'owned', generator: 'p1-matinee-troupe', amount: 1 },
    text: 'Your first troupe arrives, smelling of greasepaint and lukewarm coffee. They unionize within the hour.',
  },
  {
    id: 'm-z-50k',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 5e4 },
    text: 'The living room can no longer contain the production. Someone mentions "the old playhouse downtown" in a hushed, reverent tone.',
  },
  {
    id: 'm-kibble-first',
    condition: { kind: 'lifetime', currency: 'kibble', amount: 1 },
    text: 'The first pot of industrial Coffee gurgles to life. The automation stirs, hungry.',
  },
  {
    id: 'm-kibble-starve',
    condition: { kind: 'owned', generator: 'p2-conveyor-feeder', amount: 3 },
    text: 'An Overnight Crew slumps over, out of Coffee. Lesson learned: appetite must be matched with the urn.',
  },
  {
    id: 'm-harmony',
    condition: { kind: 'lifetime', currency: 'gforce', amount: 1000 },
    text: 'Comedy and Tragedy swirl together for the first time. When they balance, the whole stage seems to glow. When they don’t, things wobble.',
  },
  {
    id: 'm-strata',
    condition: { kind: 'owned', generator: 'p3-strata-coaster', amount: 10 },
    text: 'Ten grand stages needle the skyline. The city files a noise complaint, then buys a season subscription.',
  },
  {
    id: 'm-moon-first',
    condition: { kind: 'lifetime', currency: 'moonlight', amount: 1 },
    text: 'The first shaft of Limelight returns to the boards. It tastes like applause and vacuum.',
  },
  {
    id: 'm-blackhole',
    condition: { kind: 'owned', generator: 'p4-black-hole-aria', amount: 5 },
    text: 'The ensemble holds a high C into the event horizon. Spacetime holds its breath. Somewhere, a critic weeps.',
  },
  {
    id: 'm-first-prestige',
    condition: { kind: 'prestiges', amount: 1 },
    text: 'You strike the set. The cast bows to an empty house, pockets its Legacy, and walks back to Act One — wiser, and unmistakably the same troupe.',
  },
  {
    id: 'm-veteran',
    condition: { kind: 'prestiges', amount: 5 },
    text: 'Five productions deep. The company greets each Revival like seasoned touring players. "Again," says Dame Beatrix. "From the top."',
  },

  // === EXPANSION milestones ==============================================
  {
    id: 'm-curtain-rig',
    condition: { kind: 'owned', generator: 'p1-curtain-rig', amount: 1 },
    text: 'A real velvet curtain rises with a satisfying whoosh. A houseplant faints. This is theatre now.',
  },
  {
    id: 'm-skyscraper',
    condition: { kind: 'owned', generator: 'p2-scratch-skyscraper', amount: 10 },
    text: 'Ten fly towers pierce the skyline, scenery flying up into the dark. Property values do something unprecedented.',
  },
  {
    id: 'm-cross-feed',
    condition: { kind: 'owned', generator: 'p3-cliffhanger-rig', amount: 1 },
    text: 'A Cliffhanger creaks to life — you can now convert raw Comedy into pure Tragedy. The balance is yours to sculpt.',
  },
  {
    id: 'm-vertigo',
    condition: { kind: 'owned', generator: 'p3-vertigo-tower', amount: 1 },
    text: 'The Upper Circle tops out somewhere near low orbit. The ushers wave at a passing weather balloon.',
  },
  {
    id: 'm-quadrillion',
    condition: { kind: 'lifetime', currency: 'zoomies', amount: 1e15 },
    text: 'A quadrillion Buzz. The company accountant has stopped counting and simply whispers "yes" at the spreadsheet.',
  },
  {
    id: 'm-wormhole',
    condition: { kind: 'owned', generator: 'p4-wormhole-junction', amount: 1 },
    text: 'The first Wormhole Wings open. An actor exits stage-left and enters stage-right three seconds earlier. Nobody discusses it.',
  },
  {
    id: 'm-galaxy',
    condition: { kind: 'lifetime', currency: 'moonlight', amount: 1e6 },
    text: 'A million Limelight. The black holes have started requesting specific arias. One left a five-star review.',
  },
  {
    id: 'm-prestige-10',
    condition: { kind: 'prestiges', amount: 10 },
    text: 'Ten Revivals. You have ended the universe ten times and apologized exactly zero. The company respects this.',
  },
  {
    id: 'm-echo-first',
    condition: { kind: 'lifetime', currency: 'echoes', amount: 1 },
    text: 'The first Echo rings out — the show hearing itself for the very first time. It likes what it hears. It hears what it likes.',
  },
  {
    id: 'm-fourth-wall',
    condition: { kind: 'owned', generator: 'p5-fourth-wall', amount: 1 },
    text: 'An actor turns, looks directly at you, and winks. You have never felt so seen by something so scripted.',
  },
  {
    id: 'm-ouroboros',
    condition: { kind: 'owned', generator: 'p5-ouroboros-coaster', amount: 1 },
    text: 'The Ouroboros closes its loop and, impossibly, accelerates. The production is now infinite and aware. Hello.',
  },
  {
    id: 'm-echo-million',
    condition: { kind: 'lifetime', currency: 'echoes', amount: 1e6 },
    text: 'A million Echoes. The theatre, the company, the cosmos, and you are all the same recurring thought now. It is a very good thought.',
  },
];
