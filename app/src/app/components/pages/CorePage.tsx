import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Cpu, Sparkles, Check, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { CHAT_MESSAGES, SUGGESTED_PROMPTS } from '../../data/mockData';
import { useNexus } from '../../data/store';
import { streamCoreChat, checkAI, isAILive, type Recommendation } from '../../lib/ai';
import type { ChatMessage } from '../../data/types';

interface CoreChatMsg extends Omit<ChatMessage, 'recommendations'> {
  recommendations?: (Recommendation & { applied?: boolean })[];
  streaming?: boolean;
}

const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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
        style={{ background: '#1E1E26', border: '1px solid rgba(255,255,255,0.08)', color: '#F4F4F5', fontSize: 14 }}
      >
        {msg.content}
        <div style={{ color: '#A1A1AA', fontSize: 11, marginTop: 4, textAlign: 'right' }}>{msg.timestamp}</div>
      </div>
    </motion.div>
  );
}

function CoreMessage({ msg, onApply }: { msg: CoreChatMsg; onApply: (msgId: string, recIndex: number) => void }) {
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
            style={{ width: 24, height: 24, background: 'rgba(79,209,197,0.15)' }}
          >
            <Cpu size={12} style={{ color: '#4FD1C5' }} />
          </div>
          <span style={{ color: '#4FD1C5', fontSize: 12, fontWeight: 600 }}>Core</span>
          <span style={{ color: '#A1A1AA', fontSize: 11 }}>{msg.timestamp}</span>
        </div>
        <div
          className="rounded-xl p-4"
          style={{
            background: 'rgba(79,209,197,0.04)',
            border: '1px solid rgba(79,209,197,0.15)',
            borderLeft: '3px solid #4FD1C5',
          }}
        >
          <p style={{ color: '#A1A1AA', fontSize: 14, marginBottom: msg.recommendations?.length ? 14 : 0, whiteSpace: 'pre-wrap' }}>
            {msg.content}
            {msg.streaming && <span className="animate-pulse" style={{ color: '#4FD1C5' }}>▍</span>}
          </p>
          {!!msg.recommendations?.length && (
            <div className="flex flex-col gap-2">
              {msg.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{rec.title}</div>
                  <div style={{ color: '#A1A1AA', fontSize: 12, lineHeight: 1.5, marginBottom: rec.action && rec.action.type !== 'none' ? 10 : 0 }}>
                    {rec.description}
                  </div>
                  {rec.action && rec.action.type !== 'none' && (
                    <motion.button
                      whileHover={rec.applied ? {} : { background: 'rgba(79,209,197,0.12)' }}
                      whileTap={rec.applied ? {} : { scale: 0.97 }}
                      onClick={() => !rec.applied && onApply(msg.id, i)}
                      className="rounded-lg py-1.5 px-3 flex items-center gap-2"
                      style={{
                        background: rec.applied ? 'rgba(34,197,94,0.08)' : 'rgba(79,209,197,0.07)',
                        border: `1px solid ${rec.applied ? 'rgba(34,197,94,0.25)' : 'rgba(79,209,197,0.2)'}`,
                        color: rec.applied ? '#22C55E' : '#4FD1C5',
                        fontSize: 12,
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
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CorePage() {
  const nexus = useNexus();
  const [messages, setMessages] = useState<CoreChatMsg[]>(CHAT_MESSAGES as CoreChatMsg[]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<boolean | null>(isAILive());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    checkAI().then(setAiStatus);
  }, []);

  const handleApply = (msgId: string, recIndex: number) => {
    const msg = messages.find(m => m.id === msgId);
    const rec = msg?.recommendations?.[recIndex];
    if (!rec?.action) return;
    const label = nexus.applyAction(rec.action);
    if (label) {
      setMessages(prev =>
        prev.map(m =>
          m.id === msgId
            ? { ...m, recommendations: m.recommendations?.map((r, i) => (i === recIndex ? { ...r, applied: true } : r)) }
            : m,
        ),
      );
      toast.success(label, { description: 'Workspace updated — check the affected page.' });
      if (rec.action.type === 'contact_client' && rec.action.draft) {
        toast.message('Draft prepared by Core', { description: rec.action.draft, duration: 8000 });
      }
    } else {
      toast.error('Could not apply — entity not found in workspace.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: CoreChatMsg = { id: `m${Date.now()}`, role: 'user', content: input, timestamp: now() };
    const history = [...messages, userMsg].slice(-12).map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const coreId = `m${Date.now() + 1}`;
    let placeholderShown = false;
    const showDelta = (text: string) => {
      setIsTyping(false);
      if (!placeholderShown) {
        placeholderShown = true;
        setMessages(prev => [...prev, { id: coreId, role: 'core', content: text, timestamp: now(), streaming: true }]);
      } else {
        setMessages(prev => prev.map(m => (m.id === coreId ? { ...m, content: text } : m)));
      }
    };

    const reply = await streamCoreChat(history, nexus.contextSnapshot(), showDelta);
    setAiStatus(isAILive());
    setIsTyping(false);
    setMessages(prev => {
      const finalMsg: CoreChatMsg = {
        id: coreId,
        role: 'core',
        content: reply.text,
        timestamp: now(),
        recommendations: reply.recommendations,
        streaming: false,
      };
      return placeholderShown ? prev.map(m => (m.id === coreId ? finalMsg : m)) : [...prev, finalMsg];
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0B0B0F' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#15151B' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: 'rgba(79,209,197,0.12)' }}
          >
            <Cpu size={18} style={{ color: '#4FD1C5' }} />
          </div>
          <div>
            <div style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600 }}>Core</div>
            <div style={{ color: '#4FD1C5', fontSize: 12 }}>AI Intelligence Engine · {aiStatus === false ? 'Local mode' : 'Active'}</div>
          </div>
        </div>
        {aiStatus === false ? (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{ background: 'rgba(255,181,71,0.08)', border: '1px solid rgba(255,181,71,0.2)' }}
          >
            <WifiOff size={12} style={{ color: '#FFB547' }} />
            <span style={{ color: '#FFB547', fontSize: 12 }}>Offline — local analysis</span>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <div className="rounded-full" style={{ width: 6, height: 6, background: '#22C55E' }} />
            <span style={{ color: '#22C55E', fontSize: 12 }}>All systems connected</span>
          </div>
        )}
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[800px] mx-auto flex flex-col gap-5">
          {messages.map(msg =>
            msg.role === 'user'
              ? <UserMessage key={msg.id} msg={msg} />
              : <CoreMessage key={msg.id} msg={msg} onApply={handleApply} />
          )}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: 24, height: 24, background: 'rgba(79,209,197,0.15)' }}
              >
                <Cpu size={12} style={{ color: '#4FD1C5' }} />
              </div>
              <div
                className="rounded-xl px-4 py-3"
                style={{ background: 'rgba(79,209,197,0.04)', border: '1px solid rgba(79,209,197,0.15)', borderLeft: '3px solid #4FD1C5' }}
              >
                <div className="flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map(delay => (
                    <motion.div
                      key={delay}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: '#4FD1C5', opacity: 0.7 }}
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
            className="px-8 pb-3"
          >
            <div className="max-w-[800px] mx-auto flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#A1A1AA',
                    fontSize: 12,
                    borderRadius: 20,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(79,209,197,0.08)';
                    (e.target as HTMLButtonElement).style.borderColor = 'rgba(79,209,197,0.2)';
                    (e.target as HTMLButtonElement).style.color = '#4FD1C5';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.target as HTMLButtonElement).style.color = '#A1A1AA';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div
        className="px-8 pb-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, background: '#0B0B0F' }}
      >
        <div className="max-w-[800px] mx-auto">
          <div
            className="flex items-end gap-3 rounded-xl p-3"
            style={{ background: '#15151B', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Core anything..."
              rows={2}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F4F4F5',
                fontSize: 14,
                resize: 'none',
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
            <div className="flex items-center gap-2 shrink-0">
              <span style={{ color: '#A1A1AA', fontSize: 11 }}>⌘ Enter</span>
              <motion.button
                whileHover={{ background: '#3dbdb2' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 36,
                  height: 36,
                  background: input.trim() ? '#4FD1C5' : 'rgba(79,209,197,0.15)',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'background 0.15s ease',
                }}
              >
                <Send size={15} style={{ color: input.trim() ? '#0B0B0F' : '#4FD1C5', opacity: input.trim() ? 1 : 0.4 }} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
