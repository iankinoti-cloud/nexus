import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Building2, Puzzle, Shield, Cpu, Palette, Camera, ChevronRight } from 'lucide-react';
import { PageShell } from '../layout/PageShell';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
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
      <label style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg px-3 py-2.5 w-full"
        style={{
          background: '#1E1E26',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F4F4F5',
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
        <div style={{ color: '#F4F4F5', fontSize: 14 }}>{label}</div>
        {description && <div style={{ color: '#A1A1AA', fontSize: 12, marginTop: 2 }}>{description}</div>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className="relative shrink-0 rounded-full"
        style={{
          width: 44,
          height: 24,
          background: on ? '#4FD1C5' : 'rgba(255,255,255,0.1)',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          marginTop: 2,
        }}
      >
        <motion.div
          animate={{ x: on ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 rounded-full"
          style={{ width: 16, height: 16, background: '#F4F4F5', left: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
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
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 36, height: 36, background: color + '20', border: `1px solid ${color}30` }}
        >
          <span style={{ color, fontSize: 14, fontWeight: 700 }}>{name[0]}</span>
        </div>
        <div>
          <div style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500 }}>{name}</div>
          <div style={{ color: '#A1A1AA', fontSize: 12 }}>{description}</div>
        </div>
      </div>
      <button
        onClick={() => setIsConnected(!isConnected)}
        style={{
          background: isConnected ? 'rgba(34,197,94,0.1)' : 'rgba(79,209,197,0.1)',
          border: `1px solid ${isConnected ? 'rgba(34,197,94,0.3)' : 'rgba(79,209,197,0.3)'}`,
          color: isConnected ? '#22C55E' : '#4FD1C5',
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
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Profile</h2>
        <p style={{ color: '#A1A1AA', fontSize: 13 }}>Manage your personal information and preferences.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #4FD1C5, #22C55E)', fontSize: 24, fontWeight: 700, color: '#0B0B0F' }}
          >
            SC
          </div>
          <button
            className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
            style={{ width: 24, height: 24, background: '#1E1E26', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
          >
            <Camera size={11} style={{ color: '#A1A1AA' }} />
          </button>
        </div>
        <div>
          <div style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600 }}>Sarah Chen</div>
          <div style={{ color: '#A1A1AA', fontSize: 13 }}>Creative Director · Apex Studio</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Full Name" value="Sarah Chen" />
        <FormField label="Email" type="email" value="sarah@apexstudio.co" />
        <FormField label="Role" value="Creative Director" />
        <FormField label="Timezone" value="UTC-5 (Eastern Time)" />
      </div>

      <div>
        <FormField label="Bio" value="Creative director specializing in brand strategy and visual systems." />
      </div>

      <div>
        <motion.button
          whileHover={{ background: '#3dbdb2' }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: '#4FD1C5',
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
        <h2 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Organization</h2>
        <p style={{ color: '#A1A1AA', fontSize: 13 }}>Configure your workspace and team settings.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Organization Name" value="Apex Studio" />
        <FormField label="Website" value="https://apexstudio.co" />
        <FormField label="Industry" value="Creative Services" />
        <FormField label="Team Size" value="6 members" />
      </div>
      <div>
        <label style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Fiscal Year Start</label>
        <div className="flex gap-2">
          {['January', 'April', 'July', 'October'].map(m => (
            <button
              key={m}
              style={{
                background: m === 'January' ? 'rgba(79,209,197,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${m === 'January' ? 'rgba(79,209,197,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: m === 'January' ? '#4FD1C5' : '#A1A1AA',
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
        whileHover={{ background: '#3dbdb2' }}
        whileTap={{ scale: 0.97 }}
        style={{ background: '#4FD1C5', color: '#0B0B0F', fontSize: 13, fontWeight: 600, borderRadius: 8, padding: '10px 24px', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
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
        <h2 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Integrations</h2>
        <p style={{ color: '#A1A1AA', fontSize: 13 }}>Connect your tools and data sources with NEXUS.</p>
      </div>
      <div className="flex flex-col gap-3">
        <IntegrationItem name="Slack" description="Team notifications and alerts" connected={true} color="#A78BFA" />
        <IntegrationItem name="Figma" description="Design file sync and handoff" connected={true} color="#4FD1C5" />
        <IntegrationItem name="Stripe" description="Revenue and invoice data" connected={true} color="#22C55E" />
        <IntegrationItem name="Notion" description="Project documentation" connected={false} color="#F4F4F5" />
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
        <h2 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Security</h2>
        <p style={{ color: '#A1A1AA', fontSize: 13 }}>Manage authentication and access controls.</p>
      </div>
      <div className="flex flex-col gap-4">
        <FormField label="Current Password" type="password" value="" placeholder="••••••••" />
        <FormField label="New Password" type="password" value="" placeholder="••••••••" />
        <FormField label="Confirm New Password" type="password" value="" placeholder="••••••••" />
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Toggle label="Two-Factor Authentication" description="Add an extra layer of security with 2FA" defaultOn={true} />
        <Toggle label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultOn={false} />
        <Toggle label="Login Notifications" description="Get notified of new logins to your account" defaultOn={true} />
      </div>
      <motion.button
        whileHover={{ background: '#3dbdb2' }}
        whileTap={{ scale: 0.97 }}
        style={{ background: '#4FD1C5', color: '#0B0B0F', fontSize: 13, fontWeight: 600, borderRadius: 8, padding: '10px 24px', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
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
        <h2 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>AI Preferences</h2>
        <p style={{ color: '#A1A1AA', fontSize: 13 }}>Configure how Core AI behaves and surfaces intelligence.</p>
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Toggle label="Project Recommendations" description="Core suggests optimizations for active projects" defaultOn={true} />
        <Toggle label="Burnout Prediction Alerts" description="Early warnings when team members show stress signals" defaultOn={true} />
        <Toggle label="Revenue Forecasting" description="AI-driven revenue predictions and pipeline insights" defaultOn={true} />
        <Toggle label="Smart Scheduling" description="Core optimizes meeting times and deadlines" defaultOn={false} />
        <Toggle label="Client Risk Detection" description="Automated health scoring and churn signals" defaultOn={true} />
      </div>
      <div>
        <label style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>
          AI Confidence Threshold — {confidence}%
        </label>
        <p style={{ color: '#A1A1AA', fontSize: 12, marginBottom: 12 }}>
          Core will only surface insights with confidence above this threshold.
        </p>
        <div className="flex items-center gap-3">
          <span style={{ color: '#A1A1AA', fontSize: 12 }}>50%</span>
          <input
            type="range"
            min={50}
            max={95}
            value={confidence}
            onChange={e => setConfidence(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#4FD1C5', cursor: 'pointer' }}
          />
          <span style={{ color: '#A1A1AA', fontSize: 12 }}>95%</span>
        </div>
      </div>
      <div>
        <label style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>Response Style</label>
        <div className="flex gap-2">
          {['Concise', 'Balanced', 'Executive'].map((style, i) => (
            <button
              key={style}
              style={{
                background: i === 1 ? 'rgba(79,209,197,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 1 ? 'rgba(79,209,197,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: i === 1 ? '#4FD1C5' : '#A1A1AA',
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
  const ACCENT_COLORS = [
    { color: '#4FD1C5', name: 'Cyan' },
    { color: '#A78BFA', name: 'Purple' },
    { color: '#22C55E', name: 'Emerald' },
    { color: '#FFB547', name: 'Gold' },
    { color: '#60A5FA', name: 'Blue' },
    { color: '#F472B6', name: 'Pink' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Theme</h2>
        <p style={{ color: '#A1A1AA', fontSize: 13 }}>Personalize the NEXUS visual experience.</p>
      </div>
      <div>
        <label style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 10 }}>Color Mode</label>
        <div className="flex gap-3">
          {[
            { label: 'Dark', active: true, bg: '#15151B', border: '#4FD1C5' },
            { label: 'Light', active: false, bg: '#F0F0F5', border: 'rgba(255,255,255,0.08)' },
            { label: 'System', active: false, bg: 'linear-gradient(135deg, #15151B 50%, #F0F0F5 50%)', border: 'rgba(255,255,255,0.08)' },
          ].map(mode => (
            <div
              key={mode.label}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div
                className="rounded-xl"
                style={{
                  width: 80,
                  height: 52,
                  background: mode.bg,
                  border: `2px solid ${mode.border}`,
                }}
              />
              <span style={{ color: mode.active ? '#4FD1C5' : '#A1A1AA', fontSize: 12 }}>{mode.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 10 }}>Accent Color</label>
        <div className="flex items-center gap-3">
          {ACCENT_COLORS.map((ac, i) => (
            <div key={ac.color} className="flex flex-col items-center gap-1.5">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  background: ac.color,
                  border: i === 0 ? '3px solid #F4F4F5' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {i === 0 && <span style={{ color: '#0B0B0F', fontSize: 14, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ color: '#A1A1AA', fontSize: 10 }}>{ac.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>Font Size</label>
        <div className="flex gap-2">
          {['Small', 'Default', 'Large'].map((size, i) => (
            <button
              key={size}
              style={{
                background: i === 1 ? 'rgba(79,209,197,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 1 ? 'rgba(79,209,197,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: i === 1 ? '#4FD1C5' : '#A1A1AA',
                fontSize: 13,
                borderRadius: 8,
                padding: '8px 18px',
                cursor: 'pointer',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<string, React.ReactNode> = {
  profile: <ProfileTab />,
  organization: <OrganizationTab />,
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
        <h1 style={{ color: '#F4F4F5', fontSize: 24, fontWeight: 600 }}>Settings</h1>
        <p style={{ color: '#A1A1AA', fontSize: 13, marginTop: 2 }}>Manage your account and workspace preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar */}
        <div
          className="rounded-xl p-2 flex flex-col gap-0.5 shrink-0"
          style={{ width: 200, background: '#15151B', border: '1px solid rgba(255,255,255,0.06)', alignSelf: 'flex-start' }}
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
                  background: isActive ? 'rgba(79,209,197,0.08)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '2px solid #4FD1C5' : '2px solid transparent',
                  color: isActive ? '#4FD1C5' : '#A1A1AA',
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
          style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {TAB_CONTENT[activeTab]}
        </motion.div>
      </div>
    </PageShell>
  );
}
