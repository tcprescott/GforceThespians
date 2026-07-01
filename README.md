# 🎭 Curtain Call

An absurd, highly scalable incremental / idler game about **staging the greatest
theatre production in the cosmos**. It starts grounded — a scrappy amateur show
in a beige living room, bedsheet curtain and all — and escalates to cosmic
absurdity: command performances among the stars, arias sung into black holes.
Then you strike the set for **Legacy** and do it all again, stronger.

**▶ Play:** https://tcprescott.github.io/GforceThespians/

> Tuned for **marathon idle** pacing: a long, satisfying first run through all
> six acts, generous offline progress, and a prestige loop that snowballs across
> many runs. Your build decisions each run are the moment-to-moment hook.

## The six acts

| Act | Name | Setting | New mechanic |
| --- | ---- | ------- | ------------ |
| 1 | The Mundane | A living-room amateur theatre | Buzz ✨ + Bravos 🎭 |
| 2 | The Escalation | The old downtown playhouse | **Coffee ☕ fuel** — build producers to feed the crew, or it starves |
| 3 | The Absurd | The grand main stage | **Harmony** — balance Comedy 😄 vs Tragedy 😢 (the two masks) to amplify *all* output |
| 4 | Interstellar | A command performance for the cosmos | **Limelight 🌟** — the resonance that carries you onward |
| 5 | The Ouroboros | A self-aware, self-referential meta-theatre | **Echoes 🔁** — the show performing for itself, forever |
| 6 | The Revival | The prestige layer | Strike the set for **Legacy ⭐** → talents, artifacts, blueprints, automation |

## What's in it

- **8 currencies** with an interlocking economy (fuel, a balance mechanic, a
  meta-theatre currency, and a persistent prestige currency).
- **43 generators** across five content acts, each with cost-scaling and (for
  Act 2+) fuel consumption.
- **66 upgrades**, including **13 forks** — pick exactly one path per run; the
  others lock until your next reset, so every run is a real build decision.
- **Prestige (The Revival):** a persistent **talent tree** (with two endless
  repeatable capstones), **artifacts**, and **structural blueprints**.
- **Automation & logic gates:** auto-cue, per-generator auto-buyers, and reserve
  thresholds — unlocked permanently via blueprints.
- **40 achievements**, each a small permanent stacking multiplier.
- **The Rising Wall:** phase thresholds scale with your persistent power, so
  every run stays a genuine climb instead of collapsing to seconds.
- **Random "The Company Improvises" events**, **offline progress**,
  **localStorage saves**, and a scrolling narrative log.

## Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite** (build / dev server) + **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Zustand** for global state + the 10-ticks/second loop

## Architecture

The game logic is a **pure engine** with no React or DOM dependencies, so the
exact same code powers the live app *and* a headless balance simulator.

```
src/
├── game/
│   ├── types.ts          # Type vocabulary (currencies, generators, effects, ...)
│   ├── balance.ts        # Tuning dials (pacing, prestige, offline, harmony)
│   ├── content/          # All data: currencies, generators, upgrades, phases,
│   │                     #   milestones, talents, artifacts, blueprints,
│   │                     #   automation, achievements
│   ├── state.ts          # GameState shape + run/persistent split + constructors
│   ├── effects.ts        # Declarative-effect aggregation → multipliers
│   ├── engine.ts         # PURE: cost/output, fuel efficiency, harmony, tick,
│   │                     #   buying, prestige, offline, unlock checks
│   ├── selectors.ts      # UI-facing derived helpers
│   ├── store.ts          # Thin Zustand wrapper + persist + offline-on-load
│   └── useGameTick.ts    # 10/sec heartbeat (real-elapsed-time based)
├── components/           # Stage, CurrencyBar, Backstage, Upgrades, Automation,
│                         #   The Revival (talents/artifacts/blueprints),
│                         #   Achievements, Stats, Director's Notes, OfflineModal
├── lib/format.ts         # Big-number + duration formatting
└── App.tsx               # 3-column tabbed layout
scripts/
├── sim.ts                # Headless balance simulator (npm run sim)
├── serve.mjs             # Plain static server for testing the build
└── smoke.mjs             # Headless browser smoke test
```

### Declarative effects

Upgrades, talents, artifacts and achievements all express power as a list of
`Effect` descriptors (`genMult`, `currencyMult`, `globalMult`, `costMult`,
`clickMult`, `prestigeMult`, `offlineMult`, ...). The engine aggregates them
into multipliers at tick time, so adding a new bonus source never touches the
math.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

```bash
npm run build        # type-check + production build to dist/
npm run typecheck
npm run sim          # headless balance sim (try: npm run sim -- --runs 8)
npm run smoke        # build + serve:static first, then this drives a browser
```

### Balance testing

`npm run sim` fast-forwards a full playthrough with an idle-player strategy and
prints how long each act takes to unlock, the prestige loop, and any stalls —
so the numbers we ship are the numbers we tested. The master pacing dials live
in `src/game/balance.ts` (`GLOBAL_COST_GROWTH_ADD`, `GLOBAL_OUTPUT_SCALE`,
`WALL_POWER_TRACK`, the prestige weights/divisor).

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `main` or
the active dev branch. **One required manual step** (the workflow token can't do
it automatically): repo **Settings → Pages → Build and deployment → Source:
"GitHub Actions"**. After that, the next push deploys automatically to
**https://tcprescott.github.io/GforceThespians/**. (Until Pages is enabled, the
deploy job fails at "Setup Pages" — that's expected.)

The Vite `base` is `/GforceThespians/` for production builds only (local dev
stays at `/`). If the repo is renamed, update `base` in `vite.config.ts` and
`homepage` in `package.json`.
