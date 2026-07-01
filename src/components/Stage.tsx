import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../game/store';
import { aggregateEffects } from '../game/effects';
import { clickValue, currentHarmony, hasAutomation, productionRates } from '../game/engine';
import { CURRENCY_META } from '../game/content';
import { formatNumber, formatRate } from '../lib/format';
import { HarmonyMeter } from './HarmonyMeter';

interface Pop {
  id: number;
  value: number;
  x: number;
}

/** Left column — The Stage: the big satisfying numbers and the Dispatch action. */
export function Stage() {
  const state = useGameStore();
  const dispatch = useGameStore((s) => s.dispatch);
  const totals = aggregateEffects(state);
  const rates = productionRates(state, totals).net;
  const click = clickValue(state, totals);
  const autoOn = state.autoDispatch && hasAutomation(state, 'auto-dispatch');

  // Floating "+N" feedback.
  const [pops, setPops] = useState<Pop[]>([]);
  const popId = useRef(0);
  const onDispatch = () => {
    dispatch();
    const id = popId.current++;
    setPops((p) => [...p, { id, value: click, x: 30 + Math.random() * 40 }]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
  };

  // Spacebar = Dispatch (unless typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      onDispatch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [click]);

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-6 backdrop-blur">
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
        The Stage
      </h2>

      {/* Buzz — the heartbeat */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl">{CURRENCY_META.zoomies.symbol}</span>
          <span className="text-5xl font-black leading-none tabular-nums text-amber-200">
            {formatNumber(state.currencies.zoomies)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-medium text-zinc-300">{CURRENCY_META.zoomies.name}</span>
          <span className="tabular-nums text-emerald-400">{formatRate(rates.zoomies)}</span>
        </div>
      </div>

      {/* Bravos */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg">{CURRENCY_META.bravos.symbol}</span>
          <span className="text-2xl font-bold leading-none tabular-nums text-fuchsia-200">
            {formatNumber(state.currencies.bravos)}
          </span>
          <span className="text-xs text-zinc-500">{CURRENCY_META.bravos.name}</span>
          {rates.bravos !== 0 && (
            <span className="text-xs tabular-nums text-emerald-500/80">{formatRate(rates.bravos)}</span>
          )}
        </div>
      </div>

      {/* Dispatch */}
      <div className="relative mt-1">
        {pops.map((p) => (
          <span
            key={p.id}
            className="float-up pointer-events-none absolute top-2 z-10 text-lg font-black text-amber-200 drop-shadow"
            style={{ left: `${p.x}%` }}
          >
            +{formatNumber(p.value)}
          </span>
        ))}
        <button
          onClick={onDispatch}
          className="group relative w-full select-none rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 px-6 py-7 text-center text-2xl font-black uppercase tracking-wide text-amber-950 shadow-lg shadow-amber-900/40 transition-transform duration-75 hover:from-amber-300 hover:to-amber-500 active:scale-95"
        >
          <span className="block text-4xl transition-transform group-active:translate-y-0.5">🎭</span>
          Raise the Curtain!
          <span className="mt-1 block text-sm font-semibold normal-case tracking-normal text-amber-900/80">
            +{formatNumber(click)} Buzz / cue · or press Space
          </span>
        </button>
      </div>

      {autoOn && (
        <div className="-mt-2 text-center text-xs text-emerald-400/90">
          ⚙️ Auto-Cue engaged — calling cues for you.
        </div>
      )}

      {state.phaseUnlocked >= 3 && <HarmonyMeter harmony={currentHarmony(state)} state={state} />}
    </section>
  );
}
