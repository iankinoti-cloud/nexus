import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

interface BeaconRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface SpotlightBeaconProps {
  targetSelector: string;
  title: string;
  body: string;
  actionLabel: string;
  onAction?: () => void;
}

const OFFSET = 16;
const RING_PAD = 8;

export function SpotlightBeacon({ targetSelector, title, body, actionLabel, onAction }: SpotlightBeaconProps) {
  const { dismissSpotlight, skipAllGuidance } = useOnboarding();
  const [rect, setRect] = useState<BeaconRect | null>(null);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    function measure() {
      const el = document.querySelector<HTMLElement>(targetSelector);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      setVisible(true);
    }

    measure();
    rafRef.current = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [targetSelector]);

  function handleAction() {
    onAction?.();
    dismissSpotlight();
  }

  if (!visible || !rect) return null;

  const ring = {
    top: rect.top - RING_PAD,
    left: rect.left - RING_PAD,
    width: rect.width + RING_PAD * 2,
    height: rect.height + RING_PAD * 2,
  };

  const tipTop = ring.top + ring.height + OFFSET;
  const tipLeft = Math.max(12, Math.min(rect.left, window.innerWidth - 300 - 12));

  return (
    <AnimatePresence>
      <motion.div
        key="beacon-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9998] pointer-events-none"
      >
        {/* Dim overlay with cut-out */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0,0,0,0.55)',
            maskImage: `radial-gradient(ellipse ${ring.width + 8}px ${ring.height + 8}px at ${ring.left + ring.width / 2}px ${ring.top + ring.height / 2}px, transparent 70%, black 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse ${ring.width + 8}px ${ring.height + 8}px at ${ring.left + ring.width / 2}px ${ring.top + ring.height / 2}px, transparent 70%, black 100%)`,
          }}
        />

        {/* Pulsing ring */}
        {!reducedMotion && (
          <>
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-2xl"
              style={{
                top: ring.top, left: ring.left, width: ring.width, height: ring.height,
                border: '2px solid var(--accent)',
                boxShadow: '0 0 18px rgba(var(--accent-rgb),0.45)',
              }}
            />
            <div
              className="absolute rounded-2xl"
              style={{
                top: ring.top, left: ring.left, width: ring.width, height: ring.height,
                border: '1.5px solid rgba(var(--accent-rgb),0.6)',
              }}
            />
          </>
        )}
        {reducedMotion && (
          <div
            className="absolute rounded-2xl"
            style={{
              top: ring.top, left: ring.left, width: ring.width, height: ring.height,
              border: '2px solid var(--accent)',
              boxShadow: '0 0 12px rgba(var(--accent-rgb),0.4)',
            }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute"
          style={{ top: tipTop, left: tipLeft, width: 280 }}
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(var(--accent-rgb),0.25)',
              boxShadow: '0 16px 48px -8px rgba(0,0,0,0.6), inset 0 1px 0 0 var(--glass-rim)',
            }}
          >
            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                top: -7,
                left: 20,
                width: 14,
                height: 14,
                background: 'var(--surface)',
                border: '1px solid rgba(var(--accent-rgb),0.25)',
                borderRight: 'none',
                borderBottom: 'none',
                transform: 'rotate(45deg)',
              }}
            />
            <div className="flex items-start justify-between gap-2 mb-2">
              <span style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600 }}>
                {title}
              </span>
              <button
                onClick={dismissSpotlight}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 2, flexShrink: 0 }}
              >
                <X size={13} />
              </button>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.55, marginBottom: 12 }}>
              {body}
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ opacity: 0.85 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAction}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2"
                style={{
                  background: 'rgba(var(--accent-rgb),0.14)',
                  border: '1px solid rgba(var(--accent-rgb),0.35)',
                  color: 'var(--accent)',
                  fontSize: 'calc(12px * var(--fs))',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {actionLabel} <ArrowRight size={12} />
              </motion.button>
              <button
                onClick={skipAllGuidance}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}
              >
                Skip all
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
