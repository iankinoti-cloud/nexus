import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Workflow, Clock, TrendingUp, ChevronDown, ShieldCheck, Check } from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { AIChip } from '../shared/AIChip';
import { useNexus } from '../../data/store';
import { Sheet, SheetContent } from '../ui/sheet';
import type { Enquiry, EnquiryStatus } from '../../data/types';
import { NewEnquiryModal } from './enquiries/NewEnquiryModal';
import { EnquiryDetail } from './enquiries/EnquiryDetail';

const STATUS_META: Record<EnquiryStatus, { label: string; color: string; bg: string }> = {
  new:        { label: 'New',       color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  transcript: { label: 'Transcript',color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  briefed:    { label: 'Briefed',   color: '#F472B6', bg: 'rgba(244,114,182,0.1)' },
  ideation:   { label: 'Ideation',  color: '#FFB547', bg: 'rgba(255,181,71,0.1)' },
  proposed:   { label: 'Proposed',  color: '#4FD1C5', bg: 'rgba(79,209,197,0.1)' },
  quoted:     { label: 'Quoted',    color: '#C084FC', bg: 'rgba(192,132,252,0.1)' },
  approved:   { label: 'Approved',  color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  sent:       { label: 'Sent',      color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  converted:  { label: 'Converted', color: '#22C55E', bg: 'rgba(34,197,94,0.06)' },
  lost:       { label: 'Lost',      color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

const ACTIVE_STATUSES: EnquiryStatus[] = ['transcript', 'briefed', 'ideation', 'proposed', 'quoted'];
const CLOSED_STATUSES: EnquiryStatus[] = ['approved', 'sent', 'converted', 'lost'];

function elapsed(createdAt: string, approvedAt?: string): string {
  const end = approvedAt ? new Date(approvedAt) : new Date();
  const mins = Math.floor((end.getTime() - new Date(createdAt).getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function stepsComplete(e: Enquiry): number {
  let n = 1;
  if (e.transcript) n++;
  if (e.brief) n++;
  if (e.ideation) n++;
  if (e.proposal) n++;
  if (e.quotation) n++;
  if (['approved','sent','converted'].includes(e.status)) n++;
  if (['sent','converted'].includes(e.status)) n++;
  return n;
}

function EnquiryCard({ enquiry, delay, onOpen }: { enquiry: Enquiry; delay: number; onOpen: () => void }) {
  const meta = STATUS_META[enquiry.status];
  const steps = stepsComplete(enquiry);
  const isWarm = ACTIVE_STATUSES.includes(enquiry.status) || enquiry.status === 'new';
  const elapsedStr = elapsed(enquiry.createdAt, enquiry.approvedAt);
  const elapsedMins = Math.floor((Date.now() - new Date(enquiry.createdAt).getTime()) / 60000);
  const timerColor = elapsedMins < 30 ? '#22C55E' : elapsedMins < 60 ? '#FFB547' : '#FF6B6B';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay, ease: 'easeOut' }}
      whileHover={{ y: -2, borderColor: 'rgba(var(--accent-rgb),0.25)' }}
      onClick={onOpen}
      className="rounded-xl p-5 flex flex-col gap-3 cursor-pointer"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hair)',
        transition: 'border-color 0.2s ease',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ width: 40, height: 40, background: meta.bg, color: meta.color }}
          >
            {enquiry.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', fontWeight: 600 }} className="truncate">
              {enquiry.companyName}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }} className="truncate">
              {enquiry.contactName} · {enquiry.industry}
            </div>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}
        >
          {meta.label}
        </span>
      </div>

      <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.5 }} className="line-clamp-2">
        {enquiry.serviceInterest}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: i < steps ? meta.color : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{steps}/8</span>
        </div>

        {isWarm && (
          <div className="flex items-center gap-1" style={{ color: timerColor, fontSize: 'calc(11px * var(--fs))' }}>
            <Clock size={11} />
            <span>{elapsedStr}</span>
          </div>
        )}
        {!isWarm && (
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
            {enquiry.budgetRange}
          </span>
        )}
      </div>

      {isWarm && (
        <AIChip text={`${enquiry.budgetRange} · ${enquiry.timeline}`} />
      )}
    </motion.div>
  );
}

const FILTERS = ['All', 'New', 'Active', 'Approved', 'Lost'];

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  creative_lead: 'Creative Lead',
  account_manager: 'Account Manager',
  team_member: 'Team Member',
};

// Mirrors the approval gate in EnquiryDetail: only these roles can sign off a proposal.
const CAN_APPROVE_ROLES = ['owner', 'account_manager'];

function PersonaSwitcher() {
  const { users, currentUser, setCurrentUser } = useNexus();
  const [open, setOpen] = useState(false);
  const canApprove = CAN_APPROVE_ROLES.includes(currentUser.role);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex items-center gap-2 rounded-lg px-3 py-2"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)', cursor: 'pointer' }}
        title="Switch acting persona (demo)"
      >
        <span
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 24, height: 24, background: currentUser.avatarColor, color: '#0B0B0F', fontSize: 'calc(10px * var(--fs))', fontWeight: 700 }}
        >
          {currentUser.initials}
        </span>
        <span className="flex flex-col items-start" style={{ lineHeight: 1.15 }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(9px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Acting as</span>
          <span style={{ color: 'var(--text)', fontSize: 'calc(12px * var(--fs))', fontWeight: 600 }}>{ROLE_LABELS[currentUser.role] ?? currentUser.role}</span>
        </span>
        <ChevronDown size={13} style={{ color: 'var(--text-dim)' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="glass glass-strong absolute right-0 z-50 rounded-xl overflow-hidden"
            style={{ top: 'calc(100% + 6px)', width: 244, border: '1px solid var(--hair)' }}
          >
            <div className="px-3 pt-3 pb-2" style={{ borderBottom: '1px solid var(--hair)' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Demo persona</span>
            </div>
            {users.map(u => {
              const active = u.id === currentUser.id;
              const approver = CAN_APPROVE_ROLES.includes(u.role);
              return (
                <button
                  key={u.id}
                  onMouseDown={() => { setCurrentUser(u.id); setOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5"
                  style={{ background: active ? 'rgba(var(--accent-rgb),0.08)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: 26, height: 26, background: u.avatarColor, color: '#0B0B0F', fontSize: 'calc(10px * var(--fs))', fontWeight: 700 }}
                  >
                    {u.initials}
                  </span>
                  <span className="flex-1 min-w-0 flex flex-col" style={{ lineHeight: 1.2 }}>
                    <span className="truncate" style={{ color: 'var(--text)', fontSize: 'calc(12.5px * var(--fs))', fontWeight: 500 }}>{u.name}</span>
                    <span className="flex items-center gap-1" style={{ color: approver ? '#22C55E' : 'var(--text-dim)', fontSize: 'calc(10.5px * var(--fs))' }}>
                      {approver && <ShieldCheck size={10} />}
                      {ROLE_LABELS[u.role] ?? u.role}{approver ? ' · can approve' : ''}
                    </span>
                  </span>
                  {active && <Check size={14} style={{ color: 'var(--accent)' }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EnquiriesPage() {
  const { enquiries } = useNexus();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = enquiries.filter(e => {
    const matchSearch =
      e.companyName.toLowerCase().includes(search.toLowerCase()) ||
      e.contactName.toLowerCase().includes(search.toLowerCase()) ||
      e.industry.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ||
      (filter === 'New' && e.status === 'new') ||
      (filter === 'Active' && ACTIVE_STATUSES.includes(e.status)) ||
      (filter === 'Approved' && CLOSED_STATUSES.slice(0, 3).includes(e.status)) ||
      (filter === 'Lost' && e.status === 'lost');
    return matchSearch && matchFilter;
  });

  const active = enquiries.filter(e => ACTIVE_STATUSES.includes(e.status) || e.status === 'new').length;
  const totalValue = enquiries
    .filter(e => e.quotation)
    .reduce((s, e) => s + (e.quotation?.total ?? 0), 0);

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Workflow size={18} style={{ color: 'var(--accent)' }} />
            <h1 style={{ color: 'var(--text)', fontSize: 'calc(24px * var(--fs))', fontWeight: 600 }}>
              Enquiries
            </h1>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
            {enquiries.length} total · {active} active · pipeline value ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <PersonaSwitcher />
          <motion.button
            whileHover={{ background: 'var(--accent-hover)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5"
            style={{ background: 'var(--accent)', color: '#0B0B0F', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Plus size={15} />
            New Enquiry
          </motion.button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Pipeline Value', value: `$${totalValue.toLocaleString()}`, icon: TrendingUp, color: '#C084FC' },
          { label: 'Active Enquiries', value: String(active), icon: Workflow, color: '#4FD1C5' },
          { label: 'Avg. Budget', value: enquiries.filter(e => e.quotation).length ? `$${Math.round(totalValue / enquiries.filter(e => e.quotation).length).toLocaleString()}` : '—', icon: TrendingUp, color: '#FFB547' },
          { label: '30-Min Target', value: '< 30m', icon: Clock, color: '#22C55E' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={12} style={{ color }} />
              <span style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            </div>
            <div style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: 'var(--surface)', border: '1px solid var(--hair)', maxWidth: 260 }}>
          <Search size={14} style={{ color: 'var(--text-dim)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search enquiries..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', width: '100%' }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'rgba(var(--accent-rgb),0.1)' : 'transparent',
                border: `1px solid ${filter === f ? 'rgba(var(--accent-rgb),0.3)' : 'var(--hair)'}`,
                color: filter === f ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: 'calc(12px * var(--fs))',
                fontWeight: filter === f ? 500 : 400,
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Workflow size={40} style={{ color: 'var(--text-dim)', opacity: 0.4 }} />
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(14px * var(--fs))' }}>No enquiries match your filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((e, i) => (
              <EnquiryCard key={e.id} enquiry={e} delay={i * 0.06} onOpen={() => setSelected(e)} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        <SheetContent
          side="right"
          className="p-0 overflow-hidden"
          style={{ width: 'min(100vw, 860px)', maxWidth: '100vw', background: 'var(--bg)', border: 'none', borderLeft: '1px solid var(--hair)' }}
        >
          {selected && (
            <EnquiryDetail
              enquiry={enquiries.find(e => e.id === selected.id) ?? selected}
              onClose={() => setSelected(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* New enquiry modal */}
      <NewEnquiryModal open={showNew} onClose={() => setShowNew(false)} />
    </PageShell>
  );
}
