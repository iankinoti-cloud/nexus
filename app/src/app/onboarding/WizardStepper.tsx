import { motion } from 'motion/react';

interface WizardStepperProps {
  total: number;
  current: number;
}

export function WizardStepper({ total, current }: WizardStepperProps) {
  const progress = total > 1 ? ((current - 1) / (total - 1)) * 100 : 100;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="relative flex items-center justify-between w-full" style={{ maxWidth: total * 28 + (total - 1) * 12 }}>
        <div
          className="absolute"
          style={{ left: 0, right: 0, top: '50%', height: 2, background: 'var(--hair-2)', transform: 'translateY(-50%)' }}
        />
        <motion.div
          className="absolute"
          style={{ left: 0, top: '50%', height: 2, background: 'var(--accent)', transform: 'translateY(-50%)', transformOrigin: 'left' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {Array.from({ length: total }, (_, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;
          return (
            <div key={stepNum} className="relative z-10 flex items-center justify-center" style={{ width: 20, height: 20 }}>
              <motion.div
                animate={{
                  background: isDone || isActive ? 'var(--accent)' : 'var(--surface-2)',
                  borderColor: isDone || isActive ? 'var(--accent)' : 'var(--hair-2)',
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="rounded-full"
                style={{ width: 14, height: 14, border: '2px solid var(--hair-2)' }}
              />
              {isActive && (
                <motion.div
                  animate={{ opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute rounded-full"
                  style={{ width: 20, height: 20, background: 'var(--accent)', borderRadius: '50%' }}
                />
              )}
            </div>
          );
        })}
      </div>
      <span style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 500 }}>
        Step {current} of {total}
      </span>
    </div>
  );
}
