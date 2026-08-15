import { useEffect, useRef, useState } from 'react';

export function useChapterTimer(
  duration: number,
  paused: boolean,
  onComplete: () => void,
  restartKey: number,
): number {
  const [progress, setProgress] = useState(0);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const pausedRef = useRef(paused);
  const onCompleteRef = useRef(onComplete);

  pausedRef.current = paused;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    elapsedRef.current = 0;
    lastTickRef.current = null;
    setProgress(0);
    let rafId: number;

    const tick = (now: number) => {
      if (!pausedRef.current) {
        if (lastTickRef.current !== null) {
          elapsedRef.current += now - lastTickRef.current;
        }
        lastTickRef.current = now;
        const p = Math.min(elapsedRef.current / duration, 1);
        setProgress(p);
        if (p >= 1) {
          onCompleteRef.current();
          return;
        }
      } else {
        lastTickRef.current = null;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [duration, restartKey]);

  return progress;
}
