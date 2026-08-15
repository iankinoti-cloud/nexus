import { motion } from 'motion/react';
import { Cpu, Users, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

const FEATURES = [
  {
    icon: Cpu,
    color: 'var(--accent)',
    title: 'AI that acts, not just advises',
    body: 'Core AI surfaces risks, drafts proposals, and rebalances workloads — one click executes the change.',
  },
  {
    icon: Users,
    color: '#A855F7',
    title: 'Full agency intelligence',
    body: 'Projects, talent burnout, client health, revenue, and studio bookings — all in one live workspace.',
  },
  {
    icon: TrendingUp,
    color: '#22C55E',
    title: 'From enquiry to invoice',
    body: 'RFP scanning, AI-generated briefs and proposals, and a pipeline that tracks every deal to close.',
  },
];

export function ExplorationStep1() {
  const { advanceStep } = useOnboarding();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 600, marginBottom: 6 }}>
          What NEXUS does
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.6 }}>
          An operating system for creative agencies — built around an AI that doesn't just surface data, it acts on it.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-xl p-3.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--hair)' }}
            >
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 34, height: 34, background: `${f.color}18`, border: `1px solid ${f.color}30` }}
              >
                <Icon size={15} style={{ color: f.color }} />
              </div>
              <div>
                <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500, marginBottom: 2 }}>
                  {f.title}
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.5 }}>
                  {f.body}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ opacity: 0.88 }}
        whileTap={{ scale: 0.97 }}
        onClick={advanceStep}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
        style={{
          background: 'rgba(var(--accent-rgb),0.14)',
          border: '1px solid rgba(var(--accent-rgb),0.35)',
          color: 'var(--accent)',
          fontSize: 'calc(14px * var(--fs))',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        See it in action <ArrowRight size={15} />
      </motion.button>
    </div>
  );
}

export function ExplorationStep2({ onClose }: { onClose: () => void }) {
  const { completeWizard } = useOnboarding();

  function enter() {
    completeWizard();
    onClose();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 600, marginBottom: 6 }}>
          Watch Core AI in action
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.6 }}>
          Below is a live insight from the demo workspace. Click Apply to see it mutate real data.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="rounded-xl p-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 28, height: 28, background: 'rgba(var(--accent-rgb),0.12)' }}
          >
            <Cpu size={13} style={{ color: 'var(--accent)' }} />
          </div>
          <span style={{ color: 'var(--text)', fontSize: 'calc(12px * var(--fs))', fontWeight: 600 }}>Core Intelligence</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-full shrink-0 mt-1" style={{ width: 7, height: 7, background: 'var(--accent)', marginTop: 6 }} />
          <div>
            <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500, marginBottom: 3 }}>
              Resource reallocation opportunity
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.5 }}>
              Nina Chen is past healthy utilization (95%). Shifting one workstream to Sam Rivera reduces burnout risk without timeline impact.
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-2 mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="rounded-full" style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #4FD1C5, #22C55E)', flexShrink: 0 }} />
          <div>
            <div style={{ color: 'var(--text)', fontSize: 11, fontWeight: 500 }}>Nina Chen → Sam Rivera</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>Workload: 95% → 80% · Burnout risk: High → Medium</div>
          </div>
        </div>
      </motion.div>

      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
        style={{ background: 'rgba(var(--accent-rgb),0.06)', border: '1px solid rgba(var(--accent-rgb),0.18)' }}
      >
        <Check size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>
          You can apply this action live inside the dashboard — it updates real workspace state.
        </span>
      </div>

      <motion.button
        whileHover={{ opacity: 0.88 }}
        whileTap={{ scale: 0.97 }}
        onClick={enter}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
        style={{
          background: 'var(--accent)',
          color: '#0B0B0F',
          fontSize: 'calc(14px * var(--fs))',
          fontWeight: 700,
          cursor: 'pointer',
          border: 'none',
          letterSpacing: '0.02em',
        }}
      >
        Enter NEXUS <ArrowRight size={15} />
      </motion.button>
    </div>
  );
}
