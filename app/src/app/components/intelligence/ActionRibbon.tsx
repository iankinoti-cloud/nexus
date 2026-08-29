import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Lightbulb, CheckCircle, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import type { Recommendation } from '../../lib/ai';
import type { CoreAction } from '../../data/store';

interface ActionRibbonProps {
  observe?: string;
  explain?: string;
  recommendations: Recommendation[];
  onApply?: (action: CoreAction) => void;
}

const STAGES = [
  { key: 'observe',   label: 'Observe',    icon: Eye },
  { key: 'explain',   label: 'Explain',    icon: Lightbulb },
  { key: 'recommend', label: 'Recommend',  icon: CheckCircle },
  { key: 'act',       label: 'Act',        icon: Zap },
] as const;

export function ActionRibbon({ observe, explain, recommendations, onApply }: ActionRibbonProps) {
  const [expanded, setExpanded] = useState(true);

  const activeStages = [
    observe ? 'observe' : null,
    explain ? 'explain' : null,
    recommendations.length > 0 ? 'recommend' : null,
    onApply && recommendations.length > 0 ? 'act' : null,
  ].filter(Boolean);

  if (recommendations.length === 0 && !observe && !explain) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(var(--accent-rgb),0.2)', background: 'rgba(var(--accent-rgb),0.04)' }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-2 flex-1">
          {STAGES.map(stage => {
            const isActive = activeStages.includes(stage.key);
            const Icon = stage.icon;
            return (
              <div
                key={stage.key}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: isActive ? 'rgba(var(--accent-rgb),0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(var(--accent-rgb),0.35)' : 'var(--hair)'}`,
                  opacity: isActive ? 1 : 0.35,
                }}
              >
                <Icon size={11} style={{ color: isActive ? 'var(--accent)' : 'var(--text-dim)' }} />
                <span
                  style={{
                    fontSize: 'calc(10px * var(--fs))',
                    color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                  }}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        ) : (
          <ChevronDown size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--hair)' }}>
              {observe && (
                <div className="pt-3">
                  <p style={{ fontSize: 'calc(10px * var(--fs))', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Observed
                  </p>
                  <p style={{ fontSize: 'calc(12px * var(--fs))', color: 'var(--text)', lineHeight: 1.5 }}>{observe}</p>
                </div>
              )}

              {explain && (
                <div>
                  <p style={{ fontSize: 'calc(10px * var(--fs))', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Why
                  </p>
                  <p style={{ fontSize: 'calc(12px * var(--fs))', color: 'var(--text)', lineHeight: 1.5 }}>{explain}</p>
                </div>
              )}

              {recommendations.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p style={{ fontSize: 'calc(10px * var(--fs))', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Recommended Actions
                  </p>
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg"
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--hair)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 'calc(12px * var(--fs))', color: 'var(--text)', fontWeight: 500 }}>
                          {rec.title}
                        </p>
                        <p style={{ fontSize: 'calc(11px * var(--fs))', color: 'var(--text-dim)', lineHeight: 1.4, marginTop: 2 }}>
                          {rec.description}
                        </p>
                      </div>
                      {onApply && rec.action && (
                        <button
                          onClick={() => onApply(rec.action)}
                          className="flex items-center gap-1.5 rounded-lg shrink-0"
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(var(--accent-rgb),0.15)',
                            border: '1px solid rgba(var(--accent-rgb),0.35)',
                            color: 'var(--accent)',
                            fontSize: 'calc(11px * var(--fs))',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          <Zap size={10} />
                          Apply
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
