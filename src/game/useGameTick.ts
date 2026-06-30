import { useEffect, useRef } from 'react';
import { useGameStore } from './store';
import { MAX_TICK_DELTA_SECONDS, TICK_MS } from './balance';

/**
 * The game heartbeat — 10 ticks/sec. Mount exactly once (in <App />). Uses real
 * elapsed time so generation stays accurate even when the timer drifts, and
 * clamps the delta so a backgrounded tab can't dump a giant catch-up tick
 * (real offline progress is handled separately on load).
 */
export function useGameTick(): void {
  const tick = useGameStore((s) => s.tick);
  const lastRef = useRef(0);

  useEffect(() => {
    lastRef.current = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now();
      let dt = (t - lastRef.current) / 1000;
      lastRef.current = t;
      if (dt > MAX_TICK_DELTA_SECONDS) dt = MAX_TICK_DELTA_SECONDS;
      if (dt > 0) tick(dt);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [tick]);
}
