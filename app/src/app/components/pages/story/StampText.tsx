import { motion } from 'motion/react';
import type { CSSProperties } from 'react';

interface StampTextProps {
  text: string;
  style?: CSSProperties;
  delay?: number;
  className?: string;
}

export function StampText({ text, style, delay = 0, className }: StampTextProps) {
  const words = text.split(' ');

  return (
    <div className={className} style={{ display: 'block', ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, scale: 0.82 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 370,
            damping: 25,
            delay: delay + i * 0.14,
          }}
          style={{ display: 'inline-block', marginRight: '0.22em' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
