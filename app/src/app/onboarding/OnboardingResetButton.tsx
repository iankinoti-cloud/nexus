import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

export function OnboardingResetButton() {
  const { resetOnboarding } = useOnboarding();

  function handleReset() {
    resetOnboarding();
    window.location.reload();
  }

  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div>
        <div style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))' }}>Re-run onboarding</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', marginTop: 2 }}>
          Restart the welcome wizard and feature tour
        </div>
      </div>
      <motion.button
        whileHover={{ opacity: 0.85 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleReset}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
        style={{
          background: 'rgba(var(--accent-rgb),0.10)',
          border: '1px solid rgba(var(--accent-rgb),0.25)',
          color: 'var(--accent)',
          fontSize: 'calc(12px * var(--fs))',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        <RefreshCw size={12} /> Reset tour
      </motion.button>
    </div>
  );
}
