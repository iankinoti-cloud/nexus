import { motion } from 'motion/react';

interface HealthDotProps {
  score: number;
}

export function HealthDot({ score }: HealthDotProps) {
  const color = score >= 7 ? '#22C55E' : score >= 4 ? '#FFB547' : '#FF6B6B';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
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
