import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  onCta: () => void;
  demoHint?: string;
  onDemoHint?: () => void;
}

export function EmptyStateCard({ icon: Icon, title, description, ctaLabel, onCta, demoHint, onDemoHint }: EmptyStateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
    >
      <div
        className="flex items-center justify-center rounded-2xl mb-5"
        style={{
          width: 60, height: 60,
          background: 'rgba(var(--accent-rgb),0.10)',
          border: '1px solid rgba(var(--accent-rgb),0.25)',
          boxShadow: '0 0 40px rgba(var(--accent-rgb),0.12)',
        }}
      >
        <Icon size={24} style={{ color: 'var(--accent)' }} />
      </div>

      <h3 style={{ color: 'var(--text)', fontSize: 'calc(16px * var(--fs))', fontWeight: 600, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.6, maxWidth: 320, marginBottom: 20 }}>
        {description}
      </p>

      <motion.button
        whileHover={{ opacity: 0.88 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCta}
        className="rounded-xl px-5 py-2.5"
        style={{
          background: 'rgba(var(--accent-rgb),0.14)',
          border: '1px solid rgba(var(--accent-rgb),0.35)',
          color: 'var(--accent)',
          fontSize: 'calc(13px * var(--fs))',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {ctaLabel}
      </motion.button>

      {demoHint && (
        <button
          onClick={onDemoHint}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))', marginTop: 12 }}
        >
          {demoHint}
        </button>
      )}
    </motion.div>
  );
}
