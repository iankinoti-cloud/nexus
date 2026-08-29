import { motion } from 'motion/react';
import { PageAura, type AuraConfig } from '../shared/PageAura';

interface PageShellProps {
  children: React.ReactNode;
  fullHeight?: boolean;
  aura?: AuraConfig | AuraConfig[];
}

export function PageShell({ children, fullHeight, aura }: PageShellProps) {
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: 'var(--bg)', position: 'relative' }}
    >
      {aura && (Array.isArray(aura)
        ? aura.map((a, i) => <PageAura key={i} {...a} />)
        : <PageAura {...aura} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className={fullHeight ? 'h-full flex flex-col' : 'p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto'}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
