import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, FileSearch } from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { EnquiriesPage } from './EnquiriesPage';
import { RfpScannerPage } from './RfpScannerPage';

const TABS = [
  { key: 'enquiries', label: 'Inbound', icon: TrendingUp },
  { key: 'rfp', label: 'Tenders (RFP)', icon: FileSearch },
] as const;

type TabKey = typeof TABS[number]['key'];

export function PipelinePage() {
  const [active, setActive] = useState<TabKey>('enquiries');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex items-center gap-1 px-5 pt-4 pb-0 shrink-0"
        style={{ borderBottom: '1px solid var(--hair)' }}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0 pb-3">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              color: 'var(--text)',
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            Growth Pipeline
          </h1>
        </div>
        <div className="flex gap-1 pb-3">
          {TABS.map(tab => {
            const isActive = active === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  background: isActive ? 'rgba(var(--accent-rgb),0.10)' : 'transparent',
                  border: isActive ? '1px solid rgba(var(--accent-rgb),0.25)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <Icon size={14} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="pipeline-tab-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(var(--accent-rgb),0.08)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {active === 'enquiries' ? <EnquiriesPage /> : <RfpScannerPage />}
      </div>
    </div>
  );
}
