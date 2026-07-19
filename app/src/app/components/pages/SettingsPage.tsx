import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Building2, Puzzle, Shield, Cpu, Palette, Camera, ChevronRight, Database, RotateCcw, Cloud, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import { PageShell } from '../layout/PageShell';
import { useNexus } from '../../data/store';
import {
  ACCENTS, applyAccent, currentAccent,
  applyColorMode, currentMode, applyFontScale, currentScale,
  type Accent, type ColorMode, type FontScale,
} from '../../lib/theme';
import { useAuth } from '../../auth/AuthProvider';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'workspace', label: 'Workspace Data', icon: Database },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'ai', label: 'AI Preferences', icon: Cpu },
  { id: 'theme', label: 'Theme', icon: Palette },
];

function FormField({ label, type = 'text', value, placeholder }: {
  label: string; type?: string; value: string; placeholder?: string;
}) {
  const [val, setVal] = useState(value);
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg px-3 py-2.5 w-full"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--hair-2)',
          color: 'var(--text)',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

function Toggle({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ color: 'var(--text)', fontSize: 14 }}>{label}</div>
        {description && <div style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 2 }}>{description}</div>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className="relative shrink-0 rounded-full"
        style={{
          width: 44,
          height: 24,
          background: on ? '#22C55E' : 'rgba(255,255,255,0.14)',
          border: `1px solid ${on ? 'rgba(34,197,94,0.6)' : 'var(--hair-2)'}`,
          cursor: 'pointer',
          transition: 'background 0.2s ease, border-color 0.2s ease',
          marginTop: 2,
          boxShadow: on ? '0 0 12px -2px rgba(34,197,94,0.6)' : 'none',
        }}
      >
        <motion.div
          animate={{ x: on ? 21 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 rounded-full"
          style={{ width: 16, height: 16, background: 'var(--text)', left: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
        />
      </button>
    </div>
  );
}

function IntegrationItem({ name, description, connected, color }: {
  name: string; description: string; connected: boolean; color: string;
}) {
  const [isConnected, setIsConnected] = useState(connected);
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--hair)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 36, height: 36, background: color + '20', border: `1px solid ${color}30` }}
        >
          <span style={{ color, fontSize: 14, fontWeight: 700 }}>{name[0]}</span>
        </div>
        <div>
          <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>{name}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>{description}</div>
        </div>
      </div>
      <button
        onClick={() => setIsConnected(!isConnected)}
        style={{
          background: isConnected ? 'rgba(34,197,94,0.1)' : 'rgba(var(--accent-rgb),0.1)',
          border: `1px solid ${isConnected ? 'rgba(34,197,94,0.3)' : 'rgba(var(--accent-rgb),0.3)'}`,
          color: isConnected ? '#22C55E' : 'var(--accent)',
          fontSize: 12,
          fontWeight: 500,
          borderRadius: 8,
          padding: '6px 14px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {isConnected ? '✓ Connected' : 'Connect'}
      </button>
    </div>
  );
}

function ProfileTab() {
  const { session, displayName, avatarUrl } = useAuth();
  const email = session?.user?.email ?? 'sarah@apexstudio.co';
  const initials = displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Profile</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Manage your personal information and preferences.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="rounded-xl object-cover"
              style={{ width: 72, height: 72 }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--accent), #22C55E)', fontSize: 24, fontWeight: 700, color: '#0B0B0F' }}
            >
              {initials}
            </div>
          )}
          <button
            className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
            style={{ width: 24, height: 24, background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
          >
            <Camera size={11} style={{ color: 'var(--text-dim)' }} />
          </button>
        </div>
        <div>
          <div style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600 }}>{displayName}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>
            {session ? 'Workspace Owner · NEXUS' : 'Creative Director · Apex Studio'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Full Name" value={displayName} />
        <FormField label="Email" type="email" value={email} />
        <FormField label="Role" value={session ? 'Workspace Owner' : 'Creative Director'} />
        <FormField label="Timezone" value="UTC+3 (East Africa Time)" />
      </div>

      <div>
        <FormField label="Bio" value="Creative director specializing in brand strategy and visual systems." />
      </div>

      <div>
        <motion.button
          whileHover={{ background: 'var(--accent-hover)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: 'var(--accent)',
            color: '#0B0B0F',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 24px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Save Changes
        </motion.button>
      </div>
    </div>
  );
}

function OrganizationTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Organization</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Configure your workspace and team settings.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Organization Name" value="Apex Studio" />
        <FormField label="Website" value="https://apexstudio.co" />
        <FormField label="Industry" value="Creative Services" />
        <FormField label="Team Size" value="6 members" />
      </div>
      <div>
        <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Fiscal Year Start</label>
        <div className="flex gap-2">
          {['January', 'April', 'July', 'October'].map(m => (
            <button
              key={m}
              style={{
                background: m === 'January' ? 'rgba(var(--accent-rgb),0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${m === 'January' ? 'rgba(var(--accent-rgb),0.3)' : 'var(--hair-2)'}`,
                color: m === 'January' ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: 12,
                borderRadius: 8,
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <motion.button
        whileHover={{ background: 'var(--accent-hover)' }}
        whileTap={{ scale: 0.97 }}
        style={{ background: 'var(--accent)', color: '#0B0B0F', fontSize: 13, fontWeight: 600, borderRadius: 8, padding: '10px 24px', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
      >
        Save Changes
      </motion.button>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Integrations</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Connect your tools and data sources with NEXUS.</p>
      </div>
      <div className="flex flex-col gap-3">
        <IntegrationItem name="Slack" description="Team notifications and alerts" connected={true} color="#A78BFA" />
        <IntegrationItem name="Figma" description="Design file sync and handoff" connected={true} color="var(--accent)" />
        <IntegrationItem name="Stripe" description="Revenue and invoice data" connected={true} color="#22C55E" />
        <IntegrationItem name="Notion" description="Project documentation" connected={false} color="var(--text)" />
        <IntegrationItem name="Google" description="Calendar and Drive sync" connected={false} color="#FFB547" />
        <IntegrationItem name="Jira" description="Task and sprint tracking" connected={false} color="#60A5FA" />
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Security</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Manage authentication and access controls.</p>
      </div>
      <div className="flex flex-col gap-4">
        <FormField label="Current Password" type="password" value="" placeholder="••••••••" />
        <FormField label="New Password" type="password" value="" placeholder="••••••••" />
        <FormField label="Confirm New Password" type="password" value="" placeholder="••••••••" />
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
      >
        <Toggle label="Two-Factor Authentication" description="Add an extra layer of security with 2FA" defaultOn={true} />
        <Toggle label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultOn={false} />
        <Toggle label="Login Notifications" description="Get notified of new logins to your account" defaultOn={true} />
      </div>
      <motion.button
        whileHover={{ background: 'var(--accent-hover)' }}
        whileTap={{ scale: 0.97 }}
        style={{ background: 'var(--accent)', color: '#0B0B0F', fontSize: 13, fontWeight: 600, borderRadius: 8, padding: '10px 24px', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
      >
        Update Password
      </motion.button>
    </div>
  );
}

function AITab() {
  const [confidence, setConfidence] = useState(75);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>AI Preferences</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Configure how Core AI behaves and surfaces intelligence.</p>
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
      >
        <Toggle label="Project Recommendations" description="Core suggests optimizations for active projects" defaultOn={true} />
        <Toggle label="Burnout Prediction Alerts" description="Early warnings when team members show stress signals" defaultOn={true} />
        <Toggle label="Revenue Forecasting" description="AI-driven revenue predictions and pipeline insights" defaultOn={true} />
        <Toggle label="Smart Scheduling" description="Core optimizes meeting times and deadlines" defaultOn={false} />
        <Toggle label="Client Risk Detection" description="Automated health scoring and churn signals" defaultOn={true} />
      </div>
      <div>
        <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>
          AI Confidence Threshold — {confidence}%
        </label>
        <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 12 }}>
          Core will only surface insights with confidence above this threshold.
        </p>
        <div className="flex items-center gap-3">
          <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>50%</span>
          <input
            type="range"
            min={50}
            max={95}
            value={confidence}
            onChange={e => setConfidence(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
          <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>95%</span>
        </div>
      </div>
      <div>
        <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>Response Style</label>
        <div className="flex gap-2">
          {['Concise', 'Balanced', 'Executive'].map((style, i) => (
            <button
              key={style}
              style={{
                background: i === 1 ? 'rgba(var(--accent-rgb),0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 1 ? 'rgba(var(--accent-rgb),0.3)' : 'var(--hair-2)'}`,
                color: i === 1 ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: 13,
                borderRadius: 8,
                padding: '8px 18px',
                cursor: 'pointer',
              }}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeTab() {
  const [accent, setAccent] = useState(currentAccent().name);
  const [mode, setMode] = useState<ColorMode>(currentMode());
  const [scale, setScale] = useState<FontScale>(currentScale());

  const REACTIONS = [
    'Same intelligence, new light.',
    'Your workspace, your wavelength.',
    'Every surface just retuned to match.',
    'A fresh coat of photons.',
  ];

  const pickAccent = (a: Accent) => {
    applyAccent(a);
    setAccent(a.name);
    toast.success(`Accent set to ${a.name}`, {
      description: REACTIONS[Math.floor(Math.random() * REACTIONS.length)],
    });
  };

  const pickMode = (m: ColorMode) => {
    applyColorMode(m);
    setMode(m);
    toast.success(`${m[0].toUpperCase() + m.slice(1)} mode`, {
      description: m === 'system' ? 'NEXUS now follows your device.' : 'The whole surface just shifted.',
    });
  };

  const pickScale = (fs: FontScale) => {
    applyFontScale(fs);
    setScale(fs);
  };

  const MODES: { id: ColorMode; label: string; bg: string; border: string }[] = [
    { id: 'dark', label: 'Dark', bg: '#15151B', border: 'var(--hair-2)' },
    { id: 'light', label: 'Light', bg: '#F0F0F5', border: 'var(--hair-2)' },
    { id: 'system', label: 'System', bg: 'linear-gradient(135deg, #15151B 50%, #F0F0F5 50%)', border: 'var(--hair-2)' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Theme</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Personalize the NEXUS visual experience.</p>
      </div>

      {/* Color mode */}
      <div>
        <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 10 }}>Color Mode</label>
        <div className="flex gap-3">
          {MODES.map(m => {
            const active = mode === m.id;
            return (
              <motion.div
                key={m.id}
                whileHover={{ y: -2 }}
                onClick={() => pickMode(m.id)}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="rounded-xl"
                  style={{ width: 80, height: 52, background: m.bg, border: `2px solid ${active ? 'var(--accent)' : m.border}`, boxShadow: active ? '0 0 0 3px rgba(var(--accent-rgb),0.15)' : 'none', transition: 'all 0.15s ease' }}
                />
                <span style={{ color: active ? 'var(--accent)' : 'var(--text-dim)', fontSize: 12, fontWeight: active ? 600 : 400 }}>{m.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Accent */}
      <div>
        <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 10 }}>Accent Color</label>
        <div className="flex items-center gap-3">
          {ACCENTS.map(ac => {
            const selected = accent === ac.name;
            return (
              <motion.div
                key={ac.name}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => pickAccent(ac)}
                className="flex flex-col items-center gap-1.5"
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    background: ac.hex,
                    border: selected ? '3px solid var(--text)' : '3px solid transparent',
                    boxShadow: selected ? `0 0 16px -2px ${ac.hex}` : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {selected && <span style={{ color: '#0B0B0F', fontSize: 14, fontWeight: 700 }}>{'✓'}</span>}
                </div>
                <span style={{ color: selected ? 'var(--accent)' : 'var(--text-dim)', fontSize: 10 }}>{ac.name}</span>
              </motion.div>
            );
          })}
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 10, opacity: 0.7 }}>
          Applies instantly across the entire workspace and persists on this device.
        </p>
      </div>

      {/* Font size */}
      <div>
        <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>Font Size</label>
        <div className="flex gap-2">
          {(['small', 'default', 'large'] as FontScale[]).map(fs => {
            const active = scale === fs;
            return (
              <button
                key={fs}
                onClick={() => pickScale(fs)}
                style={{
                  background: active ? 'rgba(var(--accent-rgb),0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(var(--accent-rgb),0.3)' : 'var(--hair-2)'}`,
                  color: active ? 'var(--accent)' : 'var(--text-dim)',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  borderRadius: 8,
                  padding: '8px 18px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {fs}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkspaceTab() {
  const { resetDemo, activity } = useNexus();
  const { session, guest } = useAuth();
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    resetDemo();
    setConfirming(false);
    toast.success('Workspace restored to showroom state', {
      description: session
        ? 'Your cloud copy will re-sync with the fresh data in a moment.'
        : 'Local workspace reset to the original demo data.',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Workspace Data</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Where your workspace lives, and how to start fresh.</p>
      </div>

      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--hair)' }}
      >
        {session ? <Cloud size={16} style={{ color: 'var(--accent)' }} /> : <HardDrive size={16} style={{ color: '#FFB547' }} />}
        <div className="flex-1">
          <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>
            {session ? 'Synced to cloud' : guest ? 'Guest — this device only' : 'Local mode'}
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>
            {session
              ? 'Changes save to your private workspace and follow you across devices.'
              : 'Changes are stored in this browser. Sign in with Google to sync.'}
          </div>
        </div>
      </div>

      <div>
        <label style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>
          Applied AI actions this workspace
        </label>
        {activity.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: 13, opacity: 0.7 }}>None yet — the workspace is in its original showroom state.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {activity.slice(0, 6).map(a => (
              <div key={a.id} className="flex items-center gap-2" style={{ color: 'var(--text-dim)', fontSize: 12.5 }}>
                <span className="rounded-full" style={{ width: 5, height: 5, background: 'var(--accent)' }} />
                {a.label}
                <span style={{ opacity: 0.5, fontSize: 11 }}>{a.timestamp}</span>
              </div>
            ))}
            {activity.length > 6 && (
              <span style={{ color: 'var(--text-dim)', fontSize: 11, opacity: 0.6 }}>+{activity.length - 6} more</span>
            )}
          </div>
        )}
      </div>

      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,181,71,0.05)', border: '1px solid rgba(255,181,71,0.2)' }}
      >
        <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Reset demo data</div>
        <p style={{ color: 'var(--text-dim)', fontSize: 12.5, lineHeight: 1.5, marginBottom: 14 }}>
          Restores every project, team member, client, and notification to the original staged workspace —
          like housekeeping resetting the show house. Use this right before a presentation for a clean run.
        </p>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg px-4 py-2"
          style={{
            background: confirming ? '#FF6B6B' : 'rgba(255,181,71,0.1)',
            border: `1px solid ${confirming ? '#FF6B6B' : 'rgba(255,181,71,0.35)'}`,
            color: confirming ? '#0B0B0F' : '#FFB547',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <RotateCcw size={13} />
          {confirming ? 'Click again to confirm reset' : 'Reset demo data'}
        </motion.button>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<string, React.ReactNode> = {
  profile: <ProfileTab />,
  organization: <OrganizationTab />,
  workspace: <WorkspaceTab />,
  integrations: <IntegrationsTab />,
  security: <SecurityTab />,
  ai: <AITab />,
  theme: <ThemeTab />,
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <PageShell>
      <div className="mb-6">
        <h1 style={{ color: 'var(--text)', fontSize: 24, fontWeight: 600 }}>Settings</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 2 }}>Manage your account and workspace preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar */}
        <div
          className="rounded-xl p-2 flex flex-col gap-0.5 shrink-0"
          style={{ width: 200, background: 'var(--surface)', border: '1px solid var(--hair)', alignSelf: 'flex-start' }}
        >
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left"
                style={{
                  background: isActive ? 'rgba(var(--accent-rgb),0.08)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} style={{ opacity: isActive ? 1 : 0.7 }} />
                {tab.label}
                {isActive && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="flex-1 rounded-xl p-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
        >
          {TAB_CONTENT[activeTab]}
        </motion.div>
      </div>
    </PageShell>
  );
}
