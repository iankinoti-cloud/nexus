import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useNexus } from '../../data/store';
import type { AgencySignal, SignalTier } from '../../data/types';
import { useNavigate } from 'react-router';

interface SignalDrawerProps {
  open: boolean;
  onClose: () => void;
}

const TIER_META: Record<SignalTier, { label: string; color: string; bg: string; Icon: typeof AlertCircle }> = {
  critical:    { label: 'Critical',    color: 'var(--signal-critical)',    bg: 'var(--signal-critical-bg)',    Icon: AlertCircle },
  attention:   { label: 'Attention',   color: 'var(--signal-attention)',   bg: 'var(--signal-attention-bg)',   Icon: Clock },
  opportunity: { label: 'Opportunity', color: 'var(--signal-opportunity)', bg: 'var(--signal-opportunity-bg)', Icon: Sparkles },
};

const MODULE_PATHS: Record<string, string> = {
  projects: '/projects',
  talent: '/talent',
  clients: '/clients',
  pipeline: '/pipeline',
  production: '/production',
  analytics: '/analytics',
};

function SignalCard({ signal, onClose }: { signal: AgencySignal; onClose: () => void }) {
  const { acknowledgeSignal } = useNexus();
  const navigate = useNavigate();
  const meta = TIER_META[signal.tier];
  const Icon = meta.Icon;
  const isAck = Boolean(signal.acknowledgedAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isAck ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}
    >
      <div className="flex items-start gap-2">
        <Icon size={14} style={{ color: meta.color, marginTop: 2, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500, lineHeight: 1.3 }}>
            {signal.title}
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.4, marginTop: 2 }}>
            {signal.body}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isAck && (
          <button
            onClick={() => acknowledgeSignal(signal.id)}
            style={{
              fontSize: 'calc(11px * var(--fs))',
              color: 'var(--text-dim)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            Dismiss
          </button>
        )}
        {signal.module && (
          <button
            onClick={() => {
              navigate(MODULE_PATHS[signal.module] ?? '/');
              onClose();
            }}
            className="flex items-center gap-1"
            style={{
              fontSize: 'calc(11px * var(--fs))',
              color: meta.color,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            View <ArrowRight size={10} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function SignalDrawer({ open, onClose }: SignalDrawerProps) {
  const { signals } = useNexus();

  const grouped = (['critical', 'attention', 'opportunity'] as SignalTier[]).map(tier => ({
    tier,
    items: signals.filter(s => s.tier === tier),
  })).filter(g => g.items.length > 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.35)' }}
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            initial={{ x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{
              width: 'clamp(300px, 92vw, 380px)',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--hair)',
              boxShadow: '-16px 0 48px rgba(0,0,0,0.35)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--hair)' }}
            >
              <div>
                <h2 style={{ color: 'var(--text)', fontWeight: 600, fontSize: 'calc(14px * var(--fs))' }}>
                  Agency Signals
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))', marginTop: 2 }}>
                  {signals.filter(s => !s.acknowledgedAt).length} active
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 32, height: 32,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--hair)',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
              {grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-12">
                  <Sparkles size={28} style={{ color: 'var(--signal-opportunity)', opacity: 0.6 }} />
                  <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
                    All clear — no active signals.
                  </p>
                </div>
              ) : (
                grouped.map(group => {
                  const meta = TIER_META[group.tier];
                  return (
                    <div key={group.tier} className="flex flex-col gap-2">
                      <p
                        style={{
                          fontSize: 'var(--fs-nav-label)',
                          color: meta.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 600,
                        }}
                      >
                        {meta.label}
                      </p>
                      <AnimatePresence>
                        {group.items.map(signal => (
                          <SignalCard key={signal.id} signal={signal} onClose={onClose} />
                        ))}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
