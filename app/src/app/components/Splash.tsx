import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import nexusEmblem from '../../imports/NEXUS-_-EMBLEM.jpeg';

const SIZE = 168;
const HALF = SIZE / 2;
const WORD = ['N', 'E', 'X', 'U', 'S'];

// Timeline (ms) — assemble ~1s, hold ~3s, disperse ~1.8s → total ~5.8s
const T_DISPERSE = 4200;
const T_DONE = 5800;

const QUADRANTS = [
  { key: 'tl', left: 0, top: 0, bgX: 0, bgY: 0, fromX: -150, fromY: -150, spin: -35 },
  { key: 'tr', left: HALF, top: 0, bgX: -HALF, bgY: 0, fromX: 150, fromY: -150, spin: 35 },
  { key: 'bl', left: 0, top: HALF, bgX: 0, bgY: -HALF, fromX: -150, fromY: 150, spin: 35 },
  { key: 'br', left: HALF, top: HALF, bgX: -HALF, bgY: -HALF, fromX: 150, fromY: 150, spin: -35 },
];

// Underdamped "spring-water" settle — overshoots slightly then finds its level.
const LIQUID = { type: 'spring' as const, stiffness: 90, damping: 12, mass: 1.1 };

export function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [gone, setGone] = useState(false);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    setGone(true);
    setTimeout(onDone, 200);
  };

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(finish, 1400);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setPhase('out'), T_DISPERSE);
    const t2 = setTimeout(finish, T_DONE);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const out = phase === 'out';

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          onClick={finish}
          initial={{ opacity: 1 }}
          animate={{ opacity: out ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: out ? 0.35 : 0, ease: 'easeInOut' }}
          className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
          style={{ zIndex: 100, background: '#000000' }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(600px circle at 50% 45%, rgba(var(--accent-rgb),0.10), transparent 60%)',
            }}
          />

          {/* Emblem — gentle liquid breathing while it holds */}
          <motion.div
            className="relative"
            style={{ width: SIZE, height: SIZE, marginBottom: 34 }}
            animate={reduce || out ? {} : { scale: [1, 1.03, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            {/* bloom at the moment of union */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: '50%', top: '50%', width: 200, height: 200, x: '-50%', y: '-50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(var(--accent-rgb),0.5) 30%, transparent 62%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={reduce ? { opacity: 0 } : { scale: [0, 0.6, 2.4], opacity: [0, 0.85, 0] }}
              transition={{ duration: 1.1, delay: 0.55, ease: 'easeOut' }}
            />

            {QUADRANTS.map((q, i) => (
              <motion.div
                key={q.key}
                className="absolute"
                style={{
                  left: q.left, top: q.top, width: HALF, height: HALF,
                  backgroundImage: `url(${nexusEmblem})`,
                  backgroundSize: `${SIZE}px ${SIZE}px`,
                  backgroundPosition: `${q.bgX}px ${q.bgY}px`,
                  backgroundRepeat: 'no-repeat',
                  mixBlendMode: 'screen',
                }}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { x: q.fromX, y: q.fromY, rotate: q.spin, opacity: 0, filter: 'blur(4px)' }
                }
                animate={
                  reduce
                    ? { opacity: 1 }
                    : out
                    ? { x: q.fromX * 1.5, y: q.fromY * 1.5, rotate: -q.spin, opacity: 0, filter: 'blur(3px)' }
                    : { x: 0, y: 0, rotate: 0, opacity: 1, filter: 'blur(0px)' }
                }
                transition={
                  reduce
                    ? { duration: 0.5 }
                    : out
                    ? { duration: 0.65, ease: [0.55, 0, 1, 0.45], delay: i * 0.04 }
                    : { ...LIQUID, delay: 0.1 + i * 0.06 }
                }
              />
            ))}
          </motion.div>

          {/* NEXUS — letter by letter, then retracts on reverse */}
          <div className="flex items-center" style={{ gap: '0.14em' }}>
            {WORD.map((ch, i) => (
              <motion.span
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : out
                    ? { opacity: 0, y: -8, filter: 'blur(4px)' }
                    : { opacity: 1, y: 0, filter: 'blur(0px)' }
                }
                transition={{
                  duration: out ? 0.3 : 0.5,
                  delay: out ? i * 0.03 : (reduce ? 0.4 : 1.1) + i * 0.11,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  color: '#F4F4F5',
                  fontSize: 'clamp(30px, 8vw, 50px)',
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  textShadow: '0 0 24px rgba(var(--accent-rgb),0.35)',
                }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: out ? 0 : 0.55 }}
            transition={{ duration: out ? 0.25 : 0.6, delay: out ? 0 : (reduce ? 0.7 : 1.9) }}
            style={{ color: '#A1A1AA', fontSize: 'clamp(11px, 2.6vw, 13px)', letterSpacing: '0.08em', marginTop: 14 }}
          >
            The Operating System for Creative Enterprises
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
