import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { useNexus } from '../../../data/store';
import type { Enquiry } from '../../../data/types';

const INDUSTRIES = ['Technology', 'HealthTech', 'FinTech', 'EdTech', 'Retail & E-Commerce', 'Food & Beverage', 'Real Estate', 'Media & Entertainment', 'Gaming & Interactive', 'Wellness & Beauty', 'Venture Capital', 'Consumer Goods', 'Non-Profit', 'Other'];
const BUDGETS = ['Under $10,000', '$10,000 – $25,000', '$25,000 – $50,000', '$50,000 – $100,000', '$100,000+', 'To be discussed'];
const SOURCES: { value: Enquiry['source']; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'cold-outreach', label: 'Cold Outreach' },
  { value: 'event', label: 'Event / Conference' },
  { value: 'social', label: 'Social Media' },
];

interface Props { open: boolean; onClose: () => void; }

export function NewEnquiryModal({ open, onClose }: Props) {
  const { addEnquiry, users } = useNexus();
  const [form, setForm] = useState({
    companyName: '', contactName: '', contactEmail: '', contactPhone: '',
    industry: '', serviceInterest: '', budgetRange: '', timeline: '',
    source: 'website' as Enquiry['source'], assignedTo: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName || !form.contactEmail || !form.serviceInterest) return;
    setSaving(true);
    addEnquiry({
      companyName: form.companyName,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone || undefined,
      industry: form.industry || 'Other',
      serviceInterest: form.serviceInterest,
      budgetRange: form.budgetRange || 'To be discussed',
      timeline: form.timeline || 'To be confirmed',
      source: form.source,
      assignedTo: form.assignedTo || undefined,
      notes: form.notes || undefined,
    });
    setSaving(false);
    setForm({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', industry: '', serviceInterest: '', budgetRange: '', timeline: '', source: 'website', assignedTo: '', notes: '' });
    onClose();
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--hair)',
    borderRadius: 8,
    color: 'var(--text)',
    fontSize: 'calc(13px * var(--fs))',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
  };

  const labelStyle = {
    color: 'var(--text-dim)',
    fontSize: 'calc(11px * var(--fs))',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}
        className="p-6"
      >
        <DialogHeader className="mb-6">
          <DialogTitle style={{ color: 'var(--text)', fontSize: 'calc(18px * var(--fs))', fontWeight: 600 }}>
            Capture Enquiry
          </DialogTitle>
          <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', marginTop: 4 }}>
            Add a new lead to the pipeline — start the 30-minute clock.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Company *</label>
              <input style={inputStyle} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Acme Studio" required />
            </div>
            <div>
              <label style={labelStyle}>Industry</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.industry} onChange={e => set('industry', e.target.value)}>
                <option value="">Select…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Contact Name *</label>
              <input style={inputStyle} value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="Jane Smith" required />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="jane@acme.com" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <label style={labelStyle}>Source</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.source} onChange={e => set('source', e.target.value as Enquiry['source'])}>
                {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Service Interest *</label>
            <textarea
              style={{ ...inputStyle, height: 72, resize: 'none' }}
              value={form.serviceInterest}
              onChange={e => set('serviceInterest', e.target.value)}
              placeholder="Brand identity, website redesign, launch campaign…"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Budget Range</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.budgetRange} onChange={e => set('budgetRange', e.target.value)}>
                <option value="">Select…</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Timeline</label>
              <input style={inputStyle} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="8 weeks" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Assign To</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
              <option value="">Unassigned</option>
              {users.filter(u => ['owner','account_manager','creative_lead'].includes(u.role)).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              style={{ ...inputStyle, height: 60, resize: 'none' }}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any context from first contact…"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, background: 'transparent', border: '1px solid var(--hair)', color: 'var(--text-dim)', borderRadius: 8, padding: '10px 0', fontSize: 'calc(13px * var(--fs))', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              disabled={saving}
              style={{ flex: 2, background: 'var(--accent)', border: 'none', color: '#0B0B0F', borderRadius: 8, padding: '10px 0', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, cursor: 'pointer' }}
            >
              {saving ? 'Saving…' : 'Capture & Start Pipeline'}
            </motion.button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
