import { useState } from 'react';
import { useGameStore } from '../game/store';
import { OFFLINE_CAP_SECONDS, OFFLINE_EFFICIENCY } from '../game/balance';
import { formatDuration } from '../lib/format';

export function SettingsPanel() {
  const exportSave = useGameStore((s) => s.exportSave);
  const importSave = useGameStore((s) => s.importSave);
  const hardReset = useGameStore((s) => s.hardReset);

  const [exported, setExported] = useState('');
  const [importText, setImportText] = useState('');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const doExport = async () => {
    const code = exportSave();
    setExported(code);
    try {
      await navigator.clipboard.writeText(code);
      setMsg({ kind: 'ok', text: 'Save code copied to clipboard.' });
    } catch {
      setMsg({ kind: 'ok', text: 'Save code generated below — copy it manually.' });
    }
  };

  const doImport = () => {
    if (!importText.trim()) return;
    const ok = importSave(importText);
    setMsg(
      ok
        ? { kind: 'ok', text: 'Save imported! The show resumes.' }
        : { kind: 'err', text: 'That save code could not be read.' },
    );
    if (ok) setImportText('');
  };

  const doReset = () => {
    if (
      window.confirm(
        'Strike the entire set? This permanently wipes ALL progress — Legacy, talents, artifacts, achievements, everything. No undo.',
      )
    ) {
      hardReset();
      setMsg({ kind: 'ok', text: 'Everything reset. Curtain up, from the very top.' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-400">
        Progress saves automatically to this browser. Offline earnings are credited at{' '}
        {Math.round(OFFLINE_EFFICIENCY * 100)}% of the live rate, banked up to{' '}
        {formatDuration(OFFLINE_CAP_SECONDS)}.
      </p>

      {msg && (
        <div
          className={`rounded-lg border px-3 py-2 text-sm ${
            msg.kind === 'ok'
              ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-200'
              : 'border-rose-500/40 bg-rose-500/5 text-rose-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      <section className="rounded-xl border border-zinc-700/60 bg-zinc-900/50 p-4">
        <h3 className="font-bold text-zinc-100">📤 Export save</h3>
        <p className="text-xs text-zinc-400">Copy a portable save code to back up or move browsers.</p>
        <button
          onClick={doExport}
          className="mt-2 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-bold text-amber-950 hover:bg-amber-400"
        >
          Generate &amp; copy
        </button>
        {exported && (
          <textarea
            readOnly
            value={exported}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 h-20 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950/60 p-2 font-mono text-[10px] text-zinc-400"
          />
        )}
      </section>

      <section className="rounded-xl border border-zinc-700/60 bg-zinc-900/50 p-4">
        <h3 className="font-bold text-zinc-100">📥 Import save</h3>
        <p className="text-xs text-zinc-400">Paste a save code to restore it. This replaces your current game.</p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste save code…"
          className="mt-2 h-20 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950/60 p-2 font-mono text-[10px] text-zinc-300"
        />
        <button
          onClick={doImport}
          disabled={!importText.trim()}
          className="mt-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-bold text-emerald-950 enabled:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700/60 disabled:text-zinc-500"
        >
          Import
        </button>
      </section>

      <section className="rounded-xl border border-rose-500/30 bg-rose-500/[0.03] p-4">
        <h3 className="font-bold text-rose-200">🔥 Danger zone</h3>
        <p className="text-xs text-zinc-400">Wipe everything and start a fresh production.</p>
        <button
          onClick={doReset}
          className="mt-2 rounded-lg border border-rose-500/50 px-3 py-1.5 text-sm font-bold text-rose-300 hover:bg-rose-500/10"
        >
          Strike the Set (full reset)
        </button>
      </section>
    </div>
  );
}
