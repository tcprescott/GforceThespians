import { useGameStore } from '../game/store';
import { talentCost, talentRank, talentUnlocked } from '../game/engine';
import { TALENTS, TALENT_META } from '../game/content';
import { formatInt, formatNumber } from '../lib/format';

export function TalentTree() {
  const state = useGameStore();
  const buy = useGameStore((s) => s.purchaseTalent);

  const tiers = [...new Set(TALENTS.map((t) => t.tier))].sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-4">
      {tiers.map((tier) => (
        <div key={tier} className="flex flex-col gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Tier {tier + 1}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {TALENTS.filter((t) => t.tier === tier).map((t) => {
              const rank = talentRank(state, t.id);
              const maxed = rank >= t.maxRank;
              const unlocked = talentUnlocked(state, t.id);
              const cost = talentCost(state, t.id);
              const affordable = unlocked && !maxed && state.riderCredits >= cost;

              return (
                <button
                  key={t.id}
                  onClick={() => affordable && buy(t.id)}
                  disabled={!affordable}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    maxed
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : !unlocked
                        ? 'border-zinc-800 bg-zinc-900/40 opacity-50'
                        : affordable
                          ? 'border-emerald-500/40 bg-zinc-800/60 hover:border-emerald-400 hover:bg-zinc-800 cursor-pointer'
                          : 'border-zinc-700/50 bg-zinc-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-zinc-100">{t.name}</span>
                    <span className="shrink-0 rounded bg-zinc-700/60 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-zinc-300">
                      {formatInt(rank)}/{t.maxRank >= 1000 ? '∞' : t.maxRank}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-snug text-zinc-400">{t.description}</p>
                  <div className="mt-1.5 text-xs">
                    {maxed ? (
                      <span className="font-bold text-emerald-400">✓ Maxed</span>
                    ) : !unlocked ? (
                      <span className="text-zinc-600">
                        Requires:{' '}
                        {(t.requires ?? []).map((r) => TALENT_META[r]?.name).join(', ')}
                      </span>
                    ) : (
                      <span className={`font-semibold tabular-nums ${affordable ? 'text-emerald-300' : 'text-zinc-500'}`}>
                        ⭐ {formatNumber(cost)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
