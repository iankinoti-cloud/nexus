import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

const INDUSTRIES = [
  'Branding & Identity', 'Motion & Film', 'Digital & UX', 'Advertising',
  'Events & Experiential', 'Architecture & Interior', 'Publishing & Editorial', 'Other',
];

const TEAM_SIZES = [
  { id: '1-5',   label: '1–5',   sub: 'Solo / micro' },
  { id: '6-15',  label: '6–15',  sub: 'Small studio' },
  { id: '16-40', label: '16–40', sub: 'Mid-size agency' },
  { id: '40+',   label: '40+',   sub: 'Large / multi-office' },
];

const USE_CASES = [
  { id: 'enquiries',  label: 'Enquiry pipeline',   color: 'var(--accent)' },
  { id: 'talent',     label: 'Talent & burnout',   color: '#A855F7' },
  { id: 'production', label: 'Studio & production', color: '#F59E0B' },
  { id: 'rfp',        label: 'RFP scanning',        color: 'var(--status-success)' },
  { id: 'analytics',  label: 'Revenue analytics',  color: '#6E8FA8' },
];

const INTEGRATIONS = [
  { name: 'Slack',   color: '#E01E5A', description: 'Team alerts & notifications' },
  { name: 'Figma',   color: '#F24E1E', description: 'Design file references' },
  { name: 'Stripe',  color: '#635BFF', description: 'Invoice & payment tracking' },
  { name: 'Notion',  color: '#FFFFFF', description: 'Docs & knowledge base' },
  { name: 'Google',  color: '#4285F4', description: 'Calendar & Drive' },
  { name: 'Jira',    color: '#0052CC', description: 'Sprint & task tracking' },
];

function inputStyle() {
  return {
    width: '100%',
    background: 'var(--surface-2)',
    border: '1px solid var(--hair-2)',
    color: 'var(--text)',
    fontSize: 'calc(14px * var(--fs))',
    borderRadius: 10,
    padding: '10px 14px',
    outline: 'none',
    fontFamily: 'inherit',
  } as React.CSSProperties;
}

function NextBtn({ onClick, label = 'Continue' }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      whileHover={{ opacity: 0.88 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-xl py-3 mt-2"
      style={{
        background: 'rgba(var(--accent-rgb),0.14)',
        border: '1px solid rgba(var(--accent-rgb),0.35)',
        color: 'var(--accent)',
        fontSize: 'calc(14px * var(--fs))',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label} <ArrowRight size={15} />
    </motion.button>
  );
}

export function SetupStep1() {
  const { workspaceName, industry, updateSetupField, advanceStep } = useOnboarding();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 600, marginBottom: 6 }}>
          Tell us about your agency
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
          This replaces the demo data with your workspace identity.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Agency name
          </label>
          <input
            type="text"
            value={workspaceName}
            onChange={e => updateSetupField('workspaceName', e.target.value)}
            placeholder="e.g. Apex Studio"
            style={inputStyle()}
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Primary discipline
          </label>
          <select
            value={industry}
            onChange={e => updateSetupField('industry', e.target.value)}
            style={{ ...inputStyle(), appearance: 'none', cursor: 'pointer' }}
          >
            <option value="">Select an industry…</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <NextBtn onClick={advanceStep} />
    </div>
  );
}

export function SetupStep2() {
  const { teamSize, updateSetupField, advanceStep } = useOnboarding();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 600, marginBottom: 6 }}>
          How big is your team?
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
          Helps NEXUS calibrate capacity defaults and burnout thresholds.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TEAM_SIZES.map(t => {
          const active = teamSize === t.id;
          return (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => updateSetupField('teamSize', t.id)}
              className="flex flex-col items-center justify-center rounded-xl py-5 gap-1"
              style={{
                background: active ? 'rgba(var(--accent-rgb),0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(var(--accent-rgb),0.45)' : 'var(--hair)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: active ? 'var(--accent)' : 'var(--text)', fontSize: 'calc(22px * var(--fs))', fontWeight: 700 }}>
                {t.label}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{t.sub}</span>
            </motion.button>
          );
        })}
      </div>

      <NextBtn onClick={advanceStep} />
    </div>
  );
}

export function SetupStep3() {
  const { useCases, toggleUseCase, advanceStep } = useOnboarding();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 600, marginBottom: 6 }}>
          What matters most?
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
          Select the areas you want Core AI to prioritise for you. Pick as many as you like.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {USE_CASES.map((uc, i) => {
          const active = useCases.includes(uc.id);
          return (
            <motion.button
              key={uc.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleUseCase(uc.id)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left"
              style={{
                background: active ? `${uc.color}12` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${active ? `${uc.color}40` : 'var(--hair)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                className="rounded-full shrink-0"
                style={{
                  width: 14, height: 14,
                  background: active ? uc.color : 'transparent',
                  border: `2px solid ${active ? uc.color : 'var(--hair-2)'}`,
                  transition: 'all 0.15s ease',
                }}
              />
              <span style={{ color: active ? 'var(--text)' : 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', fontWeight: active ? 500 : 400 }}>
                {uc.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <NextBtn onClick={advanceStep} />
    </div>
  );
}

export function SetupStep4({ onClose }: { onClose: () => void }) {
  const { completeWizard } = useOnboarding();

  function finish() {
    completeWizard();
    onClose();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 600, marginBottom: 6 }}>
          Connect your tools
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
          Optional — you can do this later in Settings → Integrations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {INTEGRATIONS.map((intg, i) => (
          <motion.div
            key={intg.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: i * 0.05 }}
            className="flex items-center gap-2.5 rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--hair)' }}
          >
            <div
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{ width: 30, height: 30, background: `${intg.color}18`, border: `1px solid ${intg.color}25` }}
            >
              <span style={{ color: intg.color, fontSize: 'calc(12px * var(--fs))', fontWeight: 700 }}>{intg.name[0]}</span>
            </div>
            <div>
              <div style={{ color: 'var(--text)', fontSize: 'calc(12px * var(--fs))', fontWeight: 500 }}>{intg.name}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>{intg.description}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ opacity: 0.88 }}
        whileTap={{ scale: 0.97 }}
        onClick={finish}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
        style={{
          background: 'var(--accent)',
          color: '#F5F0E8',
          fontSize: 'calc(14px * var(--fs))',
          fontWeight: 700,
          cursor: 'pointer',
          border: 'none',
          letterSpacing: '0.02em',
        }}
      >
        Launch my workspace <ArrowRight size={15} />
      </motion.button>

      <button
        onClick={finish}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}
      >
        Skip — connect later
      </button>
    </div>
  );
}
