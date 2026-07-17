import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle, Clock, MessageSquare, DollarSign, AlertTriangle, Check
} from 'lucide-react';
import { PageShell } from '../layout/PageShell';
import { useNexus } from '../../data/store';
import type { Notification } from '../../data/types';

const CATEGORY_CONFIG = {
  project: { icon: CheckCircle, color: '#4FD1C5', bg: 'rgba(79,209,197,0.12)', label: 'Projects' },
  deadline: { icon: Clock, color: '#FFB547', bg: 'rgba(255,181,71,0.12)', label: 'Deadlines' },
  client: { icon: MessageSquare, color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', label: 'Clients' },
  invoice: { icon: DollarSign, color: '#22C55E', bg: 'rgba(34,197,94,0.12)', label: 'Invoices' },
  risk: { icon: AlertTriangle, color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', label: 'Risks' },
};

const TABS = ['All', 'Projects', 'Deadlines', 'Clients', 'Invoices', 'Risks'];

function NotificationRow({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const config = CATEGORY_CONFIG[notif.category];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 px-5 py-4 rounded-xl"
      style={{
        background: notif.read ? 'transparent' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)'}`,
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
          <div style={{ color: '#F4F4F5', fontSize: 13, fontWeight: notif.read ? 400 : 600, lineHeight: 1.4 }}>
            {notif.title}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span style={{ color: '#A1A1AA', fontSize: 11, whiteSpace: 'nowrap' }}>{notif.timestamp}</span>
            {!notif.read && (
              <div
                className="rounded-full shrink-0"
                style={{ width: 7, height: 7, background: '#4FD1C5' }}
              />
            )}
          </div>
        </div>
        <p style={{ color: '#A1A1AA', fontSize: 12, lineHeight: 1.5, marginTop: 3 }}>{notif.message}</p>
        <div className="flex items-center gap-3 mt-2.5">
          {notif.action && (
            <button
              style={{
                color: '#4FD1C5',
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
              style={{ color: '#A1A1AA', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
  const { notifications, markRead, markAllRead } = useNexus();
  const [activeTab, setActiveTab] = useState('All');

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
          <h1 style={{ color: '#F4F4F5', fontSize: 24, fontWeight: 600 }}>Notifications</h1>
          {unreadCount > 0 && (
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 22, height: 22, background: '#4FD1C5', color: '#0B0B0F', fontSize: 11, fontWeight: 700 }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              color: '#A1A1AA',
              fontSize: 13,
              background: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
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
              background: activeTab === tab ? 'rgba(79,209,197,0.1)' : 'transparent',
              border: `1px solid ${activeTab === tab ? 'rgba(79,209,197,0.3)' : 'rgba(255,255,255,0.06)'}`,
              color: activeTab === tab ? '#4FD1C5' : '#A1A1AA',
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
                  background: '#4FD1C5',
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
          <div className="flex flex-col items-center justify-center py-20" style={{ color: '#A1A1AA' }}>
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
              <NotificationRow notif={notif} onRead={markRead} />
            </motion.div>
          ))
        )}
      </div>
    </PageShell>
  );
}
