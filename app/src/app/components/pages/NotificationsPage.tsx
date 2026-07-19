import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle, Clock, MessageSquare, DollarSign, AlertTriangle, Check, X
} from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import nexusEmblem from '../../../imports/NEXUS-_-EMBLEM.jpeg';
import { useNexus } from '../../data/store';
import type { Notification, Client } from '../../data/types';

const CATEGORY_CONFIG = {
  project: { icon: CheckCircle, color: 'var(--accent)', bg: 'rgba(var(--accent-rgb),0.12)', label: 'Projects' },
  deadline: { icon: Clock, color: '#FFB547', bg: 'rgba(255,181,71,0.12)', label: 'Deadlines' },
  client: { icon: MessageSquare, color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', label: 'Clients' },
  invoice: { icon: DollarSign, color: '#22C55E', bg: 'rgba(34,197,94,0.12)', label: 'Invoices' },
  risk: { icon: AlertTriangle, color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', label: 'Risks' },
};

const TABS = ['All', 'Projects', 'Deadlines', 'Clients', 'Invoices', 'Risks'];

function NotificationRow({ notif, onRead, onAction }: { notif: Notification; onRead: (id: string) => void; onAction: (n: Notification) => void }) {
  const config = CATEGORY_CONFIG[notif.category];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 px-5 py-4 rounded-xl"
      style={{
        background: notif.read ? 'transparent' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${notif.read ? 'var(--hair)' : 'var(--hair-2)'}`,
        marginBottom: 6,
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-xl shrink-0 mt-0.5"
        style={{ width: 38, height: 38, background: config.bg }}
      >
        <Icon size={16} style={{ color: config.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: notif.read ? 400 : 600, lineHeight: 1.4 }}>
            {notif.title}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span style={{ color: 'var(--text-dim)', fontSize: 11, whiteSpace: 'nowrap' }}>{notif.timestamp}</span>
            {!notif.read && (
              <div
                className="rounded-full shrink-0"
                style={{ width: 7, height: 7, background: 'var(--accent)' }}
              />
            )}
          </div>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 12, lineHeight: 1.5, marginTop: 3 }}>{notif.message}</p>
        <div className="flex items-center gap-3 mt-2.5">
          {notif.action && (
            <button
              onClick={() => onAction(notif)}
              style={{
                color: 'var(--accent)',
                fontSize: 12,
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {notif.action} →
            </button>
          )}
          {!notif.read && (
            <button
              onClick={() => onRead(notif.id)}
              className="flex items-center gap-1"
              style={{ color: 'var(--text-dim)', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Check size={11} /> Mark read
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationsPage() {
  const { notifications, clients, markRead, markAllRead } = useNexus();
  const [activeTab, setActiveTab] = useState('All');
  const [invoiceNotif, setInvoiceNotif] = useState<Notification | null>(null);
  const navigate = useNavigate();

  const handleAction = (notif: Notification) => {
    markRead(notif.id);
    switch (notif.category) {
      case 'invoice':
        setInvoiceNotif(notif);
        break;
      case 'client':
        navigate('/clients');
        break;
      case 'risk':
        navigate('/core');
        break;
      default:
        navigate('/projects');
    }
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'All') return true;
    const config = CATEGORY_CONFIG[n.category];
    return config.label === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 style={{ color: 'var(--text)', fontSize: 24, fontWeight: 600 }}>Notifications</h1>
          {unreadCount > 0 && (
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 22, height: 22, background: 'var(--accent)', color: '#0B0B0F', fontSize: 11, fontWeight: 700 }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              color: 'var(--text-dim)',
              fontSize: 13,
              background: 'none',
              border: '1px solid var(--hair-2)',
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'color 0.15s ease',
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'rgba(var(--accent-rgb),0.1)' : 'transparent',
              border: `1px solid ${activeTab === tab ? 'rgba(var(--accent-rgb),0.3)' : 'var(--hair)'}`,
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-dim)',
              fontSize: 12,
              fontWeight: activeTab === tab ? 500 : 400,
              borderRadius: 8,
              padding: '6px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab}
            {tab === 'All' && unreadCount > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  background: 'var(--accent)',
                  color: '#0B0B0F',
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: '1px 5px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--text-dim)' }}>
            <CheckCircle size={36} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ fontSize: 14 }}>All caught up!</p>
          </div>
        ) : (
          filtered.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NotificationRow notif={notif} onRead={markRead} onAction={handleAction} />
            </motion.div>
          ))
        )}
      </div>

      <InvoiceDialog notif={invoiceNotif} clients={clients} onClose={() => setInvoiceNotif(null)} />
    </PageShell>
  );
}

function InvoiceDialog({ notif, clients, onClose }: { notif: Notification | null; clients: Client[]; onClose: () => void }) {
  const invoiceNo = notif?.title.match(/#(\d+)/)?.[1] ?? '0000';
  const amountStr = notif?.title.match(/\$([\d,]+)/)?.[1] ?? '0';
  const amount = parseInt(amountStr.replace(/,/g, ''), 10);
  const paid = /paid/i.test(notif?.title ?? '');
  const client = clients.find(c => notif?.message.includes(c.name)) ?? clients[0];
  const project = notif?.message.match(/for (.+?)(?: sent| successfully|\.)/)?.[1] ?? 'Creative services';

  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
  const items = [
    { label: 'Creative direction & design', value: Math.round(amount * 0.55) },
    { label: 'Production & implementation', value: Math.round(amount * 0.3) },
    { label: 'Project management', value: 0 },
  ];
  items[2].value = amount - items[0].value - items[1].value;

  return (
    <AnimatePresence>
      {notif && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full rounded-2xl overflow-hidden"
            style={{ maxWidth: 560, background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-7 py-5"
              style={{ borderBottom: '1px solid var(--hair)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg overflow-hidden" style={{ width: 32, height: 32 }}>
                  <ImageWithFallback src={nexusEmblem} alt="NEXUS" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="tracking-widest" style={{ color: 'var(--text)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em' }}>NEXUS STUDIO</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>Invoice #{invoiceNo}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="rounded-md px-2.5 py-1"
                  style={{
                    background: paid ? 'rgba(34,197,94,0.1)' : 'rgba(255,181,71,0.1)',
                    border: `1px solid ${paid ? 'rgba(34,197,94,0.35)' : 'rgba(255,181,71,0.35)'}`,
                    color: paid ? '#22C55E' : '#FFB547',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                >
                  {paid ? 'PAID' : 'AWAITING PAYMENT'}
                </span>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center rounded-md"
                  style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              <div className="flex justify-between mb-6">
                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>BILLED TO</div>
                  <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{client?.name}</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>{client?.industry}</div>
                </div>
                <div className="text-right">
                  <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>PROJECT</div>
                  <div style={{ color: 'var(--text)', fontSize: 13 }}>{project}</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 4 }}>Net 30 · {notif.timestamp}</div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hair)' }}>
                {items.map((item, i) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-3"
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>{item.label}</span>
                    <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>{fmt(item.value)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-5">
                <div className="text-right">
                  <div style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 2 }}>Total due</div>
                  <div style={{ color: 'var(--accent)', fontSize: 26, fontWeight: 700 }}>{fmt(amount)}</div>
                </div>
              </div>

              <div
                className="mt-6 rounded-lg px-4 py-3"
                style={{ background: 'rgba(var(--accent-rgb),0.05)', border: '1px solid rgba(var(--accent-rgb),0.15)' }}
              >
                <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                  {paid
                    ? `Payment received from ${client?.name}. Reconciled automatically by Core.`
                    : `Core will follow up automatically if unpaid after 14 days.`}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
