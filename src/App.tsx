import { useEffect, useState } from 'react';
import { useGameTick } from './game/useGameTick';
import { useGameStore } from './game/store';
import { canPrestige } from './game/engine';
import { PHASE_META } from './game/content';
import { accentFor } from './components/theme';
import { CurrencyBar } from './components/CurrencyBar';
import { Stage } from './components/Stage';
import { Backstage } from './components/Backstage';
import { UpgradesPanel } from './components/UpgradesPanel';
import { AutomationPanel } from './components/AutomationPanel';
import { DirectorsCut } from './components/DirectorsCut';
import { AchievementsPanel } from './components/AchievementsPanel';
import { StatsPanel } from './components/StatsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { DirectorsNotes } from './components/DirectorsNotes';
import { OfflineModal } from './components/OfflineModal';
import { HelpModal } from './components/HelpModal';

type Tab = 'backstage' | 'upgrades' | 'automation' | 'cut' | 'achievements' | 'stats' | 'settings';

const TABS: { key: Tab; label: string }[] = [
  { key: 'backstage', label: '🎢 Backstage' },
  { key: 'upgrades', label: '⬆️ Upgrades' },
  { key: 'automation', label: '⚙️ Automation' },
  { key: 'cut', label: "🎟️ Director's Cut" },
  { key: 'achievements', label: '🏆 Achievements' },
  { key: 'stats', label: '📊 Stats' },
  { key: 'settings', label: '⚙️ Settings' },
];

export default function App() {
  useGameTick();
  const [tab, setTab] = useState<Tab>('backstage');
  const [showHelp, setShowHelp] = useState(false);
  const phaseUnlocked = useGameStore((s) => s.phaseUnlocked);
  const prestiges = useGameStore((s) => s.stats.prestiges);
  const isFreshGame = useGameStore((s) => s.stats.totalClicks === 0 && s.stats.playtimeSeconds < 2);
  const prestigeReady = useGameStore((s) => canPrestige(s));

  // Auto-open the explainer on a player's very first visit.
  useEffect(() => {
    if (isFreshGame) setShowHelp(true);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phase = PHASE_META[Math.min(phaseUnlocked, 5)];
  const accent = accentFor(phase.accent);

  return (
    <div className="flex min-h-screen flex-col text-zinc-100">
      <header className="border-b border-amber-500/20 bg-zinc-950/50 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight text-amber-200 sm:text-2xl">
              🎭 The G-Force Thespians
            </h1>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${accent.chip}`}>
              {phase.act}: {phase.name}
            </span>
          </div>
          <button
            onClick={() => setShowHelp(true)}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-amber-500/60 hover:text-amber-300"
          >
            ? How to play
          </button>
        </div>
      </header>

      <CurrencyBar />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[19rem_minmax(0,1fr)_21rem]">
        {/* Left — The Stage */}
        <Stage />

        {/* Middle — tabbed workshop */}
        <div className="flex min-w-0 flex-col gap-3">
          <nav className="flex flex-wrap gap-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-1">
            {TABS.map((t) => {
              const showPrestigeDot = t.key === 'cut' && prestigeReady;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    tab === t.key
                      ? 'bg-amber-500/20 text-amber-200'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                  {showPrestigeDot && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            {tab === 'backstage' && <Backstage />}
            {tab === 'upgrades' && <UpgradesPanel />}
            {tab === 'automation' && <AutomationPanel />}
            {tab === 'cut' && <DirectorsCut />}
            {tab === 'achievements' && <AchievementsPanel />}
            {tab === 'stats' && <StatsPanel />}
            {tab === 'settings' && <SettingsPanel />}
          </div>
        </div>

        {/* Right — The Director's Notes */}
        <DirectorsNotes />
      </main>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <footer className="border-t border-zinc-800/60 px-4 py-3 text-center text-xs text-zinc-600">
        {prestiges > 0 && <span>{prestiges} Director's Cuts · </span>}
        React + Zustand + Tailwind · an absurd idle production in 5 acts
      </footer>

      <OfflineModal />
    </div>
  );
}
