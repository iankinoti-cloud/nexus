import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, FolderKanban, Users, Building2,
  BarChart3, Cpu, BookOpen, Bell, Settings, LogOut, ChevronDown,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import nexusEmblem from '../../../imports/NEXUS-_-EMBLEM.jpeg';
import { useNexus } from '../../data/store';
import { useAuth } from '../../auth/AuthProvider';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', end: true },
  { label: 'Projects', icon: FolderKanban, path: '/projects', end: false },
  { label: 'Talent', icon: Users, path: '/talent', end: false },
  { label: 'Clients', icon: Building2, path: '/clients', end: false },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', end: false },
  { label: 'Core', icon: Cpu, path: '/core', end: false },
  { label: 'Knowledge', icon: BookOpen, path: '/knowledge', end: false },
  { label: 'Notifications', icon: Bell, path: '/notifications', end: false },
  { label: 'Settings', icon: Settings, path: '/settings', end: false },
];

const PIN_KEY = 'nexus-sidebar-collapsed';
const COLLAPSED = 68;
const EXPANDED = 240;

export function Sidebar() {
  const location = useLocation();
  const { notifications } = useNexus();
  const unreadCount = notifications.filter(n => !n.read).length;

  const [pinned, setPinned] = useState(() => localStorage.getItem(PIN_KEY) === '1');
  const [hovered, setHovered] = useState(false);
  const open = !pinned || hovered;

  const togglePin = () => {
    setPinned(p => {
      const next = !p;
      localStorage.setItem(PIN_KEY, next ? '1' : '0');
      return next;
    });
  };

  return (
    // Layout footprint stays at the collapsed/expanded pinned width;
    // the visible panel expands OVER the content on hover (no reflow jank).
    <div style={{ width: pinned ? COLLAPSED : EXPANDED, flexShrink: 0, position: 'relative' }}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ width: open ? EXPANDED : COLLAPSED }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 30,
          background: 'rgba(21,21,27,0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: pinned && hovered ? '0 12px 48px rgba(0,0,0,0.5)' : '0 8px 40px rgba(0,0,0,0.35)',
        }}
      >
        {/* Logo + collapse toggle */}
        <div
          className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 74 }}
        >
          <div className="rounded-lg overflow-hidden shrink-0" style={{ width: 34, height: 34 }}>
            <ImageWithFallback src={nexusEmblem} alt="NEXUS" className="w-full h-full object-cover" />
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0 tracking-widest"
                style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', whiteSpace: 'nowrap' }}
              >
                NEXUS
              </motion.div>
            )}
          </AnimatePresence>
          {open && (
            <button
              onClick={togglePin}
              title={pinned ? 'Keep sidebar open' : 'Collapse sidebar'}
              className="flex items-center justify-center rounded-md shrink-0"
              style={{ width: 26, height: 26, background: 'transparent', border: 'none', cursor: 'pointer', color: '#A1A1AA' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#A1A1AA')}
            >
              {pinned ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                title={item.label}
                className="flex items-center gap-3 rounded-lg relative no-underline"
                style={{
                  padding: '10px 12px',
                  color: isActive ? 'var(--accent)' : '#A1A1AA',
                  background: isActive ? 'rgba(var(--accent-rgb),0.08)' : 'transparent',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(var(--accent-rgb),0.25)' : 'none',
                  fontSize: 13.5,
                  fontWeight: isActive ? 500 : 400,
                  transition: 'color 0.15s ease, background 0.15s ease',
                }}
              >
                <div className="relative shrink-0" style={{ width: 16, height: 16 }}>
                  <Icon size={16} style={{ opacity: isActive ? 1 : 0.7 }} />
                  {/* Unread dot on the icon when collapsed */}
                  {!open && item.label === 'Notifications' && unreadCount > 0 && (
                    <span
                      className="absolute rounded-full"
                      style={{ top: -3, right: -3, width: 8, height: 8, background: 'var(--accent)', border: '2px solid #15151B' }}
                    />
                  )}
                </div>
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="flex-1"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {open && item.label === 'Notifications' && unreadCount > 0 && (
                  <span
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: 18, height: 18, background: 'var(--accent)', color: '#0B0B0F', fontSize: 10, fontWeight: 700 }}
                  >
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <UserBlock open={open} />
      </motion.div>
    </div>
  );
}

function UserBlock({ open }: { open: boolean }) {
  const { session, guest, displayName, avatarUrl, signOut } = useAuth();
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="px-4 py-4 flex items-center gap-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          referrerPolicy="no-referrer"
          title={displayName}
          className="rounded-full shrink-0 object-cover"
          style={{ width: 34, height: 34 }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          title={displayName}
          style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--accent) 0%, #22C55E 100%)',
            fontSize: 12,
            fontWeight: 700,
            color: '#0B0B0F',
          }}
        >
          {initials}
        </div>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex-1 min-w-0 flex items-center gap-2"
          >
            <div className="flex-1 min-w-0">
              <div className="truncate" style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500 }}>{displayName}</div>
              <div style={{ color: '#A1A1AA', fontSize: 11, whiteSpace: 'nowrap' }}>
                {session ? 'Workspace synced' : guest ? 'Guest · local workspace' : 'Creative Director'}
              </div>
            </div>
            {session || guest ? (
              <button
                onClick={signOut}
                title="Sign out"
                className="flex items-center justify-center rounded-md shrink-0"
                style={{ width: 26, height: 26, background: 'transparent', border: 'none', cursor: 'pointer', color: '#A1A1AA' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#FF6B6B')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#A1A1AA')}
              >
                <LogOut size={14} />
              </button>
            ) : (
              <ChevronDown size={14} style={{ color: '#A1A1AA', opacity: 0.6 }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
