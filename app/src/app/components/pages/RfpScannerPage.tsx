import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSearch, RefreshCw, X, ChevronRight, Clock, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useNexus } from '../../data/store';
import type { RfpTender, RfpStatus } from '../../data/types';

const STATUS_META: Record<RfpStatus, { label: string; color: string; bg: string }> = {
  new:        { label: 'New',        color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  reviewing:  { label: 'Reviewing',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  shortlisted:{ label: 'Shortlisted',color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
  submitted:  { label: 'Submitted',  color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  won:        { label: 'Won',        color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  lost:       { label: 'Lost',       color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

const FILTER_TABS: { key: RfpStatus | 'all'; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'new',        label: 'New' },
  { key: 'reviewing',  label: 'Reviewing' },
  { key: 'shortlisted',label: 'Shortlisted' },
  { key: 'submitted',  label: 'Submitted' },
];

function fitColor(score: number): string {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#F59E0B';
  return '#6B7280';
}

function deadlineUrgency(deadline: string): 'critical' | 'warn' | null {
  const d = new Date(`${deadline} 2026`);
  const diff = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (diff <= 7) return 'critical';
  if (diff <= 14) return 'warn';
  return null;
}

function TenderCard({ tender, onClick }: { tender: RfpTender; onClick: () => void }) {
  const sm = STATUS_META[tender.status];
  const urgency = deadlineUrgency(tender.submissionDeadline);
  const fc = fitColor(tender.fitScore);

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)' }}
      onClick={onClick}
      className="rounded-xl p-5 cursor-pointer"
      style={{ background: 'var(--surface)', border: '1px solid var(--hair)', transition: 'border-color 0.15s' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate" style={{ color: 'var(--text)', fontSize: 'calc(13.5px * var(--fs))' }}>{tender.title}</p>
          <p className="mt-0.5 truncate" style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>{tender.issuer}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: `${fc}18`, color: fc, border: `1px solid ${fc}30` }}
          >
            {tender.fitScore}% fit
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ background: sm.bg, color: sm.color }}
          >
            {sm.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3" style={{ fontSize: 'calc(12px * var(--fs))' }}>
        <span style={{ color: 'var(--text-dim)' }}>{tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}</span>
        <span style={{ color: 'var(--text-dim)', textTransform: 'capitalize' }}>{tender.source}</span>
        <span className="font-medium" style={{ color: 'var(--text)' }}>{tender.estimatedValue}</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="italic truncate flex-1 mr-3" style={{ color: 'var(--text-dim)', fontSize: 'calc(11.5px * var(--fs))' }}>
          {tender.aiRecommendation}
        </p>
        <span
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs shrink-0"
          style={{
            background: urgency === 'critical' ? 'rgba(239,68,68,0.12)' : urgency === 'warn' ? 'rgba(245,158,11,0.12)' : 'var(--surface-2, rgba(255,255,255,0.04))',
            color: urgency === 'critical' ? '#EF4444' : urgency === 'warn' ? '#F59E0B' : 'var(--text-dim)',
          }}
        >
          {urgency && <AlertTriangle size={10} />}
          {tender.submissionDeadline}
        </span>
      </div>
    </motion.div>
  );
}

function TenderDetailSheet({ tender, onClose }: { tender: RfpTender; onClose: () => void }) {
  const { updateRfpStatus } = useNexus();
  const sm = STATUS_META[tender.status];
  const fc = fitColor(tender.fitScore);

  const nextActions: { label: string; status: RfpStatus }[] = [
    { label: 'Mark Reviewing', status: 'reviewing' },
    { label: 'Shortlist', status: 'shortlisted' },
    { label: 'Mark Submitted', status: 'submitted' },
  ].filter(a => a.status !== tender.status);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      className="fixed top-0 right-0 h-full flex flex-col overflow-y-auto"
      style={{ width: 480, background: 'var(--bg)', borderLeft: '1px solid var(--hair)', zIndex: 50, boxShadow: '-12px 0 40px rgba(0,0,0,0.5)' }}
    >
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--hair)' }}>
        <div>
          <p className="font-bold" style={{ color: 'var(--text)', fontSize: 'calc(15px * var(--fs))' }}>{tender.title}</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>{tender.issuer}</p>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}>
          <X size={18} />
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Fit Score', value: `${tender.fitScore}%`, color: fc },
            { label: 'Est. Value', value: tender.estimatedValue, color: 'var(--text)' },
            { label: 'Deadline', value: tender.submissionDeadline, color: deadlineUrgency(tender.submissionDeadline) === 'critical' ? '#EF4444' : 'var(--text)' },
          ].map(m => (
            <div key={m.label} className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}>
              <p style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</p>
              <p className="font-bold mt-1" style={{ color: m.color, fontSize: 'calc(13px * var(--fs))' }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Status + source */}
        <div className="flex items-center gap-3">
          <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
          <span className="text-xs capitalize" style={{ color: 'var(--text-dim)' }}>{tender.source} · {tender.category}</span>
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Published {tender.publishedAt}</span>
        </div>

        {/* AI recommendation */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(var(--accent-rgb),0.06)', border: '1px solid rgba(var(--accent-rgb),0.2)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Recommendation</p>
          <p style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.6 }}>{tender.aiRecommendation}</p>
        </div>

        {/* Requirements */}
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Requirements</p>
          <div className="flex flex-col gap-2">
            {tender.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="rounded-full mt-1.5 shrink-0" style={{ width: 5, height: 5, background: 'var(--accent)' }} />
                <p style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.5 }}>{req}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {nextActions.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</p>
            <div className="flex flex-col gap-2">
              {nextActions.map(a => (
                <button
                  key={a.status}
                  onClick={() => { updateRfpStatus(tender.id, a.status); toast.success(`${tender.title} → ${a.label}`); onClose(); }}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: 'var(--surface)', border: '1px solid var(--hair)', cursor: 'pointer', color: 'var(--text)', fontSize: 'calc(13px * var(--fs))' }}
                >
                  {a.label}
                  <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Mock tender injected on "Scan for Tenders"
const NEW_TENDER_SEED: RfpTender = {
  id: 'rfp-scan-1',
  title: 'East Africa Fashion Week — Brand & Digital',
  issuer: 'EAF Week Organising Committee',
  category: 'branding',
  estimatedValue: '$75K–$110K',
  submissionDeadline: 'Aug 28, 2026',
  publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  status: 'new',
  fitScore: 88,
  source: 'private',
  aiRecommendation: 'Excellent emerging-market fit. Fashion & lifestyle is in your sweet spot.',
  requirements: ['Event identity system', 'Social media toolkit', 'Digital campaign', 'Runway show motion graphics'],
};

export function RfpScannerPage() {
  const { rfpTenders, updateRfpStatus } = useNexus();
  const [localTenders, setLocalTenders] = useState<RfpTender[]>(rfpTenders);
  const [filter, setFilter] = useState<RfpStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<RfpTender | null>(null);
  const [scanning, setScanning] = useState(false);

  const displayed = localTenders
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => {
      const q = search.toLowerCase();
      return !q || t.title.toLowerCase().includes(q) || t.issuer.toLowerCase().includes(q) || t.category.includes(q);
    });

  const totalValue = localTenders.reduce((acc, t) => {
    const m = t.estimatedValue.match(/\$(\d+)K/);
    return acc + (m ? parseInt(m[1]) * 1000 : 0);
  }, 0);
  const avgFit = Math.round(localTenders.reduce((a, t) => a + t.fitScore, 0) / (localTenders.length || 1));
  const expiringSoon = localTenders.filter(t => deadlineUrgency(t.submissionDeadline) !== null).length;

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      if (!localTenders.find(t => t.id === NEW_TENDER_SEED.id)) {
        setLocalTenders(prev => [{ ...NEW_TENDER_SEED }, ...prev]);
        toast.success('New tender found: East Africa Fashion Week');
      } else {
        toast('No new tenders found at this time.');
      }
      setScanning(false);
    }, 1800);
  };

  const handleStatusUpdate = (id: string, status: RfpStatus) => {
    setLocalTenders(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    updateRfpStatus(id, status);
  };

  return (
    <div className="flex flex-col h-full" style={{ padding: '28px 28px 0' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: 'rgba(var(--accent-rgb),0.12)' }}>
            <FileSearch size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 style={{ color: 'var(--text)', fontSize: 'calc(20px * var(--fs))', fontWeight: 700 }}>RFP Scanner</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>AI-matched tender & RFQ opportunities</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleScan}
          disabled={scanning}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{ background: 'rgba(var(--accent-rgb),0.12)', border: '1px solid rgba(var(--accent-rgb),0.3)', color: 'var(--accent)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500, cursor: scanning ? 'wait' : 'pointer' }}
        >
          <motion.div animate={{ rotate: scanning ? 360 : 0 }} transition={{ duration: 1, repeat: scanning ? Infinity : 0, ease: 'linear' }}>
            <RefreshCw size={14} />
          </motion.div>
          {scanning ? 'Scanning…' : 'Scan for Tenders'}
        </motion.button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: <FileSearch size={14} />, label: 'Total Tenders', value: localTenders.length, color: 'var(--accent)' },
          { icon: <DollarSign size={14} />, label: 'Pipeline Value', value: `$${Math.round(totalValue / 1000)}K+`, color: '#22C55E' },
          { icon: <TrendingUp size={14} />, label: 'Avg Fit Score', value: `${avgFit}%`, color: '#A855F7' },
          { icon: <Clock size={14} />, label: 'Expiring Soon', value: expiringSoon, color: expiringSoon > 0 ? '#EF4444' : 'var(--text-dim)' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: k.color }}>{k.icon}<span style={{ fontSize: 'calc(10px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)' }}>{k.label}</span></div>
            <p className="font-bold" style={{ color: k.color, fontSize: 'calc(22px * var(--fs))' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tenders, issuers, categories…"
          className="flex-1 rounded-xl px-4 py-2.5 outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--hair)', color: 'var(--text)', fontSize: 'calc(13px * var(--fs))' }}
        />
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}>
          {FILTER_TABS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: filter === f.key ? 'rgba(var(--accent-rgb),0.15)' : 'transparent',
                color: filter === f.key ? 'var(--accent)' : 'var(--text-dim)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tender List */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--text-dim)' }}>
                <FileSearch size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 'calc(13px * var(--fs))' }}>No tenders match your filters.</p>
              </div>
            ) : displayed.map(tender => (
              <motion.div
                key={tender.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <TenderCard
                  tender={tender}
                  onClick={() => setSelected(tender)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Sheet */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0"
              style={{ background: 'rgba(0,0,0,0.4)', zIndex: 49 }}
            />
            <TenderDetailSheet
              tender={{ ...selected, status: localTenders.find(t => t.id === selected.id)?.status ?? selected.status }}
              onClose={() => setSelected(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
