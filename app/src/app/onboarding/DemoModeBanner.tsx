import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { X, RotateCcw } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';
import { useNexus } from '../data/store';

export function DemoModeBanner() {
  const { track } = useOnboarding();
  const { resetDemo } = useNexus();
  const [dismissed, setDismissed] = useState(false);

  // Only show for exploration track or unstarted visitors
  if (track === 'setup' || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 36, opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between px-4 shrink-0 overflow-hidden"
        style={{
          background: 'rgba(var(--accent-rgb),0.08)',
          borderBottom: '1px solid rgba(var(--accent-rgb),0.18)',
        }}
      >
        <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
          You're exploring{' '}
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>Apex Studio</span>
          {' '}— a curated demo workspace.
        </span>
        <div className="flex items-center gap-2">
          <Link
            to="/story"
            style={{
              color: 'var(--accent)',
              fontSize: 'calc(11px * var(--fs))',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            See our story →
          </Link>
          <span style={{ color: 'var(--hair-2)', fontSize: 10 }}>·</span>
          <button
            onClick={() => { resetDemo(); }}
            className="flex items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}
          >
            <RotateCcw size={11} /> Reset
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 2 }}
          >
            <X size={13} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
