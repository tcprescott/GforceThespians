// Short-scale suffixes. Incremental games outgrow these fast, so once we run
// out we fall back to scientific notation.
const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc',
];

/**
 * Format a (possibly enormous) number for display.
 *  - below 1,000: integers stay clean, fractions show up to `decimals`
 *  - 1,000+: scaled with a short-scale suffix (1.23K, 4.56M, ...)
 *  - beyond the suffix table: scientific notation
 */
export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return value > 0 ? '∞' : value < 0 ? '-∞' : '0';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  if (abs < 1000) {
    return sign + (Number.isInteger(abs) ? abs.toString() : abs.toFixed(decimals));
  }

  const tier = Math.floor(Math.log10(abs) / 3);
  if (tier < SUFFIXES.length) {
    const scaled = abs / Math.pow(1000, tier);
    return `${sign}${scaled.toFixed(decimals)}${SUFFIXES[tier]}`;
  }

  return sign + abs.toExponential(decimals);
}

/** Integers only (e.g. owned counts, achievements). */
export function formatInt(value: number): string {
  if (!Number.isFinite(value)) return formatNumber(value);
  if (Math.abs(value) < 1e6) return Math.floor(value).toLocaleString();
  return formatNumber(value, 2);
}

/** Format a per-second rate, e.g. "12.00/s" (with sign for negatives). */
export function formatRate(value: number): string {
  const s = value >= 0 ? '+' : '';
  return `${s}${formatNumber(value)}/s`;
}

/** Human duration from seconds: "2d 4h", "3h 12m", "45s". */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '—';
  const s = Math.floor(totalSeconds);
  if (s < 60) return `${s}s`;
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m && !d) parts.push(`${m}m`);
  if (!d && !h && !m) parts.push(`${s}s`);
  return parts.slice(0, 2).join(' ');
}
