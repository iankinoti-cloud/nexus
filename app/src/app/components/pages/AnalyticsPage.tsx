import { motion } from 'motion/react';
import { TrendingUp, Target, Users, Star } from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { RevenueAreaChart } from '../charts/RevenueAreaChart';
import { CompletionBarChart } from '../charts/CompletionBarChart';
import { UtilizationRadialChart } from '../charts/UtilizationRadialChart';
import { SatisfactionLineChart } from '../charts/SatisfactionLineChart';

function ChartCard({ title, subtitle, children, delay = 0, colSpan = 1 }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  colSpan?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className="rounded-xl p-6"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hair)',
        gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
      }}
    >
      <div className="mb-5">
        <div style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </motion.div>
  );
}

const KPI_METRICS = [
  { icon: TrendingUp, label: 'Total Revenue YTD', value: '$1.39M', change: '+24%', color: 'var(--status-success)' },
  { icon: Target, label: 'Completion Rate', value: '91%', change: '+7%', color: 'var(--accent)' },
  { icon: Users, label: 'Team Utilization', value: '66%', change: '-3%', color: 'var(--status-warning)' },
  { icon: Star, label: 'Avg Satisfaction', value: '4.8', change: '+0.6', color: '#A07C6E' },
];

export function AnalyticsPage() {
  return (
    <PageShell>
      <div className="mb-6">
        <h1 style={{ color: 'var(--text)', fontSize: 'calc(24px * var(--fs))', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Analytics</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', marginTop: 2 }}>Executive overview · July 2026</p>
      </div>

      {/* KPI Strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex items-center gap-0 rounded-xl mb-6 overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
      >
        {KPI_METRICS.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex items-center gap-3 flex-1 px-5 py-4"
              style={{ borderRight: i < 3 ? '1px solid var(--hair)' : 'none' }}
            >
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 36, height: 36, background: metric.color + '18' }}
              >
                <Icon size={16} style={{ color: metric.color }} />
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{metric.label}</div>
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 600 }}>{metric.value}</span>
                  <span style={{ color: metric.color, fontSize: 'calc(12px * var(--fs))' }}>{metric.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Prediction Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-xl p-5 mb-6 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(107,168,136,0.1) 0%, rgba(var(--accent-rgb),0.06) 100%)',
          border: '1px solid rgba(107,168,136,0.2)',
        }}
      >
        <div>
          <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', marginBottom: 4 }}>Revenue Growth Prediction · Next 90 Days</div>
          <div style={{ color: 'var(--status-success)', fontSize: 'calc(36px * var(--fs))', fontWeight: 700, lineHeight: 1 }}>+18.5%</div>
          <div style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', marginTop: 6 }}>
            Forecast: $847K · Confidence: 87% · 2 pipeline deals closing in August
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className="rounded-lg px-4 py-2"
            style={{ background: 'rgba(107,168,136,0.15)', border: '1px solid rgba(107,168,136,0.3)' }}
          >
            <span style={{ color: 'var(--status-success)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500 }}>↑ On Track</span>
          </div>
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>Updated Jul 16, 2026</span>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ChartCard title="Revenue Growth" subtitle="Monthly actual vs forecast (USD thousands)" delay={0.15} colSpan={2}>
          <RevenueAreaChart />
        </ChartCard>

        <ChartCard title="Project Completion Rate" subtitle="Tasks completed vs target per week" delay={0.22}>
          <CompletionBarChart />
        </ChartCard>

        <ChartCard title="Client Satisfaction" subtitle="NPS score trend · Target: 4.5" delay={0.28}>
          <SatisfactionLineChart />
        </ChartCard>

        <ChartCard title="Team Utilization by Department" subtitle="Current utilization across 6 departments" delay={0.34} colSpan={2}>
          <UtilizationRadialChart />
        </ChartCard>
      </div>
    </PageShell>
  );
}
