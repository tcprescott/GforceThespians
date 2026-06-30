/** First-visit / on-demand explainer for the core mechanics. */
export function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-black text-amber-200">🎭 Welcome to the production</h2>
        <p className="mt-1 text-sm text-zinc-400">
          An absurd idle game in five acts. Cats. Coasters. Theatre. Here's the shape of it:
        </p>

        <ul className="mt-4 flex flex-col gap-3 text-sm text-zinc-300">
          <li>
            <span className="font-bold text-amber-300">🎢 Dispatch &amp; build.</span> Click to
            kickstart, then spend ⚡ Zoomies on generators in <em>Backstage</em>. Generators produce
            on their own — this is an idle game, so most power comes from passive generation.
          </li>
          <li>
            <span className="font-bold text-fuchsia-300">⬆️ Upgrades are decisions.</span> Each act
            has <em>forks</em> — pick exactly one path per run; the others lock until your next
            reset. Your build is yours to choose.
          </li>
          <li>
            <span className="font-bold text-orange-300">🍖 Fuel &amp; balance.</span> Act 2 adds
            Kibble fuel (build producers to feed your machines). Act 3 makes you balance 🌀 G-Force
            against 🎻 Tension — keep them in <em>harmony</em> to amplify everything.
          </li>
          <li>
            <span className="font-bold text-emerald-300">🎟️ The Director's Cut.</span> Eventually you
            reset reality for Rider Credits, spent on a permanent talent tree, artifacts, blueprints,
            and automation. You come back to Act One stronger — and the walls rise to match.
          </li>
          <li>
            <span className="font-bold text-fuchsia-300">🌿 The cats improvise.</span> While you
            play, surprise events strike — a Catnip Frenzy, a Golden Coaster — temporarily
            multiplying everything. Watch the banner up top.
          </li>
          <li>
            <span className="font-bold text-zinc-100">🌙 Marathon idle.</span> Progress is slow and
            steady by design. Close the tab and come back — the cats keep performing, and you'll be
            credited for time away.
          </li>
        </ul>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-amber-500 px-4 py-2.5 font-bold text-amber-950 hover:bg-amber-400"
        >
          Raise the curtain
        </button>
      </div>
    </div>
  );
}
