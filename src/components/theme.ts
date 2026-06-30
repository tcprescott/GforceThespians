// Per-phase accent classes. Full literal strings so Tailwind's scanner keeps
// them in the build (dynamic `text-${x}` would be purged).
export interface Accent {
  text: string;
  border: string;
  bg: string;
  chip: string;
  fill: string;
  button: string;
}

export const ACCENTS: Record<string, Accent> = {
  amber: {
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    chip: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    fill: 'bg-amber-400',
    button: 'bg-amber-500 hover:bg-amber-400 text-amber-950',
  },
  orange: {
    text: 'text-orange-300',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    chip: 'bg-orange-500/15 text-orange-200 border-orange-500/30',
    fill: 'bg-orange-400',
    button: 'bg-orange-500 hover:bg-orange-400 text-orange-950',
  },
  cyan: {
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    chip: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30',
    fill: 'bg-cyan-400',
    button: 'bg-cyan-500 hover:bg-cyan-400 text-cyan-950',
  },
  indigo: {
    text: 'text-indigo-300',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    chip: 'bg-indigo-500/15 text-indigo-200 border-indigo-500/30',
    fill: 'bg-indigo-400',
    button: 'bg-indigo-500 hover:bg-indigo-400 text-indigo-950',
  },
  emerald: {
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    chip: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
    fill: 'bg-emerald-400',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950',
  },
  violet: {
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    chip: 'bg-violet-500/15 text-violet-200 border-violet-500/30',
    fill: 'bg-violet-400',
    button: 'bg-violet-500 hover:bg-violet-400 text-violet-950',
  },
};

export function accentFor(key: string): Accent {
  return ACCENTS[key] ?? ACCENTS.amber;
}
