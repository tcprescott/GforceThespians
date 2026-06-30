import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AutoRule } from './types';
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

export interface GameStore extends GameState {
  /** Transient: populated on load if meaningful offline progress occurred. */
  offlineSummary: OfflineSummary;

  // Actions
  dispatch: () => void;
  buyGen: (id: string, count?: number) => void;
  buyGenMax: (id: string) => void;
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
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...createInitialState(now()),
      offlineSummary: null,

      dispatch: () => set((s) => dispatchCoaster(s)),
      buyGen: (id, count = 1) => set((s) => buyGenerator(s, id, count)),
      buyGenMax: (id) => set((s) => buyGeneratorMax(s, id)),
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

      tick: (dt) => set((s) => engineTick(s, dt, now())),

      dismissOffline: () => set({ offlineSummary: null }),
      hardReset: () => set({ ...createInitialState(now()), offlineSummary: null }),
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
