import { motion } from 'motion/react';
import { Star, Briefcase, Plus } from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { WorkloadRing } from '../shared/WorkloadRing';
import { useNexus } from '../../data/store';
import type { Employee } from '../../data/types';

function AvailabilityBadge({ status }: { status: Employee['availability'] }) {
  const config = {
    available: { label: 'Available', color: 'var(--status-success)', bg: 'rgba(107,168,136,0.1)', border: 'rgba(107,168,136,0.2)' },
    busy: { label: 'Busy', color: 'var(--status-warning)', bg: 'rgba(201,135,78,0.1)', border: 'rgba(201,135,78,0.2)' },
    'at-capacity': { label: 'At Capacity', color: 'var(--status-danger)', bg: 'rgba(184,92,92,0.1)', border: 'rgba(184,92,92,0.2)' },
  }[status];

  return (
    <span style={{
      color: config.color,
      background: config.bg,
      border: `1px solid ${config.border}`,
      fontSize: 'calc(11px * var(--fs))',
      fontWeight: 500,
      borderRadius: 6,
      padding: '2px 8px',
    }}>
      {config.label}
    </span>
  );
}

function EmployeeCard({ emp, delay }: { emp: Employee; delay: number }) {
  const burnoutColor = emp.burnoutRisk >= 70 ? 'var(--status-danger)' : emp.burnoutRisk >= 40 ? 'var(--status-warning)' : 'var(--status-success)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay, ease: 'easeOut' }}
      whileHover={{ borderColor: 'rgba(var(--accent-rgb),0.18)', y: -2 }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hair)',
        cursor: 'default',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 42, height: 42, background: emp.avatarColor + '22', border: `1px solid ${emp.avatarColor}44` }}
          >
            <span style={{ color: emp.avatarColor, fontSize: 'calc(14px * var(--fs))', fontWeight: 700 }}>{emp.initials}</span>
          </div>
          <div>
            <div style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', fontWeight: 600 }}>{emp.name}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>{emp.role}</div>
          </div>
        </div>
        <AvailabilityBadge status={emp.availability} />
      </div>

      {/* Workload ring */}
      <div className="flex items-center gap-4">
        <WorkloadRing value={emp.workload} size={68} />
        <div className="flex flex-col gap-2">
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Projects</div>
            <div style={{ color: 'var(--text)', fontSize: 'calc(18px * var(--fs))', fontWeight: 600 }}>{emp.currentProjects}</div>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} style={{ color: 'var(--status-warning)', fill: 'var(--status-warning)' }} />
            <span style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500 }}>{emp.performanceScore}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {emp.skills.map(skill => (
          <span
            key={skill}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--hair-2)',
              color: 'var(--text-dim)',
              fontSize: 'calc(11px * var(--fs))',
              borderRadius: 6,
              padding: '3px 8px',
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Burnout + AI score */}
      <div className="flex flex-col gap-2.5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>Burnout Risk</span>
            <span style={{ color: burnoutColor, fontSize: 'calc(12px * var(--fs))', fontWeight: 500 }}>{emp.burnoutRisk}%</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'var(--hair)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${emp.burnoutRisk}%` }}
              transition={{ duration: 0.9, delay: delay + 0.15, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: burnoutColor }}
            />
          </div>
        </div>
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2"
          style={{ background: 'rgba(var(--accent-rgb),0.06)', border: '1px solid rgba(var(--accent-rgb),0.12)' }}
        >
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>AI Compatibility</span>
          <span style={{ color: 'var(--accent)', fontSize: 'calc(14px * var(--fs))', fontWeight: 600 }}>{emp.compatibilityScore}%</span>
        </div>
      </div>
    </motion.div>
  );
}

export function TalentPage() {
  const { employees: EMPLOYEES } = useNexus();
  return (
    <PageShell aura={[
      { color: '#EC4899', shape: 'blob', position: 'top-right' },
      { color: '#EC4899', shape: 'circle', position: 'bottom-left', size: 380, opacity: 0.10 },
    ]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--text)', fontSize: 'calc(24px * var(--fs))', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Talent</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', marginTop: 2 }}>
            {EMPLOYEES.length} team members · {EMPLOYEES.filter(e => e.availability === 'available').length} available
          </p>
        </div>
        <motion.button
          whileHover={{ background: 'var(--accent-hover)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5"
          style={{ background: 'var(--accent)', color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} />
          Add Member
        </motion.button>
      </div>

      {/* Summary bar */}
      <div
        className="rounded-xl px-5 py-3.5 mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
      >
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 sm:flex sm:items-center sm:gap-6">
          {[
            { label: 'Avg Workload', value: `${Math.round(EMPLOYEES.reduce((a, e) => a + e.workload, 0) / EMPLOYEES.length)}%` },
            { label: 'High Burnout Risk', value: EMPLOYEES.filter(e => e.burnoutRisk >= 70).length, color: 'var(--status-danger)' },
            { label: 'At Capacity', value: EMPLOYEES.filter(e => e.availability === 'at-capacity').length, color: 'var(--status-warning)' },
            { label: 'Avg Performance', value: (EMPLOYEES.reduce((a, e) => a + e.performanceScore, 0) / EMPLOYEES.length).toFixed(1) },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="hidden sm:block" style={{ width: 1, height: 24, background: 'var(--hair)' }} />}
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{item.label}</div>
                <div style={{ color: (item as any).color || 'var(--text)', fontSize: 'calc(18px * var(--fs))', fontWeight: 600 }}>{item.value}</div>
              </div>
            </div>
          ))}
          <div className="hidden sm:flex sm:ml-auto items-center gap-1.5" style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>
            <Briefcase size={13} />
            6 open projects
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {EMPLOYEES.map((emp, i) => (
          <EmployeeCard key={emp.id} emp={emp} delay={i * 0.07} />
        ))}
      </div>
    </PageShell>
  );
}
