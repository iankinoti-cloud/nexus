import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Target, Users, MessageSquare, Layers, Check, WifiOff, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useNexus } from '../../data/store';
import { streamCoreChat, checkAI, isAILive, type Recommendation } from '../../lib/ai';
import type { ChatMessage, AgentId } from '../../data/types';
import { AgentFeed } from '../shared/AgentFeed';

interface CoreChatMsg extends Omit<ChatMessage, 'recommendations'> {
  recommendations?: (Recommendation & { applied?: boolean })[];
  streaming?: boolean;
}

type AgentConfig = {
  id: AgentId;
  name: string;
  title: string;
  icon: React.ElementType;
  color: string;
  focus: string[];
  prompts: string[];
};

const AGENTS: AgentConfig[] = [
  {
    id: 'ops',
    name: 'Zara',
    title: 'Operations Command',
    icon: Target,
    color: 'var(--accent)',
    focus: ['Project risk', 'Deadlines', 'Resource allocation', 'Timeline management'],
    prompts: [
      'Which projects are at risk this week?',
      'Who is overloaded right now?',
      'Extend the Nexora deadline',
      'What should I prioritize today?',
    ],
  },
  {
    id: 'talent',
    name: 'Knox',
    title: 'Talent Intelligence',
    icon: Users,
    color: '#A855F7',
    focus: ['Team capacity', 'Burnout prevention', 'Skills matching', 'DMF recruitment'],
    prompts: [
      'Who has capacity for a new project?',
      "Check Nina's burnout risk",
      'Match a designer for Nexora project',
      'Screen DMF candidates for motion work',
    ],
  },
  {
    id: 'client',
    name: 'Mira',
    title: 'Client Success',
    icon: MessageSquare,
    color: '#10B981',
    focus: ['Client health scores', 'Follow-up timing', 'CRM records', 'Churn risk'],
    prompts: [
      'Which clients need immediate attention?',
      'Draft a follow-up for Nexora AI',
      'Which client is most at risk of churning?',
      "Review this week's client health",
    ],
  },
  {
    id: 'production',
    name: 'Axel',
    title: 'Production Control',
    icon: Layers,
    color: '#F59E0B',
    focus: ['Studio scheduling', 'Equipment allocation', 'Crew assignment', 'Shoot planning'],
    prompts: [
      'Which studio is available next week?',
      'Allocate crew for the Verdant shoot',
      'Check equipment availability',
      'Plan the Solara production schedule',
    ],
  },
];

const SEED_MESSAGES: Record<AgentId, CoreChatMsg[]> = {
  ops: [
    {
      id: 'ops-seed-1',
      role: 'core',
      content: "Operations Command online. I have live visibility across all 6 active projects, team utilization, and delivery risk. The Nexora Web Platform is currently flagged high-risk at 22% completion — scope creep is the primary concern. Ready to help you prioritize.",
      timestamp: 'Now',
      recommendations: [],
    },
  ],
  talent: [
    {
      id: 'talent-seed-1',
      role: 'core',
      content: "Talent Intelligence active. I'm monitoring 6 team members and have access to 8 vetted DMF candidates. Nina Chen is currently at 95% utilization with an 81% burnout risk — she's past the threshold. Omar Fathi and Leo Tan have the most available capacity. Ask me about skills matching, recruitment, or workload rebalancing.",
      timestamp: 'Now',
      recommendations: [],
    },
  ],
  client: [
    {
      id: 'client-seed-1',
      role: 'core',
      content: "Client Success ready. I'm tracking 6 client relationships. Nexora AI has the weakest health signal right now — scope dispute creating friction. Titan Ventures is your strongest relationship at 9.1 health. I can draft follow-ups, flag churn risk, or help you prepare for client conversations.",
      timestamp: 'Now',
      recommendations: [],
    },
  ],
  production: [
    {
      id: 'production-seed-1',
      role: 'core',
      content: "Production Control online. I have visibility across 3 studio spaces and 3 equipment packages. Verdant Foods campaign is in review phase — a shoot window may be needed soon. I can help schedule studio time, allocate crew, or plan production logistics for any active project.",
      timestamp: 'Now',
      recommendations: [],
    },
  ],
};

const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

function AgentTabBar({
  active,
  onChange,
}: {
  active: AgentId;
  onChange: (id: AgentId) => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--hair)' }}>
      {AGENTS.map(agent => {
        const Icon = agent.icon;
        const isActive = active === agent.id;
        return (
          <motion.button
            key={agent.id}
            onClick={() => onChange(agent.id)}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all"
            style={{
              background: isActive ? 'var(--surface)' : 'transparent',
              border: isActive ? `1px solid ${agent.color}30` : '1px solid transparent',
              color: isActive ? agent.color : 'var(--text-dim)',
              fontSize: 'calc(12px * var(--fs))',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              boxShadow: isActive ? `0 0 12px ${agent.color}15` : 'none',
            }}
          >
            <Icon size={13} />
            <span className="hidden sm:block">{agent.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function AgentIdentityCard({ agent }: { agent: AgentConfig }) {
  return (
    <motion.div
      key={agent.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl p-4 mb-4"
      style={{
        background: `linear-gradient(135deg, ${agent.color}08, ${agent.color}04)`,
        border: `1px solid ${agent.color}25`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 36, height: 36, background: `${agent.color}18` }}
        >
          <agent.icon size={16} style={{ color: agent.color }} />
        </div>
        <div>
          <div style={{ color: agent.color, fontSize: 'calc(14px * var(--fs))', fontWeight: 700 }}>{agent.name}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{agent.title}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {agent.focus.map(f => (
          <span
            key={f}
            className="rounded-full px-2.5 py-1"
            style={{
              background: `${agent.color}12`,
              border: `1px solid ${agent.color}22`,
              color: 'var(--text-dim)',
              fontSize: 'calc(11px * var(--fs))',
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function HandoffCard({
  rec,
  applied,
  onRoute,
}: {
  rec: Recommendation & { applied?: boolean };
  onRoute: () => void;
}) {
  const toAgent = AGENTS.find(a => a.id === (rec.action as { toAgent: AgentId }).toAgent);
  if (!toAgent) return null;
  return (
    <div
      className="rounded-lg p-3 flex items-start gap-3"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px dashed var(--hair-2)',
      }}
    >
      <ArrowRight size={14} style={{ color: toAgent.color, marginTop: 2, flexShrink: 0 }} />
      <div className="flex-1">
        <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500, marginBottom: 3 }}>{rec.title}</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.5, marginBottom: 10 }}>{rec.description}</div>
        <motion.button
          whileHover={rec.applied ? {} : { background: `${toAgent.color}18` }}
          whileTap={rec.applied ? {} : { scale: 0.97 }}
          onClick={() => !rec.applied && onRoute()}
          className="rounded-lg py-1.5 px-3 flex items-center gap-2"
          style={{
            background: rec.applied ? 'rgba(34,197,94,0.08)' : `${toAgent.color}10`,
            border: `1px solid ${rec.applied ? 'rgba(34,197,94,0.25)' : toAgent.color + '30'}`,
            color: rec.applied ? '#22C55E' : toAgent.color,
            fontSize: 'calc(12px * var(--fs))',
            fontWeight: 500,
            cursor: rec.applied ? 'default' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {rec.applied ? <Check size={12} /> : <toAgent.icon size={12} />}
          {rec.applied ? 'Routed' : `Route to ${toAgent.name} →`}
        </motion.button>
      </div>
    </div>
  );
}

function CoreMessage({
  msg,
  agent,
  onApply,
  onHandoff,
}: {
  msg: CoreChatMsg;
  agent: AgentConfig;
  onApply: (msgId: string, recIndex: number) => void;
  onHandoff: (toAgent: AgentId, reason: string, msgId: string, recIndex: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start"
    >
      <div className="max-w-[600px] w-full">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 24, height: 24, background: `${agent.color}20` }}
          >
            <agent.icon size={12} style={{ color: agent.color }} />
          </div>
          <span style={{ color: agent.color, fontSize: 'calc(12px * var(--fs))', fontWeight: 600 }}>{agent.name}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{msg.timestamp}</span>
        </div>
        <div
          className="rounded-xl p-4"
          style={{
            background: `${agent.color}06`,
            border: `1px solid ${agent.color}20`,
            borderLeft: `3px solid ${agent.color}`,
          }}
        >
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(14px * var(--fs))', marginBottom: msg.recommendations?.length ? 14 : 0, whiteSpace: 'pre-wrap' }}>
            {msg.content}
            {msg.streaming && <span className="animate-pulse" style={{ color: agent.color }}>▍</span>}
          </p>
          {!!msg.recommendations?.length && (
            <div className="flex flex-col gap-2">
              {msg.recommendations.map((rec, i) => {
                if (rec.action?.type === 'handoff') {
                  return (
                    <HandoffCard
                      key={i}
                      rec={rec}
                      applied={rec.applied}
                      onRoute={() => onHandoff((rec.action as { toAgent: AgentId }).toAgent, rec.description, msg.id, i)}
                    />
                  );
                }
                return (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--hair)' }}
                  >
                    <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 500, marginBottom: 4 }}>{rec.title}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.5, marginBottom: rec.action && rec.action.type !== 'none' ? 10 : 0 }}>
                      {rec.description}
                    </div>
                    {rec.action && rec.action.type !== 'none' && (
                      <motion.button
                        whileHover={rec.applied ? {} : { background: `${agent.color}18` }}
                        whileTap={rec.applied ? {} : { scale: 0.97 }}
                        onClick={() => !rec.applied && onApply(msg.id, i)}
                        className="rounded-lg py-1.5 px-3 flex items-center gap-2"
                        style={{
                          background: rec.applied ? 'rgba(34,197,94,0.08)' : `${agent.color}10`,
                          border: `1px solid ${rec.applied ? 'rgba(34,197,94,0.25)' : agent.color + '28'}`,
                          color: rec.applied ? '#22C55E' : agent.color,
                          fontSize: 'calc(12px * var(--fs))',
                          fontWeight: 500,
                          cursor: rec.applied ? 'default' : 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {rec.applied ? <Check size={12} /> : <Sparkles size={12} />}
                        {rec.applied ? 'Applied' : 'Apply Recommendation'}
                      </motion.button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function UserMessage({ msg }: { msg: CoreChatMsg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-end"
    >
      <div
        className="rounded-xl px-4 py-3 max-w-[520px]"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--hair-2)', color: 'var(--text)', fontSize: 'calc(14px * var(--fs))' }}
      >
        {msg.content}
        <div style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))', marginTop: 4, textAlign: 'right' }}>{msg.timestamp}</div>
      </div>
    </motion.div>
  );
}

export function CorePage() {
  const nexus = useNexus();
  const [activeAgent, setActiveAgent] = useState<AgentId>('ops');
  const [histories, setHistories] = useState<Record<AgentId, CoreChatMsg[]>>({
    ops: SEED_MESSAGES.ops,
    talent: SEED_MESSAGES.talent,
    client: SEED_MESSAGES.client,
    production: SEED_MESSAGES.production,
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<boolean | null>(isAILive());
  const bottomRef = useRef<HTMLDivElement>(null);

  const agent = AGENTS.find(a => a.id === activeAgent)!;
  const messages = histories[activeAgent];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    checkAI().then(setAiStatus);
  }, []);

  useEffect(() => {
    setInput('');
  }, [activeAgent]);

  const patchHistory = useCallback((agentId: AgentId, updater: (msgs: CoreChatMsg[]) => CoreChatMsg[]) => {
    setHistories(prev => ({ ...prev, [agentId]: updater(prev[agentId]) }));
  }, []);

  const handleApply = (msgId: string, recIndex: number) => {
    const msg = messages.find(m => m.id === msgId);
    const rec = msg?.recommendations?.[recIndex];
    if (!rec?.action) return;
    const label = nexus.applyAction(rec.action);
    if (label) {
      patchHistory(activeAgent, msgs =>
        msgs.map(m =>
          m.id === msgId
            ? { ...m, recommendations: m.recommendations?.map((r, i) => (i === recIndex ? { ...r, applied: true } : r)) }
            : m,
        ),
      );
      toast.success(label, { description: 'Workspace updated.' });
      nexus.logAgentEvent({ type: 'action', agent: activeAgent, label: `${agent.name}: ${rec.action.type}()`, timestamp: now() });
      if (rec.action.type === 'contact_client' && rec.action.draft) {
        toast.message('Draft prepared', { description: rec.action.draft, duration: 8000 });
      }
    } else {
      toast.error('Could not apply — entity not found in workspace.');
    }
  };

  const handleHandoff = (toAgent: AgentId, reason: string, msgId: string, recIndex: number) => {
    patchHistory(activeAgent, msgs =>
      msgs.map(m =>
        m.id === msgId
          ? { ...m, recommendations: m.recommendations?.map((r, i) => (i === recIndex ? { ...r, applied: true } : r)) }
          : m,
      ),
    );
    const fromAgentName = agent.name;
    const toAgentConfig = AGENTS.find(a => a.id === toAgent)!;
    toast.success(`Routing to ${toAgentConfig.name}`, { description: reason });
    nexus.logAgentEvent({ type: 'handoff', agent: activeAgent, toAgent, label: `${fromAgentName} → ${toAgentConfig.name}: ${reason.slice(0, 50)}`, timestamp: now() });
    const handoffMsg: CoreChatMsg = {
      id: `handoff-${Date.now()}`,
      role: 'user',
      content: `[Routed from ${fromAgentName}] ${reason}`,
      timestamp: now(),
    };
    patchHistory(toAgent, msgs => [...msgs, handoffMsg]);
    setActiveAgent(toAgent);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: CoreChatMsg = { id: `m${Date.now()}`, role: 'user', content: input, timestamp: now() };
    const currentHistory = [...messages, userMsg].slice(-12).map(m => ({ role: m.role as 'user' | 'core', content: m.content }));
    patchHistory(activeAgent, msgs => [...msgs, userMsg]);
    setInput('');
    setIsTyping(true);

    const coreId = `m${Date.now() + 1}`;
    let placeholderShown = false;
    const showDelta = (text: string) => {
      setIsTyping(false);
      if (!placeholderShown) {
        placeholderShown = true;
        patchHistory(activeAgent, msgs => [...msgs, { id: coreId, role: 'core', content: text, timestamp: now(), streaming: true }]);
      } else {
        patchHistory(activeAgent, msgs => msgs.map(m => (m.id === coreId ? { ...m, content: text } : m)));
      }
    };

    const reply = await streamCoreChat(currentHistory, nexus.contextSnapshot(), showDelta, activeAgent);
    setAiStatus(isAILive());
    setIsTyping(false);
    nexus.logAgentEvent({ type: 'message', agent: activeAgent, label: `${agent.name} responded${reply.recommendations.length > 0 ? ` · ${reply.recommendations.length} rec${reply.recommendations.length > 1 ? 's' : ''}` : ''}`, timestamp: now() });
    patchHistory(activeAgent, msgs => {
      const finalMsg: CoreChatMsg = {
        id: coreId,
        role: 'core',
        content: reply.text,
        timestamp: now(),
        recommendations: reply.recommendations,
        streaming: false,
      };
      return placeholderShown ? msgs.map(m => (m.id === coreId ? finalMsg : m)) : [...msgs, finalMsg];
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex items-center justify-between px-6 py-4 flex-wrap gap-3"
        style={{ borderBottom: '1px solid var(--hair)', background: 'var(--surface)' }}
      >
        <div style={{ color: 'var(--text)', fontSize: 'calc(15px * var(--fs))', fontWeight: 700 }}>NEXUS AGENTS</div>
        <div className="flex items-center gap-3">
          <AgentTabBar active={activeAgent} onChange={setActiveAgent} />
          {aiStatus === false && (
            <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,181,71,0.08)', border: '1px solid rgba(255,181,71,0.2)' }}>
              <WifiOff size={11} style={{ color: '#FFB547' }} />
              <span style={{ color: '#FFB547', fontSize: 'calc(11px * var(--fs))' }}>Offline</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-[800px] mx-auto flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <AgentIdentityCard key={activeAgent} agent={agent} />
          </AnimatePresence>

          {messages.map(msg =>
            msg.role === 'user'
              ? <UserMessage key={msg.id} msg={msg} />
              : (
                <CoreMessage
                  key={msg.id}
                  msg={msg}
                  agent={agent}
                  onApply={handleApply}
                  onHandoff={handleHandoff}
                />
              ),
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: 24, height: 24, background: `${agent.color}20` }}
              >
                <agent.icon size={12} style={{ color: agent.color }} />
              </div>
              <div
                className="rounded-xl px-4 py-3"
                style={{ background: `${agent.color}06`, border: `1px solid ${agent.color}20`, borderLeft: `3px solid ${agent.color}` }}
              >
                <div className="flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map(delay => (
                    <motion.div
                      key={delay}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: agent.color, opacity: 0.7 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggested prompts */}
      <AnimatePresence>
        {input === '' && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="px-6 pb-3"
          >
            <div className="max-w-[800px] mx-auto flex flex-wrap gap-2">
              {agent.prompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--hair-2)',
                    color: 'var(--text-dim)',
                    fontSize: 'calc(12px * var(--fs))',
                    borderRadius: 20,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.background = `${agent.color}12`;
                    (e.target as HTMLButtonElement).style.borderColor = `${agent.color}30`;
                    (e.target as HTMLButtonElement).style.color = agent.color;
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.target as HTMLButtonElement).style.borderColor = 'var(--hair-2)';
                    (e.target as HTMLButtonElement).style.color = 'var(--text-dim)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Activity Feed */}
      <div className="px-6 pb-0" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[800px] mx-auto pb-3">
          <AgentFeed />
        </div>
      </div>

      {/* Input */}
      <div className="px-6 pb-6" style={{ borderTop: '1px solid var(--hair)', paddingTop: 14, background: 'var(--bg)' }}>
        <div className="max-w-[800px] mx-auto">
          <div
            className="flex items-end gap-3 rounded-xl p-3"
            style={{ background: 'var(--surface)', border: `1px solid ${input.trim() ? agent.color + '30' : 'var(--hair-2)'}`, transition: 'border-color 0.2s ease' }}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agent.name} anything...`}
              rows={2}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: 'calc(14px * var(--fs))',
                resize: 'none',
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
            <div className="flex items-center gap-2 shrink-0">
              <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>⌘ Enter</span>
              <motion.button
                whileHover={{ opacity: 0.85 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 36,
                  height: 36,
                  background: input.trim() ? agent.color : `${agent.color}20`,
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'background 0.15s ease',
                }}
              >
                <Send size={15} style={{ color: input.trim() ? '#0B0B0F' : agent.color, opacity: input.trim() ? 1 : 0.4 }} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
