import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, FolderOpen, DollarSign, Clock, Activity } from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { HealthDot } from '../shared/HealthDot';
import { AIChip } from '../shared/AIChip';
import { useNexus } from '../../data/store';
import type { Client } from '../../data/types';

function ClientCard({ client, delay }: { client: Client; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay, ease: 'easeOut' }}
      whileHover={{ borderColor: 'rgba(var(--accent-rgb),0.2)', y: -2 }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hair)',
        cursor: 'default',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 44, height: 44, background: client.avatarColor + '20', border: `1px solid ${client.avatarColor}35` }}
          >
            <span style={{ color: client.avatarColor, fontSize: 15, fontWeight: 700 }}>{client.initials}</span>
          </div>
          <div>
            <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{client.name}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>{client.industry}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HealthDot score={client.healthScore} />
          <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{client.healthScore}/10</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: FolderOpen, label: 'Projects', value: client.activeProjects },
          { icon: DollarSign, label: 'Revenue', value: client.revenue },
          { icon: Clock, label: 'Last Contact', value: client.lastContact },
          { icon: Activity, label: 'Health', value: `${client.healthScore}/10` },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-lg p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={11} style={{ color: 'var(--text-dim)' }} />
              <span style={{ color: 'var(--text-dim)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            </div>
            <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Status badge */}
      {client.status === 'at-risk' && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B6B', display: 'inline-block' }} />
          <span style={{ color: '#FF6B6B', fontSize: 12 }}>Account at risk — action required</span>
        </div>
      )}

      {/* AI Follow-up */}
      <AIChip text={client.aiFollowUp} />
    </motion.div>
  );
}

const FILTERS = ['All Clients', 'Active', 'At Risk'];

export function ClientsPage() {
  const { clients: CLIENTS } = useNexus();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Clients');

  const filtered = CLIENTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All Clients' ||
      (activeFilter === 'Active' && c.status === 'active') ||
      (activeFilter === 'At Risk' && c.status === 'at-risk');
    return matchSearch && matchFilter;
  });

  const totalRevenue = '$454K';

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--text)', fontSize: 24, fontWeight: 600 }}>Clients</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 2 }}>
            {CLIENTS.length} clients · {totalRevenue} total revenue
          </p>
        </div>
        <motion.button
          whileHover={{ background: 'var(--accent-hover)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5"
          style={{ background: 'var(--accent)', color: '#0B0B0F', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          <Plus size={15} />
          Add Client
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5"
          style={{ background: 'var(--surface)', border: '1px solid var(--hair)', maxWidth: 260 }}
        >
          <Search size={14} style={{ color: 'var(--text-dim)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, width: '100%' }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? 'rgba(var(--accent-rgb),0.1)' : 'transparent',
                border: `1px solid ${activeFilter === f ? 'rgba(var(--accent-rgb),0.3)' : 'var(--hair)'}`,
                color: activeFilter === f ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: 12,
                fontWeight: activeFilter === f ? 500 : 400,
                borderRadius: 8,
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {filtered.map((client, i) => (
          <ClientCard key={client.id} client={client} delay={i * 0.07} />
        ))}
      </div>
    </PageShell>
  );
}
