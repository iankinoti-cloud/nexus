import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useOnboarding } from './OnboardingProvider';

export function GettingStartedPanel() {
  const { track, checklist, checklistDone } = useOnboarding();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (track !== 'setup') return null;

  const doneCount = checklist.filter(i => i.done).length;
  const allDone = doneCount === checklist.length;

  if (allDone) return null;

  const progress = (doneCount / checklist.length) * 100;

  function handleItem(id: string, href: string) {
    checklistDone(id);
    const [path, query] = href.split('?');
    navigate(path + (query ? `?${query}` : ''));
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
      >
        {/* Header */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-between px-5 py-4"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 32, height: 32, background: 'rgba(var(--accent-rgb),0.12)' }}
            >
              <Check size={15} style={{ color: 'var(--accent)' }} />
            </div>
            <div className="text-left">
              <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600 }}>
                Getting started
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
                {doneCount} of {checklist.length} complete
              </div>
            </div>
          </div>
          {collapsed ? <ChevronDown size={15} style={{ color: 'var(--text-dim)' }} /> : <ChevronUp size={15} style={{ color: 'var(--text-dim)' }} />}
        </button>

        {/* Progress bar */}
        <div style={{ height: 2, background: 'var(--hair)' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: 'var(--accent)' }}
          />
        </div>

        {/* Checklist */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="flex flex-col px-4 py-3 gap-1">
                {checklist.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    whileHover={item.done ? {} : { background: 'rgba(255,255,255,0.04)' }}
                    whileTap={item.done ? {} : { scale: 0.98 }}
                    onClick={() => !item.done && handleItem(item.id, item.href)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left w-full"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: item.done ? 'default' : 'pointer',
                      opacity: item.done ? 0.55 : 1,
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full shrink-0"
                      style={{
                        width: 22, height: 22,
                        background: item.done ? 'rgba(107,168,136,0.15)' : 'var(--surface-2)',
                        border: `1.5px solid ${item.done ? 'var(--status-success)' : 'var(--hair-2)'}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.done && <Check size={11} style={{ color: 'var(--status-success)' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: 'var(--text)', fontSize: 'calc(12px * var(--fs))', fontWeight: 500, textDecoration: item.done ? 'line-through' : 'none' }}>
                        {item.label}
                      </div>
                      <div style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
                        {item.description}
                      </div>
                    </div>
                    {!item.done && <ArrowRight size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
