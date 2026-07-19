import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Calendar, SlidersHorizontal } from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { RiskBadge } from '../shared/RiskBadge';
import { AIChip } from '../shared/AIChip';
import { TeamAvatarStack } from '../shared/TeamAvatarStack';
import { useNexus } from '../../data/store';
import type { Project } from '../../data/types';

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay, ease: 'easeOut' }}
      whileHover={{ borderColor: 'rgba(var(--accent-rgb),0.22)', y: -2 }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hair)',
        cursor: 'default',
        transition: 'border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{project.name}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 2 }}>{project.client}</div>
        </div>
        <RiskBadge level={project.risk} />
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span style={{ color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Progress</span>
          <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{project.progress}%</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'var(--hair)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.9, delay: delay + 0.1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: project.progress >= 80
                ? '#22C55E'
                : project.progress >= 50
                ? 'var(--accent)'
                : '#FFB547',
            }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{project.deadline}</span>
        </div>
        <TeamAvatarStack avatars={project.team} max={3} size={24} />
      </div>

      {/* Budget */}
      <div className="flex items-center justify-between">
        <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>Budget</span>
        <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>{project.budget}</span>
      </div>

      {/* AI Chip */}
      <AIChip text={project.aiRecommendation} />
    </motion.div>
  );
}

const FILTERS = ['All', 'Active', 'Review', 'At Risk', 'Completed'];

export function ProjectsPage() {
  const { projects: PROJECTS } = useNexus();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = PROJECTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' ||
      (activeFilter === 'Active' && p.status === 'active') ||
      (activeFilter === 'Review' && p.status === 'review') ||
      (activeFilter === 'At Risk' && p.status === 'at-risk') ||
      (activeFilter === 'Completed' && p.status === 'completed');
    return matchSearch && matchFilter;
  });

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--text)', fontSize: 24, fontWeight: 600 }}>Projects</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 2 }}>{PROJECTS.length} total · {PROJECTS.filter(p => p.status === 'active').length} active</p>
        </div>
        <motion.button
          whileHover={{ background: 'var(--accent-hover)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5"
          style={{
            background: 'var(--accent)',
            color: '#0B0B0F',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
        >
          <Plus size={15} />
          New Project
        </motion.button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2.5"
          style={{ background: 'var(--surface)', border: '1px solid var(--hair)', maxWidth: 280 }}
        >
          <Search size={14} style={{ color: 'var(--text-dim)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 13,
              width: '100%',
            }}
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
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 ml-auto"
          style={{ background: 'var(--surface)', border: '1px solid var(--hair)', cursor: 'pointer' }}
        >
          <SlidersHorizontal size={14} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Sort</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-5">
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={i * 0.07} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-20" style={{ color: 'var(--text-dim)' }}>
            <Search size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontSize: 14 }}>No projects match your search</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
