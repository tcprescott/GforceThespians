# 🎭 The G-Force Thespians

An absurd, highly scalable incremental / idler game about **cats performing
theatre on rollercoasters**. It starts grounded — cardboard coasters in a beige
living room — and escalates to cosmic absurdity: giga-coasters wrapping the moon
and singing arias into black holes. Then you reset reality for Rider Credits and
do it all again, stronger.

**▶ Play:** https://tcprescott.github.io/GforceThespians/

> Tuned for **marathon idle** pacing: a long, satisfying first run through all
> five acts, generous offline progress, and a prestige loop that snowballs
> across many runs. Your build decisions each run are the moment-to-moment hook.

## The five acts

| Phase | Act | Theme | New mechanic |
| ----- | --- | ----- | ------------ |
| 1 | The Mundane | Cardboard coasters, cats, the living room | Zoomies ⚡ + Bravos 🎭 |
| 2 | The Escalation | Backyard timber, litterbox automation | **Kibble 🍖 fuel** — build producers to feed consumers, or they starve |
| 3 | The Absurd | Strata-coasters piercing the clouds | **Harmony** — balance G-Force 🌀 vs Dramatic Tension 🎻 to amplify *all* output |
| 4 | Interstellar | Giga-coasters wrapping the moon | **Moonlight 🌙** — the resonance that unlocks prestige |
| 5 | The Director's Cut | The prestige layer | Reset for **Rider Credits 🎟️** → talents, artifacts, blueprints, automation |

## What's in it

- **7 currencies** with an interlocking economy (fuel, a balance mechanic, a
  prestige currency).
- **~25 generators** across four acts, each with cost-scaling and (for Act 2+)
  fuel consumption.
- **~30 upgrades**, including **forks** — pick exactly one path per run; the
  others lock until your next reset, so every run is a real build decision.
- **Prestige (The Director's Cut):** a persistent **talent tree** (with an
  endless repeatable capstone), **artifacts**, and **structural blueprints**.
- **Automation & logic gates:** auto-dispatch, per-generator auto-buyers, and
  reserve thresholds — unlocked permanently via blueprints.
- **~20 achievements**, each a small permanent stacking multiplier.
- **The Rising Wall:** phase thresholds scale with your persistent power, so
  every run stays a genuine climb instead of collapsing to seconds.
- **Offline progress**, **localStorage saves**, and a scrolling narrative log.

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
│                         #   Director's Cut (talents/artifacts/blueprints),
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

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
One-time setup:

1. Push to GitHub and merge to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Publishes to **https://tcprescott.github.io/GforceThespians/**.

The Vite `base` is `/GforceThespians/` for production builds only (local dev
stays at `/`). If the repo is renamed, update `base` in `vite.config.ts` and
`homepage` in `package.json`.
