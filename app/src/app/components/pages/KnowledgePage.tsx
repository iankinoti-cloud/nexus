import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Sparkles, WifiOff, FileText, Lightbulb, Users2, RefreshCw } from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { useNexus } from '../../data/store';
import { askKnowledge, type KnowledgeResult } from '../../lib/ai';
import type { KnowledgeNote } from '../../data/knowledge';

const CATEGORY_META: Record<KnowledgeNote['category'], { label: string; color: string; icon: typeof FileText }> = {
  'project-learnings': { label: 'Project Learnings', color: 'var(--accent)', icon: Lightbulb },
  'client-preferences': { label: 'Client Preferences', color: '#FFB547', icon: Users2 },
  process: { label: 'Process', color: '#22C55E', icon: RefreshCw },
  retrospective: { label: 'Retrospective', color: '#A78BFA', icon: FileText },
};

const EXAMPLE_QUERIES = [
  'What did we learn from the Titan rebranding?',
  'How do we prevent scope creep with Nexora?',
  'What are the print specs for Crest packaging?',
  'When do designers start burning out?',
];

function NoteCard({ note, highlighted, delay }: { note: KnowledgeNote; highlighted: boolean; delay: number }) {
  const meta = CATEGORY_META[note.category];
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl p-5"
      style={{
        background: highlighted ? 'rgba(var(--accent-rgb),0.05)' : 'var(--surface)',
        border: `1px solid ${highlighted ? 'rgba(var(--accent-rgb),0.35)' : 'var(--hair)'}`,
        transition: 'border-color 0.3s ease, background 0.3s ease',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center justify-center rounded-md"
          style={{ width: 24, height: 24, background: `${meta.color}1f` }}
        >
          <Icon size={12} style={{ color: meta.color }} />
        </div>
        <span style={{ color: meta.color, fontSize: 'calc(11px * var(--fs))', fontWeight: 600 }}>{meta.label}</span>
        <span className="ml-auto" style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{note.date}</span>
        {highlighted && (
          <span
            className="rounded-full px-2 py-0.5 flex items-center gap-1"
            style={{ background: 'rgba(var(--accent-rgb),0.12)', color: 'var(--accent)', fontSize: 'calc(10px * var(--fs))', fontWeight: 600 }}
          >
            <Sparkles size={9} /> SOURCE
          </span>
        )}
      </div>
      <div style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', fontWeight: 500, marginBottom: 6 }}>{note.title}</div>
      <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12.5px * var(--fs))', lineHeight: 1.6 }}>{note.content}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {note.tags.map(tag => (
          <span
            key={tag}
            className="rounded-full px-2 py-0.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--hair)', color: 'var(--text-dim)', fontSize: 'calc(10.5px * var(--fs))' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function KnowledgePage() {
  const { knowledge } = useNexus();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<KnowledgeResult | null>(null);
  const [filter, setFilter] = useState<KnowledgeNote['category'] | 'all'>('all');

  const handleSearch = async (q?: string) => {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery || searching) return;
    if (q) setQuery(q);
    setSearching(true);
    setResult(null);
    const res = await askKnowledge(finalQuery, knowledge);
    setResult(res);
    setSearching(false);
  };

  const visibleNotes = knowledge.filter(n => filter === 'all' || n.category === filter);
  const sourceSet = new Set(result?.sourceIds ?? []);
  const ordered = result
    ? [...visibleNotes].sort((a, b) => Number(sourceSet.has(b.id)) - Number(sourceSet.has(a.id)))
    : visibleNotes;

  return (
    <PageShell aura={[
      { color: '#A855F7', shape: 'circle', position: 'center', size: 1000 },
      { color: '#A855F7', shape: 'oval', position: 'top-left', size: 450, opacity: 0.10 },
    ]}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: 'rgba(var(--accent-rgb),0.12)' }}
          >
            <BookOpen size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 style={{ color: 'var(--text)', fontSize: 'calc(24px * var(--fs))', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Knowledge</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>Your organization never forgets.</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="mb-4"
      >
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--hair-2)' }}
        >
          <Search size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder='Ask organizational memory anything — e.g. "What did we learn from the Titan rebranding?"'
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: 'calc(14px * var(--fs))',
            }}
          />
          <motion.button
            whileHover={{ background: 'var(--accent-hover)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSearch()}
            className="rounded-lg px-4 py-1.5"
            style={{
              background: query.trim() ? 'var(--accent)' : 'rgba(var(--accent-rgb),0.15)',
              color: query.trim() ? '#0B0B0F' : 'var(--accent)',
              fontSize: 'calc(13px * var(--fs))', fontWeight: 600, border: 'none',
              cursor: query.trim() ? 'pointer' : 'default',
              transition: 'background 0.15s ease',
            }}
          >
            {searching ? 'Thinking…' : 'Ask'}
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {EXAMPLE_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => handleSearch(q)}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--hair-2)',
                color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', borderRadius: 20, padding: '5px 12px', cursor: 'pointer',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Answer */}
      <AnimatePresence>
        {searching && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl p-5 mb-6 flex items-center gap-3"
            style={{ background: 'rgba(var(--accent-rgb),0.04)', border: '1px solid rgba(var(--accent-rgb),0.15)' }}
          >
            {[0, 0.35, 0.7].map(delay => (
              <motion.div
                key={delay}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }}
              />
            ))}
            <span style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>Searching organizational memory…</span>
          </motion.div>
        )}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl p-5 mb-6"
            style={{
              background: 'rgba(var(--accent-rgb),0.04)',
              border: '1px solid rgba(var(--accent-rgb),0.2)',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.offline ? <WifiOff size={13} style={{ color: '#FFB547' }} /> : <Sparkles size={13} style={{ color: 'var(--accent)' }} />}
              <span style={{ color: result.offline ? '#FFB547' : 'var(--accent)', fontSize: 'calc(12px * var(--fs))', fontWeight: 600 }}>
                {result.offline ? 'Offline keyword search' : 'Core · semantic answer'}
              </span>
              {result.sourceIds.length > 0 && (
                <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
                  · {result.sourceIds.length} source{result.sourceIds.length > 1 ? 's' : ''} cited below
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{result.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'project-learnings', 'client-preferences', 'process', 'retrospective'] as const).map(cat => {
          const active = filter === cat;
          const label = cat === 'all' ? `All notes (${knowledge.length})` : CATEGORY_META[cat].label;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="rounded-lg px-3 py-1.5"
              style={{
                background: active ? 'rgba(var(--accent-rgb),0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(var(--accent-rgb),0.3)' : 'var(--hair-2)'}`,
                color: active ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: 'calc(12px * var(--fs))', fontWeight: active ? 600 : 400, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Notes grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {ordered.map((note, i) => (
          <NoteCard key={note.id} note={note} highlighted={sourceSet.has(note.id)} delay={Math.min(i * 0.05, 0.4)} />
        ))}
      </div>
    </PageShell>
  );
}
