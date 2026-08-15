import { motion } from 'motion/react';

interface ChapterProgressProps {
  total: number;
  current: number;
  progress: number;
  onNavigate: (i: number) => void;
  isDark: boolean;
}

export function ChapterProgress({ total, current, progress, onNavigate, isDark }: ChapterProgressProps) {
  const outlineColor = isDark ? 'rgba(245,240,232,0.22)' : 'rgba(45,38,32,0.18)';

  return (
    <>
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: 2, zIndex: 100,
          background: isDark ? 'rgba(224,122,82,0.15)' : 'rgba(196,96,46,0.12)',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: '#E07A52',
            transformOrigin: 'left',
            scaleX: progress,
          }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 26,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          zIndex: 100,
          alignItems: 'center',
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <motion.button
            key={i}
            onClick={() => onNavigate(i)}
            animate={{
              width: i === current ? 24 : 8,
              backgroundColor: i <= current ? '#E07A52' : 'transparent',
              borderColor: i <= current ? '#E07A52' : outlineColor,
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 8,
              borderRadius: 4,
              border: '1.5px solid',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
              outline: 'none',
            }}
          />
        ))}
      </div>
    </>
  );
}
