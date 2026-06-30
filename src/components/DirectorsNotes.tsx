import { useGameStore } from '../game/store';
import type { LogTone } from '../game/types';

const TONE: Record<LogTone, string> = {
  note: 'border-zinc-700 text-zinc-400',
  phase: 'border-amber-400 bg-amber-400/5 text-amber-100',
  prestige: 'border-emerald-400 bg-emerald-400/5 text-emerald-100',
  achievement: 'border-fuchsia-400/60 bg-fuchsia-400/5 text-fuchsia-100',
  system: 'border-zinc-600 text-zinc-300',
};

/** Right column — The Director's Notes: the scrolling narrative log. */
export function DirectorsNotes() {
  const log = useGameStore((s) => s.log);

  return (
    <section className="flex min-h-0 flex-col gap-3 rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-5 backdrop-blur lg:max-h-[calc(100vh-7rem)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
        The Director's Notes
      </h2>
      <div className="notes-scroll flex flex-col gap-2 overflow-y-auto pr-1">
        {log.map((entry, i) => (
          <p
            key={entry.id}
            className={`rounded-lg border-l-2 px-3 py-2 text-sm leading-relaxed transition-colors ${TONE[entry.tone] ?? TONE.note} ${
              i === 0 ? 'ring-1 ring-white/5' : ''
            }`}
          >
            {entry.text}
          </p>
        ))}
      </div>
    </section>
  );
}
