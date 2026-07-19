import { motion } from 'motion/react';

interface PageShellProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export function PageShell({ children, fullHeight }: PageShellProps) {
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: 'var(--bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className={fullHeight ? 'h-full flex flex-col' : 'p-8 max-w-[1200px] mx-auto'}
      >
        {children}
      </motion.div>
    </div>
  );
}
