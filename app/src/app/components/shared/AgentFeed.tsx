import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageSquare, Zap } from 'lucide-react';
import { useNexus } from '../../data/store';
import type { AgentId } from '../../data/types';

const AGENT_META: Record<AgentId, { name: string; color: string }> = {
  ops:        { name: 'Zara',  color: 'var(--accent)' },
  talent:     { name: 'Knox',  color: '#A855F7' },
  client:     { name: 'Mira',  color: '#10B981' },
  production: { name: 'Axel',  color: '#F59E0B' },
};

function EventRow({ event }: { event: { id: string; type: 'message' | 'handoff' | 'action'; agent: AgentId; toAgent?: AgentId; label: string; timestamp: string } }) {
  const from = AGENT_META[event.agent];
  const to = event.toAgent ? AGENT_META[event.toAgent] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2.5 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Type icon */}
      <div className="shrink-0" style={{ color: event.type === 'handoff' ? to?.color ?? from.color : from.color }}>
        {event.type === 'handoff' ? <ArrowRight size={12} /> : event.type === 'action' ? <Zap size={12} /> : <MessageSquare size={12} />}
      </div>

      {/* Agent chip */}
      <span
        className="rounded px-1.5 py-0.5 text-xs font-semibold shrink-0"
        style={{ background: `${from.color}18`, color: from.color }}
      >
        {from.name}
      </span>

      {/* Handoff arrow + target */}
      {event.type === 'handoff' && to && (
        <>
          <ArrowRight size={10} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <span
            className="rounded px-1.5 py-0.5 text-xs font-semibold shrink-0"
            style={{ background: `${to.color}18`, color: to.color }}
          >
            {to.name}
          </span>
        </>
      )}

      {/* Label */}
      <span className="flex-1 min-w-0 truncate" style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
        {event.type === 'handoff'
          ? event.label.split(':').slice(1).join(':').trim() || event.label
          : event.label}
      </span>

      {/* Timestamp */}
      <span className="shrink-0" style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', opacity: 0.6 }}>
        {event.timestamp}
      </span>
    </motion.div>
  );
}

export function AgentFeed() {
  const { agentEvents, clearAgentEvents } = useNexus();
  const visible = agentEvents.slice(0, 15);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hair)', background: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--hair)' }}>
        <div className="flex items-center gap-2">
          <div className="rounded-full" style={{ width: 6, height: 6, background: agentEvents.length > 0 ? '#22C55E' : 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text)', fontSize: 'calc(11px * var(--fs))', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Agent Activity
          </span>
          {agentEvents.length > 0 && (
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 16, height: 16, background: 'rgba(var(--accent-rgb),0.15)', color: 'var(--accent)', fontSize: 9, fontWeight: 700 }}
            >
              {agentEvents.length}
            </span>
          )}
        </div>
        {agentEvents.length > 0 && (
          <button
            onClick={clearAgentEvents}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Feed */}
      <div className="overflow-y-auto px-4" style={{ maxHeight: 220 }}>
        {visible.length === 0 ? (
          <div className="flex items-center justify-center py-6" style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>
            No agent activity yet — start a conversation above
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {visible.map(ev => <EventRow key={ev.id} event={ev} />)}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
