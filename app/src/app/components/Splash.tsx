import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import nexusEmblem from '../../imports/NEXUS-_-EMBLEM.jpeg';

const SIZE = 168;               // final emblem size
const HALF = SIZE / 2;
const WORD = ['N', 'E', 'X', 'U', 'S'];
const DURATION = 3000;

// Each quadrant: where it sits when assembled, which corner it flies in from,
// and the background offset that makes it show the correct quarter of the mark.
const QUADRANTS = [
  { key: 'tl', left: 0, top: 0, bgX: 0, bgY: 0, fromX: -150, fromY: -150, spin: -35 },
  { key: 'tr', left: HALF, top: 0, bgX: -HALF, bgY: 0, fromX: 150, fromY: -150, spin: 35 },
  { key: 'bl', left: 0, top: HALF, bgX: 0, bgY: -HALF, fromX: -150, fromY: 150, spin: 35 },
  { key: 'br', left: HALF, top: HALF, bgX: -HALF, bgY: -HALF, fromX: 150, fromY: 150, spin: -35 },
];

export function Splash({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    setGone(true);
    setTimeout(onDone, 450); // let the exit fade play
  };

  useEffect(() => {
    const t = setTimeout(finish, reduce ? 1400 : DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          onClick={finish}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
          style={{ zIndex: 100, background: '#000000' }}
        >
          {/* Ambient accent wash */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(600px circle at 50% 45%, rgba(var(--accent-rgb),0.10), transparent 60%)',
            }}
          />

          {/* Emblem assembling from the four compass corners */}
          <div className="relative" style={{ width: SIZE, height: SIZE, marginBottom: 34 }}>
            {/* bloom at the moment of union */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: '50%', top: '50%', width: 200, height: 200,
                x: '-50%', y: '-50%',
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
                  left: q.left,
                  top: q.top,
                  width: HALF,
                  height: HALF,
                  backgroundImage: `url(${nexusEmblem})`,
                  backgroundSize: `${SIZE}px ${SIZE}px`,
                  backgroundPosition: `${q.bgX}px ${q.bgY}px`,
                  backgroundRepeat: 'no-repeat',
                  mixBlendMode: 'screen', // drops the emblem's black tile — only the white mark shows
                }}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { x: q.fromX, y: q.fromY, rotate: q.spin, opacity: 0, filter: 'blur(4px)' }
                }
                animate={
                  reduce
                    ? { opacity: 1 }
                    : { x: 0, y: 0, rotate: 0, opacity: 1, filter: 'blur(0px)' }
                }
                transition={
                  reduce
                    ? { duration: 0.5 }
                    : { type: 'spring', stiffness: 120, damping: 15, mass: 0.9, delay: 0.1 + i * 0.06 }
                }
              />
            ))}

            {/* light streaks trailing the incoming slices */}
            {!reduce &&
              QUADRANTS.map((q, i) => (
                <motion.div
                  key={`streak-${q.key}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: 2,
                    height: 220,
                    transformOrigin: 'center top',
                    background:
                      'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
                    rotate: `${Math.atan2(q.fromY, q.fromX) * (180 / Math.PI) - 90}deg`,
                  }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 0.5, 0], scaleY: [0.2, 1, 0] }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                />
              ))}
          </div>

          {/* NEXUS — letter by letter */}
          <div className="flex items-center" style={{ gap: '0.14em' }}>
            {WORD.map((ch, i) => (
              <motion.span
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.5,
                  delay: (reduce ? 0.4 : 1.15) + i * 0.11,
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

          {/* tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.6, delay: reduce ? 0.7 : 1.95 }}
            style={{ color: '#A1A1AA', fontSize: 'clamp(11px, 2.6vw, 13px)', letterSpacing: '0.08em', marginTop: 14 }}
          >
            The Operating System for Creative Enterprises
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
