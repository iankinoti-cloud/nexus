import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, Users2, FileText, Plus, FolderOpen, DollarSign, Clock, Activity } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { HealthDot } from '../../shared/HealthDot';
import { AIChip } from '../../shared/AIChip';
import { useNexus } from '../../../data/store';
import type { Client, ContactEntry } from '../../../data/types';

const TYPE_ICONS: Record<ContactEntry['type'], React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Users2,
  note: FileText,
};

const TYPE_COLORS: Record<ContactEntry['type'], string> = {
  call: '#10B981',
  email: 'var(--accent)',
  meeting: '#A855F7',
  note: '#F59E0B',
};

function ContactTimeline({ entries }: { entries: ContactEntry[] }) {
  if (!entries.length) {
    return <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', textAlign: 'center', padding: '32px 0' }}>No contact history yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry, i) => {
        const Icon = TYPE_ICONS[entry.type];
        const color = TYPE_COLORS[entry.type];
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28, background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={12} style={{ color }} />
              </div>
              {i < entries.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--hair)', marginTop: 4 }} />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color, fontSize: 'calc(11px * var(--fs))', fontWeight: 600, textTransform: 'capitalize' }}>{entry.type}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>·</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{entry.date}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>·</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>{entry.by}</span>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.55 }}>{entry.summary}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function LogContactForm({ clientId, onDone }: { clientId: string; onDone: () => void }) {
  const { addContactEntry, currentUser } = useNexus();
  const [type, setType] = useState<ContactEntry['type']>('call');
  const [summary, setSummary] = useState('');

  const submit = () => {
    if (!summary.trim()) return;
    addContactEntry(clientId, {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type,
      summary: summary.trim(),
      by: currentUser.name,
    });
    onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: 'rgba(var(--accent-rgb),0.04)', border: '1px solid rgba(var(--accent-rgb),0.15)' }}
    >
      <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600 }}>Log Contact</div>
      <div className="flex gap-2">
        {(['call', 'email', 'meeting', 'note'] as ContactEntry['type'][]).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              background: type === t ? `${TYPE_COLORS[t]}15` : 'var(--surface)',
              border: `1px solid ${type === t ? TYPE_COLORS[t] + '40' : 'var(--hair)'}`,
              color: type === t ? TYPE_COLORS[t] : 'var(--text-dim)',
              borderRadius: 8,
              padding: '4px 12px',
              fontSize: 'calc(11px * var(--fs))',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: type === t ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <textarea
        value={summary}
        onChange={e => setSummary(e.target.value)}
        placeholder="What happened? Key points, next steps..."
        rows={3}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hair-2)',
          borderRadius: 10,
          color: 'var(--text)',
          fontSize: 'calc(13px * var(--fs))',
          padding: '10px 12px',
          resize: 'none',
          outline: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.5,
          width: '100%',
        }}
      />
      <div className="flex gap-2 justify-end">
        <button onClick={onDone} style={{ background: 'transparent', border: '1px solid var(--hair)', color: 'var(--text-dim)', borderRadius: 8, padding: '6px 14px', fontSize: 'calc(12px * var(--fs))', cursor: 'pointer' }}>Cancel</button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          disabled={!summary.trim()}
          style={{
            background: summary.trim() ? 'var(--accent)' : 'rgba(var(--accent-rgb),0.2)',
            border: 'none',
            color: summary.trim() ? '#0B0B0F' : 'var(--accent)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 'calc(12px * var(--fs))',
            fontWeight: 600,
            cursor: summary.trim() ? 'pointer' : 'default',
          }}
        >
          Save
        </motion.button>
      </div>
    </motion.div>
  );
}

export function ClientDetailSheet({ client, onClose }: { client: Client | null; onClose: () => void }) {
  const { updateDossier } = useNexus();
  const [showLogForm, setShowLogForm] = useState(false);
  const [dossier, setDossier] = useState(client?.dossierNotes ?? '');

  if (!client) return null;

  return (
    <Sheet open={!!client} onOpenChange={open => !open && onClose()}>
      <SheetContent
        side="right"
        style={{ width: '100%', maxWidth: 520, background: 'var(--surface)', border: 'none', borderLeft: '1px solid var(--hair)', padding: 0, overflowY: 'auto' }}
      >
        <SheetHeader className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--hair)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 48, height: 48, background: client.avatarColor + '20', border: `1px solid ${client.avatarColor}35` }}
            >
              <span style={{ color: client.avatarColor, fontSize: 'calc(16px * var(--fs))', fontWeight: 700 }}>{client.initials}</span>
            </div>
            <div>
              <SheetTitle style={{ color: 'var(--text)', fontSize: 'calc(17px * var(--fs))', fontWeight: 700 }}>{client.name}</SheetTitle>
              <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>{client.industry}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <HealthDot score={client.healthScore} />
              <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 'calc(13px * var(--fs))' }}>{client.healthScore}/10</span>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="flex flex-col h-full">
          <TabsList className="px-6 pt-4 pb-0 gap-1" style={{ background: 'transparent', borderBottom: '1px solid var(--hair)', borderRadius: 0, justifyContent: 'flex-start', height: 'auto', paddingBottom: 0 }}>
            {['overview', 'history', 'dossier'].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                style={{ borderRadius: '8px 8px 0 0', textTransform: 'capitalize', fontSize: 'calc(12px * var(--fs))' }}
              >
                {tab === 'history' ? 'Contact History' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FolderOpen, label: 'Projects', value: client.activeProjects },
                { icon: DollarSign, label: 'Revenue', value: client.revenue },
                { icon: Clock, label: 'Last Contact', value: client.lastContact },
                { icon: Activity, label: 'Health', value: `${client.healthScore}/10` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: 'var(--bg)', border: '1px solid var(--hair)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={11} style={{ color: 'var(--text-dim)' }} />
                    <span style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                  </div>
                  <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 'calc(14px * var(--fs))' }}>{value}</div>
                </div>
              ))}
            </div>
            {client.status === 'at-risk' && (
              <div className="rounded-lg px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B6B', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: '#FF6B6B', fontSize: 'calc(12px * var(--fs))' }}>Account at risk — action required</span>
              </div>
            )}
            <AIChip text={client.aiFollowUp} />
          </TabsContent>

          {/* Contact History */}
          <TabsContent value="history" className="px-6 py-5 flex flex-col gap-4">
            {!showLogForm ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLogForm(true)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 self-start"
                style={{ background: 'rgba(var(--accent-rgb),0.07)', border: '1px solid rgba(var(--accent-rgb),0.2)', color: 'var(--accent)', fontSize: 'calc(12px * var(--fs))', fontWeight: 500, cursor: 'pointer' }}
              >
                <Plus size={13} />
                Log Contact
              </motion.button>
            ) : (
              <LogContactForm clientId={client.id} onDone={() => setShowLogForm(false)} />
            )}
            <ContactTimeline entries={client.contactHistory ?? []} />
          </TabsContent>

          {/* Dossier */}
          <TabsContent value="dossier" className="px-6 py-5 flex flex-col gap-4">
            <div>
              <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, marginBottom: 8 }}>Account Notes</div>
              <textarea
                value={dossier}
                onChange={e => setDossier(e.target.value)}
                onBlur={() => updateDossier(client.id, dossier)}
                placeholder="Add notes about this client — key contacts, preferences, sensitivities, opportunities..."
                rows={8}
                style={{
                  width: '100%',
                  background: 'var(--bg)',
                  border: '1px solid var(--hair-2)',
                  borderRadius: 12,
                  color: 'var(--text)',
                  fontSize: 'calc(13px * var(--fs))',
                  padding: '12px 14px',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
              />
              <p style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))', marginTop: 6 }}>Auto-saved on blur. Mira (Client Agent) uses these notes when generating follow-up recommendations.</p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
