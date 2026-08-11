import { motion } from 'motion/react';

interface HealthDotProps {
  score: number;
}

export function HealthDot({ score }: HealthDotProps) {
  const color = score >= 7 ? 'var(--status-success)' : score >= 4 ? 'var(--status-warning)' : 'var(--status-danger)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
      <motion.div
        animate={{ opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full"
        style={{ width: 14, height: 14, background: color }}
      />
      <div
        className="relative rounded-full"
        style={{ width: 8, height: 8, background: color }}
      />
    </div>
  );
}
