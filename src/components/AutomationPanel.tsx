import { useGameStore } from '../game/store';
import { hasAutomation } from '../game/engine';
import { AUTOMATIONS, GENERATOR_META, GENERATORS } from '../game/content';

/** Middle tab — Automation & Logic Gates (unlocked via Director's Cut blueprints). */
export function AutomationPanel() {
  const state = useGameStore();
  const toggleAutoDispatch = useGameStore((s) => s.toggleAutoDispatch);
  const setAutoRule = useGameStore((s) => s.setAutoRule);

  const autoDispatch = hasAutomation(state, 'auto-dispatch');
  const autoBuy = hasAutomation(state, 'auto-buy');
  const logicGates = hasAutomation(state, 'logic-gates');

  // Only count/show rules for generators that still exist (guards stale saves).
  const enabledRules = Object.entries(state.autoRules).filter(
    ([id, r]) => r.enabled && GENERATOR_META[id],
  );

  const lockNote = (
    <p className="mt-1 text-xs text-zinc-500">
      🔒 Locked — unlock the matching blueprint in the{' '}
      <span className="text-emerald-300">Director's Cut</span>.
    </p>
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-400">
        Automation is the idle endgame: set it and the show runs itself. Everything here is unlocked
        permanently via blueprints in the Director's Cut.
      </p>

      {/* Auto-Dispatcher */}
      <section className="rounded-xl border border-zinc-700/60 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-100">⚙️ {AUTOMATIONS[0].name}</h3>
            <p className="text-xs text-zinc-400">{AUTOMATIONS[0].description}</p>
          </div>
          {autoDispatch ? (
            <button
              onClick={toggleAutoDispatch}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                state.autoDispatch
                  ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400'
                  : 'border border-zinc-600 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {state.autoDispatch ? 'ON' : 'OFF'}
            </button>
          ) : null}
        </div>
        {!autoDispatch && lockNote}
      </section>

      {/* Auto-Buyers */}
      <section className="rounded-xl border border-zinc-700/60 bg-zinc-900/50 p-4">
        <h3 className="font-bold text-zinc-100">⚙️ {AUTOMATIONS[1].name}</h3>
        <p className="text-xs text-zinc-400">{AUTOMATIONS[1].description}</p>
        {autoBuy ? (
          <p className="mt-2 text-xs text-emerald-300/90">
            Active on {enabledRules.length} generator{enabledRules.length === 1 ? '' : 's'}. Toggle{' '}
            <span className="font-semibold">auto</span> on any generator over in Backstage.
          </p>
        ) : (
          lockNote
        )}
      </section>

      {/* Logic Gates */}
      <section className="rounded-xl border border-zinc-700/60 bg-zinc-900/50 p-4">
        <h3 className="font-bold text-zinc-100">⚙️ {AUTOMATIONS[2].name}</h3>
        <p className="text-xs text-zinc-400">{AUTOMATIONS[2].description}</p>
        {!logicGates && lockNote}
        {logicGates && (
          <div className="mt-3 flex flex-col gap-2">
            {enabledRules.length === 0 && (
              <p className="text-xs text-zinc-500">
                Enable auto-buy on a generator to set its reserve threshold here.
              </p>
            )}
            {enabledRules.map(([id, rule]) => {
              const def = GENERATOR_META[id];
              if (!def || !GENERATORS.includes(def)) return null;
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-xs text-zinc-300">{def.name}</span>
                  <input
                    type="range"
                    min={0}
                    max={95}
                    step={5}
                    value={rule.reservePercent}
                    onChange={(e) => setAutoRule(id, { reservePercent: Number(e.target.value) })}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="w-16 shrink-0 text-right text-xs tabular-nums text-zinc-400">
                    keep {rule.reservePercent}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
