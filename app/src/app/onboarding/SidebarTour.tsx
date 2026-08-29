import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useOnboarding } from './OnboardingProvider';

interface TourStep {
  path: string;
  navLabel: string;
  title: string;
  body: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    path: '/',
    navLabel: 'overview',
    title: 'Your command center',
    body: 'Live KPIs, Core AI signals, and one-click actions across your entire agency — all above the fold.',
  },
  {
    path: '/core',
    navLabel: 'core',
    title: 'Core AI',
    body: 'Your AI agent that acts, not just advises. Ask it anything about your team, clients, or projects — it executes changes.',
  },
  {
    path: '/projects',
    navLabel: 'projects',
    title: 'Every project, tracked',
    body: 'NEXUS surfaces capacity risks and overdue work before clients notice. Zero status meetings needed.',
  },
  {
    path: '/talent',
    navLabel: 'talent',
    title: 'Team intelligence',
    body: 'Real-time utilization, burnout risk scores, and capacity across your whole team — one view to manage all of it.',
  },
  {
    path: '/production',
    navLabel: 'production',
    title: 'Studio & production',
    body: 'Bookings, equipment scheduling, and shoot calendars — production ops without the spreadsheets.',
  },
  {
    path: '/pipeline',
    navLabel: 'pipeline',
    title: 'AI proposal engine',
    body: 'Drop a client brief. Get a scoped proposal and line-item quote in seconds — powered by three specialized agents.',
  },
  {
    path: '/clients',
    navLabel: 'clients',
    title: 'Relationship intelligence',
    body: 'Client health scores, deal history, and relationship signals — so you always know where you stand.',
  },
  {
    path: '/analytics',
    navLabel: 'analytics',
    title: 'Revenue & margins',
    body: 'Trend lines, project margins, and satisfaction scores. The numbers that actually drive agency decisions.',
  },
  {
    path: '/settings',
    navLabel: 'settings',
    title: 'Make NEXUS yours',
    body: 'Themes, integrations, team preferences. This is the last stop — your workspace is now fully explored.',
  },
];

const RING_PAD = 8;

interface BeaconRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function SidebarTour() {
  const { guidedTourStep, advanceGuidedTour, endGuidedTour } = useOnboarding();
  const navigate = useNavigate();
  const [rect, setRect] = useState<BeaconRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const step = guidedTourStep ?? 0;
  const current = TOUR_STEPS[step];
  const isActive = guidedTourStep !== null && current != null;

  // Navigate to the current step's page
  useEffect(() => {
    if (!isActive) return;
    navigate(current.path);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guidedTourStep, isActive]);

  // Measure the target nav element
  useEffect(() => {
    if (!isActive) {
      setRect(null);
      return;
    }

    function measure() {
      const el = document.querySelector<HTMLElement>(`[data-nav="${current.navLabel}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }

    setRect(null);
    rafRef.current = requestAnimationFrame(() => {
      setTimeout(measure, 120); // short delay so navigation settles
    });
    window.addEventListener('resize', measure);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', measure);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guidedTourStep, isActive]);

  if (!isActive || !rect) return null;

  const ring = {
    top: rect.top - RING_PAD,
    left: rect.left - RING_PAD,
    width: rect.width + RING_PAD * 2,
    height: rect.height + RING_PAD * 2,
  };

  // Position tooltip to the right of the nav ring, vertically centered
  const tipLeft = ring.left + ring.width + 18;
  const tipTop = Math.max(12, Math.min(
    ring.top + ring.height / 2 - 90,
    window.innerHeight - 230,
  ));

  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`tour-${step}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[9998] pointer-events-none"
      >
        {/* Dim overlay with cut-out around the nav item */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0,0,0,0.52)',
            maskImage: `radial-gradient(ellipse ${ring.width + 12}px ${ring.height + 12}px at ${ring.left + ring.width / 2}px ${ring.top + ring.height / 2}px, transparent 65%, black 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse ${ring.width + 12}px ${ring.height + 12}px at ${ring.left + ring.width / 2}px ${ring.top + ring.height / 2}px, transparent 65%, black 100%)`,
          }}
        />

        {/* Pulsing highlight ring */}
        {!reducedMotion && (
          <>
            <motion.div
              animate={{ scale: [1, 1.14, 1], opacity: [0.65, 0, 0.65] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-xl"
              style={{
                top: ring.top, left: ring.left, width: ring.width, height: ring.height,
                border: '2px solid var(--accent)',
                boxShadow: '0 0 20px rgba(var(--accent-rgb),0.5)',
              }}
            />
            <div
              className="absolute rounded-xl"
              style={{
                top: ring.top, left: ring.left, width: ring.width, height: ring.height,
                border: '1.5px solid rgba(var(--accent-rgb),0.55)',
              }}
            />
          </>
        )}
        {reducedMotion && (
          <div
            className="absolute rounded-xl"
            style={{
              top: ring.top, left: ring.left, width: ring.width, height: ring.height,
              border: '2px solid var(--accent)',
              boxShadow: '0 0 12px rgba(var(--accent-rgb),0.4)',
            }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute"
          style={{ top: tipTop, left: tipLeft, width: 272 }}
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(var(--accent-rgb),0.28)',
              boxShadow: '0 20px 56px -8px rgba(0,0,0,0.65), inset 0 1px 0 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Left arrow pointing to nav item */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: -7,
                width: 13,
                height: 13,
                background: 'var(--surface)',
                border: '1px solid rgba(var(--accent-rgb),0.28)',
                borderRight: 'none',
                borderBottom: 'none',
                transform: 'translateY(-50%) rotate(-45deg)',
              }}
            />

            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <div
                  style={{
                    color: 'var(--accent)',
                    fontSize: 'calc(10px * var(--fs))',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 3,
                  }}
                >
                  {step + 1} of {TOUR_STEPS.length}
                </div>
                <span style={{ color: 'var(--text)', fontSize: 'calc(13.5px * var(--fs))', fontWeight: 600 }}>
                  {current.title}
                </span>
              </div>
              <button
                onClick={endGuidedTour}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 2, flexShrink: 0 }}
              >
                <X size={13} />
              </button>
            </div>

            <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.58, marginBottom: 14 }}>
              {current.body}
            </p>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ opacity: 0.85 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => advanceGuidedTour(TOUR_STEPS.length)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2"
                style={{
                  background: isLast ? 'var(--accent)' : 'rgba(var(--accent-rgb),0.14)',
                  border: `1px solid rgba(var(--accent-rgb),${isLast ? '1' : '0.35'})`,
                  color: isLast ? '#FFFFFF' : 'var(--accent)',
                  fontSize: 'calc(12px * var(--fs))',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isLast ? 'Enter NEXUS' : 'Next'} <ArrowRight size={12} />
              </motion.button>
              {!isLast && (
                <button
                  onClick={endGuidedTour}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}
                >
                  Skip tour
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
