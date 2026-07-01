import { useGameStore } from '../game/store';
import { UPGRADES, PHASES, LAST_CONTENT_PHASE } from '../game/content';
import type { UpgradeDef } from '../game/types';
import { accentFor } from './theme';
import { UpgradeCard } from './UpgradeCard';

/**
 * Middle tab — Upgrades, the per-run decision layer. Forks (exclusive groups)
 * are rendered as "choose one" blocks so the build decision is unmistakable.
 */
export function UpgradesPanel() {
  const state = useGameStore();

  const phasesToShow = PHASES.filter((p) => p.id <= state.phaseUnlocked && p.id <= LAST_CONTENT_PHASE);

  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-400">
        Upgrades are your run's identity. <span className="text-amber-300">Forks</span> let you pick
        exactly one path — chosen for this run and reset on a Revival, so every reset is a
        chance to build differently.
      </p>

      {phasesToShow.map((phase) => {
        const accent = accentFor(phase.accent);
        const phaseUpgrades = UPGRADES.filter((u) => u.phase === phase.id);
        if (phaseUpgrades.length === 0) return null;

        const plain = phaseUpgrades.filter((u) => !u.exclusiveGroup);
        const forks = new Map<string, UpgradeDef[]>();
        for (const u of phaseUpgrades) {
          if (!u.exclusiveGroup) continue;
          const list = forks.get(u.exclusiveGroup) ?? [];
          list.push(u);
          forks.set(u.exclusiveGroup, list);
        }

        return (
          <section key={phase.id}>
            <h3 className={`mb-2 text-sm font-bold ${accent.text}`}>
              {phase.act}: {phase.name}
            </h3>

            <div className="grid gap-2 sm:grid-cols-2">
              {plain.map((u) => (
                <UpgradeCard key={u.id} def={u} state={state} />
              ))}
            </div>

            {[...forks.entries()].map(([group, options]) => {
              const chosen = state.exclusiveChosen[group];
              return (
                <div
                  key={group}
                  className="mt-3 rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/[0.04] p-3"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                      ⑂ {options[0].forkLabel ?? 'Choose one'}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {chosen ? 'Path chosen for this run' : 'Pick one — the others lock'}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {options.map((u) => (
                      <UpgradeCard key={u.id} def={u} state={state} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
