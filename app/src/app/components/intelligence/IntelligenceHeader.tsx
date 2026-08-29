import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Zap, AlertCircle } from 'lucide-react';
import { useNexus } from '../../data/store';
import { fetchSignals } from '../../lib/ai';
import { SignalDrawer } from './SignalDrawer';
import type { AgencySignal } from '../../data/types';

function useAgencyPulse() {
  const { projects, employees, clients, rfpTenders, enquiries } = useNexus();

  const deliveryHealth = Math.round(
    projects.length === 0 ? 80 :
    (projects.filter(p => p.risk !== 'high' && p.status !== 'at-risk').length / projects.length) * 100
  );

  const talentHealth = Math.round(
    employees.length === 0 ? 75 :
    employees.reduce((sum, e) => sum + (100 - e.burnoutRisk), 0) / employees.length
  );

  const clientHealth = Math.round(
    clients.length === 0 ? 70 :
    clients.reduce((sum, c) => sum + c.healthScore, 0) / clients.length
  );

  const pipelineHealth = Math.round(
    rfpTenders.length === 0 ? 60 :
    Math.min(100, (rfpTenders.filter(t => t.fitScore >= 70).length / rfpTenders.length) * 100 +
    (enquiries.filter(e => ['proposed', 'quoted', 'approved'].includes(e.status)).length * 5))
  );

  const revenueHealth = Math.round(
    (deliveryHealth * 0.4 + clientHealth * 0.4 + pipelineHealth * 0.2)
  );

  const composite = Math.round(
    deliveryHealth * 0.3 +
    talentHealth * 0.25 +
    clientHealth * 0.25 +
    pipelineHealth * 0.1 +
    revenueHealth * 0.1
  );

  return { composite, deliveryHealth, talentHealth, clientHealth, pipelineHealth, revenueHealth };
}

function pulseColor(score: number) {
  if (score >= 75) return 'var(--signal-opportunity)';
  if (score >= 55) return 'var(--signal-attention)';
  return 'var(--signal-critical)';
}

export function IntelligenceHeader() {
  const { signals, setSignals, contextSnapshot } = useNexus();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pulse = useAgencyPulse();

  const criticalCount = signals.filter(s => s.tier === 'critical' && !s.acknowledgedAt).length;
  const activeCount = signals.filter(s => !s.acknowledgedAt).length;
  const color = pulseColor(pulse.composite);

  const refreshSignals = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const ctx = contextSnapshot();
      const fresh: AgencySignal[] = (await fetchSignals(ctx)).map((s, i) => ({
        ...s,
        id: `sig-${Date.now()}-${i}`,
        generatedAt: new Date().toISOString(),
      }));
      if (fresh.length > 0) setSignals(fresh);
    } finally {
      setLoading(false);
    }
  }, [loading, contextSnapshot, setSignals]);

  useEffect(() => {
    refreshSignals();
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setDrawerOpen(true)}
          title={`Agency Pulse: ${pulse.composite} — click for signals`}
          className="flex items-center gap-2 rounded-lg relative"
          style={{
            padding: '6px 10px',
            background: `${color}18`,
            border: `1px solid ${color}35`,
            cursor: 'pointer',
            minWidth: 0,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }}
          />
          <span style={{ color: 'var(--text)', fontSize: 'calc(12px * var(--fs))', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {pulse.composite}
          </span>

          {activeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center rounded-full"
              style={{
                width: 16, height: 16,
                background: criticalCount > 0 ? 'var(--signal-critical)' : 'var(--signal-attention)',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {activeCount > 9 ? '9+' : activeCount}
            </motion.span>
          )}

          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Zap size={10} style={{ color: 'var(--text-dim)' }} />
            </motion.div>
          )}
        </button>

        {criticalCount > 0 && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1 rounded-lg"
            style={{
              padding: '5px 8px',
              background: 'var(--signal-critical-bg)',
              border: '1px solid var(--signal-critical)40',
              color: 'var(--signal-critical)',
              cursor: 'pointer',
              fontSize: 'calc(11px * var(--fs))',
              fontWeight: 500,
            }}
          >
            <AlertCircle size={11} />
            {criticalCount} critical
          </button>
        )}
      </div>

      <SignalDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
