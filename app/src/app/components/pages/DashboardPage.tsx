import { useState } from 'react';
import { motion } from 'motion/react';
import { FolderKanban, Users, TrendingUp, Star, Cpu, ArrowRight, Calendar, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PageShell } from '../layout/PageShell';
import { KPICard } from '../shared/KPICard';
import { MiniAreaChart } from '../charts/MiniAreaChart';
import { useNexus, type CoreAction } from '../../data/store';
import { TeamAvatarStack } from '../shared/TeamAvatarStack';

const KPIs = [
  { label: 'Active Projects', value: '24', change: '+3 this week', changeType: 'up' as const, icon: FolderKanban },
  { label: 'Team Capacity', value: '87%', change: '+2% from last week', changeType: 'up' as const, icon: Users },
  { label: 'Monthly Revenue', value: '$284K', change: '+12% from last month', changeType: 'up' as const, icon: TrendingUp },
  { label: 'Client Satisfaction', value: '4.8 / 5', change: '+0.2 this month', changeType: 'up' as const, icon: Star },
];

interface Insight {
  color: string;
  title: string;
  description: string;
  action: CoreAction;
}

const INSIGHTS: Insight[] = [
  {
    color: '#4FD1C5',
    title: 'Resource reallocation opportunity',
    description: 'Nina Chen is past the healthy utilization band. Shifting one workstream to Sam Rivera reduces burnout risk without timeline impact.',
    action: { type: 'reassign', fromEmployeeId: 'e5', toEmployeeId: 'e3' },
  },
  {
    color: '#FFB547',
    title: 'Nexora scope escalation risk',
    description: 'Detected 34% scope creep on Nexora Web Platform. Client sign-off recommended within 48 hours.',
    action: { type: 'contact_client', clientId: 'c4', draft: 'Hi Nexora team — before we move into the build phase, we\'d like to walk you through the current scope against the signed SOW and confirm sign-off on the additions. Does tomorrow 10:00 work for a 30-minute call?' },
  },
  {
    color: '#22C55E',
    title: 'Revenue forecast on track',
    description: 'Q3 pipeline at $847K (+18.5%). Two deals expected to close in August will exceed target.',
    action: { type: 'none' },
  },
];

export function DashboardPage() {
  const nexus = useNexus();
  const [appliedInsights, setAppliedInsights] = useState<number[]>([]);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const nextActionable = INSIGHTS.findIndex(
    (ins, i) => ins.action.type !== 'none' && !appliedInsights.includes(i),
  );

  const handleApply = () => {
    if (nextActionable === -1) return;
    const insight = INSIGHTS[nextActionable];
    const label = nexus.applyAction(insight.action);
    if (label) {
      setAppliedInsights(prev => [...prev, nextActionable]);
      toast.success(label, { description: insight.title });
      if (insight.action.type === 'contact_client' && insight.action.draft) {
        toast.message('Draft prepared by Core', { description: insight.action.draft, duration: 8000 });
      }
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex items-start justify-between"
      >
        <div>
          <h1 style={{ color: '#F4F4F5', fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>
            Good Morning, Sarah.
          </h1>
          <p style={{ color: '#A1A1AA', fontSize: 15, marginTop: 6 }}>
            Everything is running smoothly.
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-2"
          style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Calendar size={14} style={{ color: '#A1A1AA' }} />
          <span style={{ color: '#A1A1AA', fontSize: 13 }}>{dateStr}</span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {KPIs.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} delay={i * 0.07} />
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid gap-5 mb-7" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Core Intelligence Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.32 }}
          className="rounded-xl p-6"
          style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: 32, height: 32, background: 'rgba(79,209,197,0.12)' }}
              >
                <Cpu size={15} style={{ color: '#4FD1C5' }} />
              </div>
              <div>
                <div style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600 }}>Core Intelligence</div>
                <div style={{ color: '#A1A1AA', fontSize: 11 }}>3 active recommendations</div>
              </div>
            </div>
            <span
              className="rounded-full px-2 py-0.5"
              style={{ background: 'rgba(79,209,197,0.1)', color: '#4FD1C5', fontSize: 11 }}
            >
              Live
            </span>
          </div>

          <div className="flex flex-col gap-0">
            {INSIGHTS.map((ins, i) => (
              <div key={i}>
                <div className="flex items-start gap-3 py-4">
                  <div
                    className="rounded-full mt-1 shrink-0"
                    style={{ width: 7, height: 7, background: appliedInsights.includes(i) ? '#22C55E' : ins.color, marginTop: 6 }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2" style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500, marginBottom: 3 }}>
                      {ins.title}
                      {appliedInsights.includes(i) && (
                        <span className="flex items-center gap-1" style={{ color: '#22C55E', fontSize: 10, fontWeight: 600 }}>
                          <Check size={10} /> APPLIED
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#A1A1AA', fontSize: 12, lineHeight: 1.5 }}>
                      {ins.description}
                    </div>
                  </div>
                </div>
                {i < INSIGHTS.length - 1 && (
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                )}
              </div>
            ))}
          </div>

          <motion.button
            whileHover={nextActionable === -1 ? {} : { background: 'rgba(79,209,197,0.12)' }}
            whileTap={nextActionable === -1 ? {} : { scale: 0.97 }}
            onClick={handleApply}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg py-2.5"
            style={{
              background: nextActionable === -1 ? 'rgba(34,197,94,0.07)' : 'rgba(79,209,197,0.07)',
              border: `1px solid ${nextActionable === -1 ? 'rgba(34,197,94,0.25)' : 'rgba(79,209,197,0.25)'}`,
              color: nextActionable === -1 ? '#22C55E' : '#4FD1C5',
              fontSize: 13,
              fontWeight: 500,
              cursor: nextActionable === -1 ? 'default' : 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            {nextActionable === -1 ? (
              <>All recommendations applied <Check size={14} /></>
            ) : (
              <>Apply Recommendation <ArrowRight size={14} /></>
            )}
          </motion.button>
        </motion.div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.38 }}
          className="rounded-xl p-6 flex flex-col"
          style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <div style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600 }}>Revenue Trend</div>
            <span style={{ color: '#A1A1AA', fontSize: 11 }}>Last 30 days</span>
          </div>
          <div style={{ color: '#4FD1C5', fontSize: 26, fontWeight: 600, marginBottom: 4 }}>$284K</div>
          <div style={{ color: '#22C55E', fontSize: 12, marginBottom: 16 }}>↑ +12% vs last month</div>
          <div className="flex-1">
            <MiniAreaChart />
          </div>
          <div
            className="mt-4 rounded-lg p-3 flex items-center gap-2"
            style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <TrendingUp size={13} style={{ color: '#22C55E' }} />
            <span style={{ color: '#22C55E', fontSize: 12 }}>Q3 forecast: $847K (+18.5%)</span>
          </div>
        </motion.div>
      </div>

      {/* Project Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.44 }}
        className="rounded-xl p-6"
        style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600 }}>Active Projects</div>
          <button style={{ color: '#4FD1C5', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-0">
          {nexus.projects.slice(0, 4).map((project, i) => {
            const riskColor = project.risk === 'low' ? '#22C55E' : project.risk === 'medium' ? '#FFB547' : '#FF6B6B';
            return (
              <div key={project.id}>
                <div className="flex items-center gap-4 py-3.5">
                  <div style={{ width: 200, flexShrink: 0 }}>
                    <div style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500 }}>{project.name}</div>
                    <div style={{ color: '#A1A1AA', fontSize: 11, marginTop: 1 }}>{project.client}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ color: '#A1A1AA', fontSize: 11 }}>Progress</span>
                      <span style={{ color: '#F4F4F5', fontSize: 12, fontWeight: 500 }}>{project.progress}%</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${project.progress}%`, background: riskColor, transition: 'width 0.8s ease' }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0" style={{ width: 120 }}>
                    <Clock size={11} style={{ color: '#A1A1AA' }} />
                    <span style={{ color: '#A1A1AA', fontSize: 11 }}>{project.deadline}</span>
                  </div>
                  <div className="shrink-0">
                    <TeamAvatarStack avatars={project.team} max={3} size={24} />
                  </div>
                </div>
                {i < 3 && <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />}
              </div>
            );
          })}
        </div>
      </motion.div>
    </PageShell>
  );
}
