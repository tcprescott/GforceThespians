import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AutoRule } from './types';
import type { ActiveEvent } from './content/events';
import {
  EVENTS,
  EVENT_FIRST_GAP_SECONDS,
  EVENT_MAX_GAP_SECONDS,
  EVENT_MIN_GAP_SECONDS,
} from './content/events';
import type { GameState } from './state';
import { createInitialState, zeroBag } from './state';
import {
  applyOffline,
  buyArtifact,
  buyBlueprint,
  buyGenerator,
  buyGeneratorMax,
  buyTalent,
  buyUpgrade,
  dispatchCoaster,
  doPrestige,
  tick as engineTick,
} from './engine';

type OfflineSummary = ReturnType<typeof applyOffline>['summary'];

/** Quantity selected by the buy-amount toggle. */
export type BuyMode = 1 | 10 | 100 | 'max';

export interface GameStore extends GameState {
  /** Transient: populated on load if meaningful offline progress occurred. */
  offlineSummary: OfflineSummary;
  /** UI: how many units a generator's Buy button purchases. */
  buyMode: BuyMode;
  /** The currently-running "Cats Improvise" event, if any. */
  activeEvent: ActiveEvent | null;
  /** Epoch ms when the next event may fire. */
  nextEventAt: number;

  // Actions
  dispatch: () => void;
  buyGen: (id: string, count?: number) => void;
  buyGenMax: (id: string) => void;
  setBuyMode: (mode: BuyMode) => void;
  importSave: (raw: string) => boolean;
  exportSave: () => string;
  purchaseUpgrade: (id: string) => void;
  purchaseTalent: (id: string) => void;
  purchaseArtifact: (id: string) => void;
  purchaseBlueprint: (id: string) => void;
  prestige: () => void;
  toggleAutoDispatch: () => void;
  setAutoRule: (id: string, rule: Partial<AutoRule>) => void;
  tick: (dt: number) => void;
  dismissOffline: () => void;
  hardReset: () => void;
}

const now = () => Date.now();

const randomEventGap = () =>
  (EVENT_MIN_GAP_SECONDS + Math.random() * (EVENT_MAX_GAP_SECONDS - EVENT_MIN_GAP_SECONDS)) * 1000;

/**
 * Random-event scheduler (active play only). Returns the event-field changes to
 * apply this tick, or null for no change. Lives in the store (uses Math.random)
 * so the pure engine + simulator remain deterministic.
 */
function scheduleEvents(
  s: GameStore,
  t: number,
): Partial<GameStore> | null {
  if (s.activeEvent) {
    if (t >= s.activeEvent.until) {
      return { activeEvent: null, eventMult: 1, nextEventAt: t + randomEventGap() };
    }
    return null; // still running
  }
  if (t >= s.nextEventAt) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    return { activeEvent: { ...ev, until: t + ev.durationSeconds * 1000 }, eventMult: ev.mult };
  }
  return null;
}

/** Heal a persisted blob into a complete, valid GameState (guards schema drift). */
function sanitize(p: Partial<GameState> | undefined, t: number): GameState {
  const fresh = createInitialState(t);
  if (!p) return fresh;
  return {
    currencies: { ...zeroBag(), ...(p.currencies ?? {}) },
    lifetime: { ...zeroBag(), ...(p.lifetime ?? {}) },
    owned: p.owned ?? {},
    upgrades: p.upgrades ?? [],
    exclusiveChosen: p.exclusiveChosen ?? {},
    phaseUnlocked: p.phaseUnlocked ?? 1,
    riderCredits: p.riderCredits ?? 0,
    talents: p.talents ?? {},
    artifacts: p.artifacts ?? [],
    blueprints: p.blueprints ?? [],
    achievements: p.achievements ?? [],
    firedMilestones: p.firedMilestones ?? [],
    autoDispatch: p.autoDispatch ?? false,
    autoRules: p.autoRules ?? {},
    stats: {
      ...fresh.stats,
      ...(p.stats ?? {}),
      allTime: { ...zeroBag(), ...(p.stats?.allTime ?? {}) },
    },
    log: p.log && p.log.length ? p.log : fresh.log,
    nextLogId: p.nextLogId ?? fresh.nextLogId,
    lastSeen: p.lastSeen ?? t,
    eventMult: 1, // never restore a buff from a save
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(now()),
      offlineSummary: null,
      buyMode: 1 as BuyMode,
      activeEvent: null,
      nextEventAt: now() + EVENT_FIRST_GAP_SECONDS * 1000,

      dispatch: () => set((s) => dispatchCoaster(s)),
      buyGen: (id, count = 1) => set((s) => buyGenerator(s, id, count)),
      buyGenMax: (id) => set((s) => buyGeneratorMax(s, id)),
      setBuyMode: (mode) => set({ buyMode: mode }),
      purchaseUpgrade: (id) => set((s) => buyUpgrade(s, id)),
      purchaseTalent: (id) => set((s) => buyTalent(s, id)),
      purchaseArtifact: (id) => set((s) => buyArtifact(s, id)),
      purchaseBlueprint: (id) => set((s) => buyBlueprint(s, id)),
      prestige: () => set((s) => doPrestige(s, now())),

      toggleAutoDispatch: () => set((s) => ({ autoDispatch: !s.autoDispatch })),
      setAutoRule: (id, rule) =>
        set((s) => {
          const existing: AutoRule = s.autoRules[id] ?? { enabled: false, reservePercent: 0 };
          return { autoRules: { ...s.autoRules, [id]: { ...existing, ...rule } } };
        }),

      tick: (dt) =>
        set((s) => {
          const t = now();
          const evt = scheduleEvents(s, t);
          const base = evt ? { ...s, ...evt } : s;
          return engineTick(base, dt, t);
        }),

      dismissOffline: () => set({ offlineSummary: null }),
      hardReset: () =>
        set({
          ...createInitialState(now()),
          offlineSummary: null,
          activeEvent: null,
          nextEventAt: now() + EVENT_FIRST_GAP_SECONDS * 1000,
        }),

      // Unicode-safe base64 of the persisted data — portable across browsers.
      exportSave: () => {
        const s = get();
        const data = sanitize(s, now());
        return btoa(unescape(encodeURIComponent(JSON.stringify({ v: 2, state: data }))));
      },
      importSave: (raw) => {
        try {
          const json = decodeURIComponent(escape(atob(raw.trim())));
          const parsed = JSON.parse(json);
          const data = sanitize((parsed.state ?? parsed) as Partial<GameState>, now());
          set({ ...data, offlineSummary: null });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'gforce-thespians-save',
      version: 2,
      // Persist only data fields — never actions or transient offline summary.
      partialize: (s): Partial<GameState> => ({
        currencies: s.currencies,
        lifetime: s.lifetime,
        owned: s.owned,
        upgrades: s.upgrades,
        exclusiveChosen: s.exclusiveChosen,
        phaseUnlocked: s.phaseUnlocked,
        riderCredits: s.riderCredits,
        talents: s.talents,
        artifacts: s.artifacts,
        blueprints: s.blueprints,
        achievements: s.achievements,
        firedMilestones: s.firedMilestones,
        autoDispatch: s.autoDispatch,
        autoRules: s.autoRules,
        stats: s.stats,
        log: s.log,
        nextLogId: s.nextLogId,
        lastSeen: s.lastSeen,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitize(persisted as Partial<GameState>, now()),
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // With synchronous localStorage, this callback fires *inside* create(),
        // before the `useGameStore` binding exists. Defer to a microtask so the
        // store is bound when we credit offline progress and surface the
        // welcome-back summary. (Without this, offline progress is silently lost.)
        queueMicrotask(() => {
          const result = applyOffline(useGameStore.getState(), now());
          useGameStore.setState({ ...result.state, offlineSummary: result.summary });
        });
      },
    },
  ),
);
