import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, Lock, Cpu, Loader2, FileText, Lightbulb,
  MessageSquare, FileCheck, DollarSign, ShieldCheck,
  Send, Download, Archive, UserCheck, ChevronRight, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNexus } from '../../../data/store';
import { generateBrief, generateProposal, generateQuotation } from '../../../lib/ai';
import { exportProposalPDF } from '../../../lib/enquiryPdf';
import type { Enquiry, CreativeIdeation } from '../../../data/types';

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Enquiry',    icon: FileText },
  { n: 2, label: 'Transcript', icon: MessageSquare },
  { n: 3, label: 'Brief',      icon: Cpu },
  { n: 4, label: 'Ideation',   icon: Lightbulb },
  { n: 5, label: 'Proposal',   icon: FileCheck },
  { n: 6, label: 'Quotation',  icon: DollarSign },
  { n: 7, label: 'Approval',   icon: ShieldCheck },
  { n: 8, label: 'Delivery',   icon: Send },
];

function getUnlocked(e: Enquiry): Record<number, boolean> {
  return {
    1: true,
    2: true,
    3: !!e.transcript,
    4: !!e.brief,
    5: !!e.ideation,
    6: !!e.proposal,
    7: !!e.quotation,
    8: ['approved', 'sent', 'converted'].includes(e.status),
  };
}

function getDone(e: Enquiry): Record<number, boolean> {
  return {
    1: true,
    2: !!e.transcript,
    3: !!e.brief,
    4: !!e.ideation,
    5: !!e.proposal,
    6: !!e.quotation,
    7: ['approved', 'sent', 'converted'].includes(e.status),
    8: ['sent', 'converted'].includes(e.status),
  };
}

function defaultActiveStep(e: Enquiry): number {
  const map: Record<string, number> = {
    new: 2, transcript: 3, briefed: 4, ideation: 5,
    proposed: 6, quoted: 7, approved: 8, sent: 8, converted: 8, lost: 1,
  };
  return map[e.status] ?? 2;
}

// ─── Elapsed timer ────────────────────────────────────────────────────────────

function useElapsed(createdAt: string, approvedAt?: string) {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    const tick = () => {
      const end = approvedAt ? new Date(approvedAt) : new Date();
      setMins(Math.floor((end.getTime() - new Date(createdAt).getTime()) / 60000));
    };
    tick();
    if (!approvedAt) {
      const id = setInterval(tick, 30_000);
      return () => clearInterval(id);
    }
  }, [createdAt, approvedAt]);
  return mins;
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' };
const dimText = { color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' };
const label = { ...dimText, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4, display: 'block', fontSize: 'calc(10px * var(--fs))' };
const tag = (color: string) => ({ display: 'inline-block', background: `${color}18`, border: `1px solid ${color}35`, color, borderRadius: 6, padding: '2px 8px', fontSize: 'calc(11px * var(--fs))' });
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--hair)', borderRadius: 8, color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', padding: '10px 14px', width: '100%', outline: 'none' };
const coreBtn = { background: 'rgba(var(--accent-rgb),0.12)', border: '1px solid rgba(var(--accent-rgb),0.3)', color: 'var(--accent)', borderRadius: 8, padding: '10px 18px', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

function SectionHead({ title, by }: { title: string; by?: string }) {
  return (
    <div className="mb-4">
      <div style={{ color: 'var(--text)', fontSize: 'calc(16px * var(--fs))', fontWeight: 600 }}>{title}</div>
      {by && <div style={dimText}>{by}</div>}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ label: l, value }) => (
        <div key={l} style={card}>
          <span style={label}>{l}</span>
          <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function BulletList({ items, color = 'var(--accent)' }: { items: string[]; color?: string }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span style={{ color, marginTop: 4, flexShrink: 0 }}>•</span>
          <span style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))' }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CoreGenerating({ label: l }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <Cpu size={32} style={{ color: 'var(--accent)' }} />
      </motion.div>
      <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>Core is {l}…</p>
    </motion.div>
  );
}

function LockedStep() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Lock size={28} style={{ color: 'rgba(255,255,255,0.2)' }} />
      <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>Complete the previous step to unlock this one</p>
    </div>
  );
}

// ─── Step 1: Enquiry Info ─────────────────────────────────────────────────────

function StepInfo({ enquiry }: { enquiry: Enquiry }) {
  const SOURCE_LABELS: Record<string, string> = {
    website: 'Website', referral: 'Referral', 'cold-outreach': 'Cold Outreach', event: 'Event', social: 'Social Media',
  };
  return (
    <div className="flex flex-col gap-5">
      <SectionHead title="Enquiry Details" by="Captured on intake" />
      <InfoGrid items={[
        { label: 'Company', value: enquiry.companyName },
        { label: 'Industry', value: enquiry.industry },
        { label: 'Contact', value: enquiry.contactName },
        { label: 'Email', value: enquiry.contactEmail },
        { label: 'Budget Range', value: enquiry.budgetRange },
        { label: 'Timeline', value: enquiry.timeline },
        { label: 'Source', value: SOURCE_LABELS[enquiry.source] ?? enquiry.source },
        { label: 'Received', value: new Date(enquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
      ]} />
      <div style={card}>
        <span style={label}>Service Interest</span>
        <p style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.6 }}>{enquiry.serviceInterest}</p>
      </div>
      {enquiry.notes && (
        <div style={card}>
          <span style={label}>Notes</span>
          <p style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.6 }}>{enquiry.notes}</p>
        </div>
      )}
      {enquiry.contactPhone && (
        <div style={{ ...dimText }}>📞 {enquiry.contactPhone}</div>
      )}
    </div>
  );
}

// ─── Step 2: Transcript ───────────────────────────────────────────────────────

function StepTranscript({ enquiry }: { enquiry: Enquiry }) {
  const { updateEnquiry } = useNexus();
  const [text, setText] = useState(enquiry.transcript ?? '');
  const [date, setDate] = useState(enquiry.meetingDate ?? '');
  const [saving, setSaving] = useState(false);

  const save = () => {
    if (!text.trim()) return;
    setSaving(true);
    updateEnquiry(enquiry.id, { transcript: text.trim(), meetingDate: date || undefined, status: 'transcript' });
    setSaving(false);
    toast.success('Transcript saved');
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHead title="Meeting Transcript" by="Paste the discovery call transcript" />
      <div>
        <label style={label}>Meeting Date</label>
        <input type="date" style={{ ...inputStyle, maxWidth: 220 }} value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        <label style={label}>Transcript</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your call transcript here. Core will use this to generate your project brief in Step 3."
          style={{ ...inputStyle, height: 280, resize: 'vertical', lineHeight: 1.7, fontFamily: 'monospace', fontSize: 'calc(12px * var(--fs))' }}
        />
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={save}
        disabled={!text.trim() || saving}
        style={{ ...coreBtn, opacity: !text.trim() ? 0.4 : 1 }}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        Save Transcript
      </motion.button>
    </div>
  );
}

// ─── Step 3: Brief ────────────────────────────────────────────────────────────

function StepBrief({ enquiry }: { enquiry: Enquiry }) {
  const { updateEnquiry } = useNexus();
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (!enquiry.transcript) return;
    setGenerating(true);
    try {
      const brief = await generateBrief(enquiry.transcript, enquiry);
      updateEnquiry(enquiry.id, { brief, status: 'briefed' });
      toast.success('Brief generated by Core');
    } catch {
      toast.error('Generation failed — check connection');
    } finally {
      setGenerating(false);
    }
  };

  if (!enquiry.transcript) return <LockedStep />;
  if (generating) return <CoreGenerating label="reading the transcript" />;

  if (!enquiry.brief) {
    return (
      <div className="flex flex-col gap-5">
        <SectionHead title="Project Brief" by="Core will extract the brief from your transcript" />
        <div style={{ ...card, textAlign: 'center', padding: '32px 24px' }}>
          <Cpu size={32} style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', marginBottom: 20 }}>
            Core will read the transcript and extract objectives, deliverables, budget signals, and creative themes.
          </p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={generate} style={coreBtn}>
            <Cpu size={14} /> Generate Brief with Core
          </motion.button>
        </div>
      </div>
    );
  }

  const { brief } = enquiry;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <SectionHead title="Project Brief" by={`Generated by Core · ${new Date(brief.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`} />
        <button onClick={generate} style={{ ...dimText, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Cpu size={11} /> Regenerate
        </button>
      </div>
      <div style={card}>
        <span style={label}>Objectives</span>
        <BulletList items={brief.objectives} />
      </div>
      <div style={card}>
        <span style={label}>Deliverables</span>
        <BulletList items={brief.deliverables} />
      </div>
      <InfoGrid items={[
        { label: 'Timeline', value: brief.timeline },
        { label: 'Budget Signal', value: brief.budgetSignal },
      ]} />
      <div style={card}>
        <span style={label}>Target Audience</span>
        <p style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))' }}>{brief.targetAudience}</p>
      </div>
      <div style={card}>
        <span style={label}>Key Messages</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {brief.keyMessages.map(m => <span key={m} style={tag('#C084FC')}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Ideation ─────────────────────────────────────────────────────────

function StepIdeation({ enquiry }: { enquiry: Enquiry }) {
  const { updateEnquiry, currentUser } = useNexus();
  const [form, setForm] = useState<{ bigIdea: string; tone0: string; tone1: string; tone2: string; direction: string }>({
    bigIdea: enquiry.ideation?.bigIdea ?? '',
    tone0: enquiry.ideation?.toneWords[0] ?? '',
    tone1: enquiry.ideation?.toneWords[1] ?? '',
    tone2: enquiry.ideation?.toneWords[2] ?? '',
    direction: enquiry.ideation?.creativeDirection ?? '',
  });
  const [saving, setSaving] = useState(false);

  if (!enquiry.brief) return <LockedStep />;

  const save = () => {
    if (!form.bigIdea || !form.direction) return;
    setSaving(true);
    const ideation: CreativeIdeation = {
      bigIdea: form.bigIdea,
      toneWords: [form.tone0 || 'Bold', form.tone1 || 'Refined', form.tone2 || 'Emotive'],
      creativeDirection: form.direction,
      completedBy: currentUser.id,
      completedAt: new Date().toISOString(),
    };
    updateEnquiry(enquiry.id, { ideation, status: 'ideation' });
    setSaving(false);
    toast.success('Creative ideation saved');
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <SectionHead title="Creative Ideation" by="Human creative direction — Core will build the proposal on this foundation" />

      <div style={{ ...card, background: 'rgba(var(--accent-rgb),0.05)', border: '1px solid rgba(var(--accent-rgb),0.15)' }}>
        <Lightbulb size={14} style={{ color: 'var(--accent)', marginBottom: 8 }} />
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.6 }}>
          This is the step only humans can do. The brief tells us <em>what</em>. Ideation is where you decide <em>how it should feel</em>. The AI listens — but you lead.
        </p>
      </div>

      <div>
        <label style={label}>The Big Idea *</label>
        <p style={{ ...dimText, marginBottom: 8 }}>In one sentence — what's the creative concept?</p>
        <textarea
          value={form.bigIdea}
          onChange={e => set('bigIdea', e.target.value)}
          placeholder="e.g. 'Drift as a living album — a game you don't just play, but inhabit'"
          style={{ ...inputStyle, height: 72, resize: 'none' }}
        />
      </div>

      <div>
        <label style={label}>Tone Words — 3 adjectives that define the creative register</label>
        <div className="grid grid-cols-3 gap-3">
          {(['tone0', 'tone1', 'tone2'] as const).map((k, i) => (
            <input key={k} style={inputStyle} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={['Atmospheric', 'Refined', 'Emotive'][i]} />
          ))}
        </div>
      </div>

      <div>
        <label style={label}>Creative Direction *</label>
        <p style={{ ...dimText, marginBottom: 8 }}>Describe the visual language, references, palette, and mood.</p>
        <textarea
          value={form.direction}
          onChange={e => set('direction', e.target.value)}
          placeholder="Describe the visual world you're building — references, palette, motion style, typographic character…"
          style={{ ...inputStyle, height: 120, resize: 'vertical' }}
        />
      </div>

      {enquiry.ideation && (
        <div style={{ ...dimText }}>
          Last saved by {enquiry.ideation.completedBy} · {new Date(enquiry.ideation.completedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={save}
        disabled={!form.bigIdea || !form.direction || saving}
        style={{ ...coreBtn, opacity: !form.bigIdea || !form.direction ? 0.4 : 1 }}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        {enquiry.ideation ? 'Update Ideation' : 'Save Ideation'}
      </motion.button>
    </div>
  );
}

// ─── Step 5: Proposal ─────────────────────────────────────────────────────────

function StepProposal({ enquiry }: { enquiry: Enquiry }) {
  const { updateEnquiry } = useNexus();
  const [generating, setGenerating] = useState(false);

  if (!enquiry.ideation) return <LockedStep />;

  const generate = async () => {
    if (!enquiry.brief || !enquiry.ideation) return;
    setGenerating(true);
    try {
      const proposal = await generateProposal(enquiry.brief, enquiry.ideation, enquiry);
      updateEnquiry(enquiry.id, { proposal, status: 'proposed' });
      toast.success('Proposal drafted by Core');
    } catch {
      toast.error('Generation failed — check connection');
    } finally {
      setGenerating(false);
    }
  };

  if (generating) return <CoreGenerating label="drafting the proposal" />;

  if (!enquiry.proposal) {
    return (
      <div className="flex flex-col gap-5">
        <SectionHead title="Proposal" by="Core will draft the full proposal from the brief and creative direction" />
        <div style={{ ...card, textAlign: 'center', padding: '32px 24px' }}>
          <FileCheck size={32} style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', marginBottom: 20 }}>
            Core will build a complete, professional proposal using the brief and your creative direction.
          </p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={generate} style={coreBtn}>
            <Cpu size={14} /> Generate Proposal with Core
          </motion.button>
        </div>
      </div>
    );
  }

  const { proposal } = enquiry;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <SectionHead title={proposal.title} by={`Generated by Core · ${new Date(proposal.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`} />
        <button onClick={generate} style={{ ...dimText, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Cpu size={11} /> Regenerate
        </button>
      </div>
      <div style={{ ...card, borderLeft: '3px solid var(--accent)', borderRadius: '0 10px 10px 0' }}>
        <span style={label}>Executive Summary</span>
        <p style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{proposal.executiveSummary}</p>
      </div>
      {proposal.sections.map(s => (
        <div key={s.title} style={card}>
          <span style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, marginBottom: 8, display: 'block' }}>{s.title}</span>
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.7 }}>{s.body}</p>
        </div>
      ))}
      <div style={card}>
        <span style={label}>Deliverables</span>
        <BulletList items={proposal.deliverables} />
      </div>
      <InfoGrid items={[
        { label: 'Timeline', value: proposal.timeline },
        { label: 'Team', value: proposal.teamNotes },
      ]} />
    </div>
  );
}

// ─── Step 6: Quotation ────────────────────────────────────────────────────────

function StepQuotation({ enquiry }: { enquiry: Enquiry }) {
  const { updateEnquiry } = useNexus();
  const [generating, setGenerating] = useState(false);

  if (!enquiry.proposal) return <LockedStep />;

  const generate = async () => {
    if (!enquiry.brief || !enquiry.proposal) return;
    setGenerating(true);
    try {
      const quotation = await generateQuotation(enquiry.brief, enquiry.proposal, enquiry);
      updateEnquiry(enquiry.id, { quotation, status: 'quoted' });
      toast.success('Quotation built by Core');
    } catch {
      toast.error('Generation failed — check connection');
    } finally {
      setGenerating(false);
    }
  };

  if (generating) return <CoreGenerating label="building the quotation" />;

  if (!enquiry.quotation) {
    return (
      <div className="flex flex-col gap-5">
        <SectionHead title="Quotation" by="Core will calculate line-item pricing from the proposal scope" />
        <div style={{ ...card, textAlign: 'center', padding: '32px 24px' }}>
          <DollarSign size={32} style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
          <motion.button whileTap={{ scale: 0.97 }} onClick={generate} style={coreBtn}>
            <Cpu size={14} /> Build Quotation with Core
          </motion.button>
        </div>
      </div>
    );
  }

  const { quotation } = enquiry;
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: quotation.currency || 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <SectionHead title="Quotation" by={`Generated by Core · ${new Date(quotation.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`} />
        <button onClick={generate} style={{ ...dimText, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Cpu size={11} /> Regenerate
        </button>
      </div>
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hair)' }}>
              {['Description', 'Qty', 'Unit', 'Rate', 'Total'].map((h, i) => (
                <th key={h} style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i === 0 ? 'left' : 'right', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotation.lineItems.map((item, i) => (
              <tr key={i} style={{ borderBottom: i < quotation.lineItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text)', fontSize: 'calc(13px * var(--fs))' }}>{item.description}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', textAlign: 'right' }}>{item.unit}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', textAlign: 'right' }}>{fmt(item.rate)}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, textAlign: 'right' }}>{fmt(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '14px 14px', borderTop: '1px solid var(--hair)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ display: 'flex', gap: 32, color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>
            <span>Subtotal</span><span>{fmt(quotation.subtotal)}</span>
          </div>
          {quotation.tax > 0 && (
            <div style={{ display: 'flex', gap: 32, color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>
              <span>Tax ({quotation.tax}%)</span><span>{fmt(quotation.total - quotation.subtotal)}</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 32, color: 'var(--text)', fontSize: 'calc(18px * var(--fs))', fontWeight: 700, paddingTop: 8, borderTop: '1px solid var(--hair)', width: '100%', justifyContent: 'flex-end' }}>
            <span>Total</span><span>{fmt(quotation.total)}</span>
          </div>
        </div>
      </div>
      <div style={{ ...dimText, lineHeight: 1.6 }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>📋 {quotation.notes}</span>
      </div>
      <div style={{ ...dimText }}>Valid until {quotation.validUntil}</div>
    </div>
  );
}

// ─── Step 7: Approval ─────────────────────────────────────────────────────────

function StepApproval({ enquiry }: { enquiry: Enquiry }) {
  const { updateEnquiry, currentUser } = useNexus();
  const [note, setNote] = useState('');

  if (!enquiry.quotation) return <LockedStep />;

  const canApprove = currentUser.role === 'owner' || currentUser.role === 'account_manager';
  const isApproved = ['approved', 'sent', 'converted'].includes(enquiry.status);

  const approve = () => {
    updateEnquiry(enquiry.id, {
      status: 'approved',
      approvedBy: currentUser.id,
      approvedAt: new Date().toISOString(),
    });
    toast.success('Proposal approved — ready for delivery');
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: enquiry.quotation!.currency || 'USD', maximumFractionDigits: 0 }).format(n);

  if (isApproved) {
    return (
      <div className="flex flex-col gap-5">
        <SectionHead title="Approved" />
        <div style={{ ...card, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Check size={24} style={{ color: '#22C55E' }} />
          </div>
          <p style={{ color: '#22C55E', fontSize: 'calc(16px * var(--fs))', fontWeight: 600 }}>Proposal Approved</p>
          {enquiry.approvedAt && (
            <p style={{ ...dimText, marginTop: 4 }}>
              Approved on {new Date(enquiry.approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        <p style={{ ...dimText }}>Proceed to Step 8 to send the proposal to the client.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHead title="Review & Approve" by="Final check before sending to the client" />

      {!canApprove && (
        <div style={{ ...card, background: 'rgba(255,181,71,0.06)', border: '1px solid rgba(255,181,71,0.2)' }}>
          <UserCheck size={14} style={{ color: '#FFB547', marginBottom: 6 }} />
          <p style={{ color: '#FFB547', fontSize: 'calc(12px * var(--fs))' }}>
            Only the agency owner or account manager can approve proposals. Signed in as {currentUser.name} ({currentUser.role.replace('_', ' ')}).
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Client', value: enquiry.companyName },
          { label: 'Contact', value: enquiry.contactName },
          { label: 'Total Value', value: fmt(enquiry.quotation.total) },
          { label: 'Valid Until', value: enquiry.quotation.validUntil },
        ].map(({ label: l, value }) => (
          <div key={l} style={card}>
            <span style={label}>{l}</span>
            <div style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <span style={label}>Deliverables ({enquiry.proposal?.deliverables.length})</span>
        <BulletList items={enquiry.proposal?.deliverables ?? []} color="#22C55E" />
      </div>

      {canApprove && (
        <>
          <div>
            <label style={label}>Approval Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add any final notes…" style={{ ...inputStyle, height: 72, resize: 'none' }} />
          </div>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={approve}
              style={{ ...coreBtn, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E', flex: 2 }}
            >
              <ShieldCheck size={14} /> Approve Proposal
            </motion.button>
            <button
              onClick={() => { updateEnquiry(enquiry.id, { status: 'lost', notes: note || 'Rejected at approval stage' }); toast('Marked as lost'); }}
              style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B', borderRadius: 8, padding: '10px 0', fontSize: 'calc(13px * var(--fs))', cursor: 'pointer' }}
            >
              Reject
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Step 8: Delivery ─────────────────────────────────────────────────────────

function StepDelivery({ enquiry }: { enquiry: Enquiry }) {
  const { updateEnquiry } = useNexus();

  if (!['approved', 'sent', 'converted'].includes(enquiry.status)) return <LockedStep />;

  const isSent = ['sent', 'converted'].includes(enquiry.status);

  const deliver = (method: 'nexus' | 'pdf' | 'stored') => {
    if (method === 'pdf') {
      exportProposalPDF(enquiry);
      return;
    }
    if (method === 'nexus') {
      toast.success(`Proposal sent to ${enquiry.contactEmail}`);
    } else {
      toast.success('Proposal stored in workspace');
    }
    updateEnquiry(enquiry.id, { status: 'sent', deliveryMethod: method });
  };

  const convertToClient = () => {
    updateEnquiry(enquiry.id, { status: 'converted' });
    toast.success(`${enquiry.companyName} added to active clients`);
  };

  const options = [
    {
      method: 'nexus' as const,
      icon: Send,
      title: 'Send via NEXUS',
      desc: `Core will send the proposal directly to ${enquiry.contactEmail}`,
      color: 'var(--accent)',
    },
    {
      method: 'pdf' as const,
      icon: Download,
      title: 'Export as PDF',
      desc: 'Generate a premium-formatted proposal PDF',
      color: '#4FD1C5',
    },
    {
      method: 'stored' as const,
      icon: Archive,
      title: 'Store Only',
      desc: 'Save to the workspace for manual sending',
      color: '#FFB547',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHead title="Delivery" by="How should we get this to the client?" />

      {isSent && (
        <div style={{ ...card, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Check size={14} style={{ color: '#22C55E', marginBottom: 4 }} />
          <p style={{ color: '#22C55E', fontSize: 'calc(12px * var(--fs))' }}>
            Proposal delivered via {enquiry.deliveryMethod ?? 'NEXUS'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {options.map(({ method, icon: Icon, title, desc, color }) => (
          <motion.button
            key={method}
            whileHover={{ borderColor: color + '55' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => deliver(method)}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--hair)',
              borderRadius: 10,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s ease',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', fontWeight: 600, marginBottom: 2 }}>{title}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>{desc}</div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-dim)', marginLeft: 'auto' }} />
          </motion.button>
        ))}
      </div>

      {isSent && enquiry.status !== 'converted' && (
        <div style={{ paddingTop: 16, borderTop: '1px solid var(--hair)' }}>
          <p style={{ ...dimText, marginBottom: 12 }}>Client accepted? Convert this enquiry to an active client.</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={convertToClient}
            style={{ ...coreBtn, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E' }}
          >
            <UserCheck size={14} /> Convert to Client
          </motion.button>
        </div>
      )}

      {enquiry.status === 'converted' && (
        <div style={{ ...card, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <p style={{ color: '#22C55E', fontSize: 'calc(13px * var(--fs))', fontWeight: 600 }}>✓ {enquiry.companyName} is now an active client</p>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { enquiry: Enquiry; onClose?: () => void; }

export function EnquiryDetail({ enquiry }: Props) {
  const [activeStep, setActiveStep] = useState(() => defaultActiveStep(enquiry));
  const contentRef = useRef<HTMLDivElement>(null);
  const elapsedMins = useElapsed(enquiry.createdAt, enquiry.approvedAt);
  const unlocked = getUnlocked(enquiry);
  const done = getDone(enquiry);

  const STATUS_LABELS: Record<string, string> = {
    new: 'New', transcript: 'Transcript', briefed: 'Briefed', ideation: 'Ideation',
    proposed: 'Proposed', quoted: 'Quoted', approved: 'Approved', sent: 'Sent', converted: 'Converted', lost: 'Lost',
  };

  const timerColor = elapsedMins < 30 ? '#22C55E' : elapsedMins < 60 ? '#FFB547' : '#FF6B6B';
  const timerLabel = enquiry.approvedAt
    ? `Completed in ${elapsedMins < 60 ? `${elapsedMins}m` : `${Math.floor(elapsedMins / 60)}h ${elapsedMins % 60}m`}`
    : `${elapsedMins < 60 ? `${elapsedMins}m` : `${Math.floor(elapsedMins / 60)}h ${elapsedMins % 60}m`} elapsed`;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  // keep active step in sync when enquiry updates
  useEffect(() => {
    const next = defaultActiveStep(enquiry);
    setActiveStep(s => (s < next ? next : s));
  }, [enquiry.status]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: 'var(--text)', fontSize: 'calc(18px * var(--fs))', fontWeight: 700 }} className="truncate">
            {enquiry.companyName}
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}>
            {enquiry.contactName} · {enquiry.industry}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0" style={{ paddingRight: 40 }}>
          <div className="flex items-center gap-1.5" style={{ color: timerColor, fontSize: 'calc(12px * var(--fs))', fontWeight: 500 }}>
            <Clock size={12} />
            <span>{timerLabel}</span>
          </div>
          <span style={{ background: 'rgba(var(--accent-rgb),0.1)', border: '1px solid rgba(var(--accent-rgb),0.25)', color: 'var(--accent)', borderRadius: 6, padding: '3px 10px', fontSize: 'calc(11px * var(--fs))' }}>
            {STATUS_LABELS[enquiry.status] ?? enquiry.status}
          </span>
        </div>
      </div>

      {/* Body: step nav + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Step nav */}
        <div style={{ width: 156, borderRight: '1px solid var(--hair)', padding: '16px 12px', flexShrink: 0, overflowY: 'auto' }}>
          {STEPS.map(({ n, label: stepLabel, icon: Icon }) => {
            const isActive = activeStep === n;
            const isDone = done[n];
            const isUnlocked = unlocked[n];

            return (
              <button
                key={n}
                onClick={() => isUnlocked && setActiveStep(n)}
                style={{
                  width: '100%',
                  background: isActive ? 'rgba(var(--accent-rgb),0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(var(--accent-rgb),0.25)' : 'transparent'}`,
                  borderRadius: 8,
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: isUnlocked ? 'pointer' : 'default',
                  opacity: !isUnlocked ? 0.35 : 1,
                  marginBottom: 2,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: isDone ? '#22C55E' : isActive ? 'rgba(var(--accent-rgb),0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isDone ? '#22C55E' : isActive ? 'rgba(var(--accent-rgb),0.4)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {isDone ? (
                    <Check size={11} style={{ color: '#fff' }} />
                  ) : !isUnlocked ? (
                    <Lock size={9} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  ) : (
                    <Icon size={11} style={{ color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.4)' }} />
                  )}
                </div>
                <span style={{
                  color: isActive ? 'var(--accent)' : isDone ? 'var(--text)' : 'var(--text-dim)',
                  fontSize: 'calc(11px * var(--fs))',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                }}>
                  {stepLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeStep === 1 && <StepInfo enquiry={enquiry} />}
              {activeStep === 2 && <StepTranscript enquiry={enquiry} />}
              {activeStep === 3 && <StepBrief enquiry={enquiry} />}
              {activeStep === 4 && <StepIdeation enquiry={enquiry} />}
              {activeStep === 5 && <StepProposal enquiry={enquiry} />}
              {activeStep === 6 && <StepQuotation enquiry={enquiry} />}
              {activeStep === 7 && <StepApproval enquiry={enquiry} />}
              {activeStep === 8 && <StepDelivery enquiry={enquiry} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
