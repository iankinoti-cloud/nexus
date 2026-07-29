import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, MapPin, DollarSign, Briefcase, Users, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DMF_CANDIDATES } from '../../data/mockData';
import { useNexus } from '../../data/store';
import type { DmfCandidate } from '../../data/types';

const SKILL_FILTERS = ['All', 'Brand Identity', 'Motion', 'UI/UX', 'Strategy', 'Illustration', 'Production'];

const AVAIL_COLORS: Record<DmfCandidate['availability'], { bg: string; text: string; label: string }> = {
  available: { bg: 'rgba(34,197,94,0.1)', text: '#22C55E', label: 'Available' },
  busy: { bg: 'rgba(255,181,71,0.1)', text: '#FFB547', label: 'Busy' },
  'contract-ending': { bg: 'rgba(96,165,250,0.1)', text: '#60A5FA', label: 'Contract Ending' },
};

function CandidateCard({
  candidate,
  shortlisted,
  onShortlist,
}: {
  candidate: DmfCandidate;
  shortlisted: boolean;
  onShortlist: () => void;
}) {
  const avail = AVAIL_COLORS[candidate.availability];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: 'var(--surface)',
        border: shortlisted ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--hair)',
        boxShadow: shortlisted ? '0 0 14px rgba(34,197,94,0.06)' : 'none',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl text-sm font-bold shrink-0"
            style={{ width: 44, height: 44, background: candidate.avatarColor + '22', color: candidate.avatarColor, fontSize: 'calc(13px * var(--fs))' }}
          >
            {candidate.initials}
          </div>
          <div>
            <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 'calc(14px * var(--fs))' }}>{candidate.name}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>{candidate.primaryRole}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
          <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: 'calc(13px * var(--fs))' }}>{candidate.dmfRating}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>DMF</span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {candidate.skills.map(s => (
          <span
            key={s}
            className="rounded-full px-2.5 py-0.5"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--hair)',
              color: 'var(--text-dim)',
              fontSize: 'calc(11px * var(--fs))',
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <MapPin size={11} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{candidate.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={11} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{candidate.experience}y exp</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign size={11} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>${candidate.dayRate}/day</span>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 ml-auto"
          style={{ background: avail.bg, color: avail.text, fontSize: 'calc(11px * var(--fs))', fontWeight: 500 }}
        >
          {avail.label}
        </span>
      </div>

      {/* Last project */}
      <div
        className="rounded-lg px-3 py-2"
        style={{ background: 'var(--surface-2)', borderLeft: '2px solid var(--hair-2)' }}
      >
        <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>Last: </span>
        <span style={{ color: 'var(--text)', fontSize: 'calc(11px * var(--fs))' }}>{candidate.lastProject}</span>
      </div>

      {/* Action */}
      <motion.button
        whileHover={shortlisted ? {} : { background: 'rgba(34,197,94,0.1)' }}
        whileTap={shortlisted ? {} : { scale: 0.97 }}
        onClick={() => !shortlisted && onShortlist()}
        className="rounded-lg py-2 px-4 flex items-center justify-center gap-2"
        style={{
          background: shortlisted ? 'rgba(34,197,94,0.08)' : 'rgba(var(--accent-rgb),0.07)',
          border: `1px solid ${shortlisted ? 'rgba(34,197,94,0.3)' : 'rgba(var(--accent-rgb),0.2)'}`,
          color: shortlisted ? '#22C55E' : 'var(--accent)',
          fontSize: 'calc(12px * var(--fs))',
          fontWeight: 500,
          cursor: shortlisted ? 'default' : 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {shortlisted ? <CheckCircle size={13} /> : <Sparkles size={13} />}
        {shortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
      </motion.button>
    </motion.div>
  );
}

export function TalentPoolPage() {
  const nexus = useNexus();
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState<'all' | DmfCandidate['availability']>('all');

  const filtered = DMF_CANDIDATES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.primaryRole.toLowerCase().includes(q) || c.skills.some(s => s.toLowerCase().includes(q));
    const matchSkill = skillFilter === 'All' || c.skills.some(s => s.includes(skillFilter));
    const matchAvail = availFilter === 'all' || c.availability === availFilter;
    return matchSearch && matchSkill && matchAvail;
  });

  const handleShortlist = (candidate: DmfCandidate) => {
    nexus.shortlistCandidate(candidate.id);
    toast.success(`${candidate.name} shortlisted`, {
      description: 'Knox (Talent Agent) has logged this candidate for project matching.',
    });
  };

  const shortlistedCount = nexus.shortlistedCandidates.length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="px-8 pt-7 pb-5"
        style={{ borderBottom: '1px solid var(--hair)' }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={18} style={{ color: '#A855F7' }} />
              <h1 style={{ color: 'var(--text)', fontSize: 'calc(22px * var(--fs))', fontWeight: 700 }}>DMF Talent Pool</h1>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
              {DMF_CANDIDATES.length} vetted creative professionals from the DMF database
            </p>
          </div>
          {shortlistedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl px-4 py-3 flex items-center gap-2"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <CheckCircle size={14} style={{ color: '#22C55E' }} />
              <span style={{ color: '#22C55E', fontWeight: 600, fontSize: 'calc(13px * var(--fs))' }}>
                {shortlistedCount} shortlisted
              </span>
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-1"
            style={{ background: 'var(--surface)', border: '1px solid var(--hair-2)' }}
          >
            <Search size={14} style={{ color: 'var(--text-dim)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, role, or skill..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: 'calc(13px * var(--fs))',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <select
            value={availFilter}
            onChange={e => setAvailFilter(e.target.value as typeof availFilter)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--hair-2)',
              borderRadius: 12,
              color: 'var(--text)',
              fontSize: 'calc(12px * var(--fs))',
              padding: '10px 14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="contract-ending">Contract Ending</option>
            <option value="busy">Busy</option>
          </select>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SKILL_FILTERS.map(skill => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              style={{
                background: skillFilter === skill ? 'rgba(168,85,247,0.12)' : 'var(--surface)',
                border: skillFilter === skill ? '1px solid rgba(168,85,247,0.3)' : '1px solid var(--hair)',
                color: skillFilter === skill ? '#A855F7' : 'var(--text-dim)',
                borderRadius: 20,
                padding: '5px 14px',
                fontSize: 'calc(12px * var(--fs))',
                cursor: 'pointer',
                fontWeight: skillFilter === skill ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {skill}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="px-8 py-6">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
              style={{ color: 'var(--text-dim)', fontSize: 'calc(14px * var(--fs))' }}
            >
              No candidates match your filters.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <CandidateCard
                    candidate={c}
                    shortlisted={nexus.shortlistedCandidates.includes(c.id)}
                    onShortlist={() => handleShortlist(c)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
