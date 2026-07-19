import { NavLink, useLocation } from 'react-router';
import { motion } from 'motion/react';
import {
  LayoutDashboard, FolderKanban, Users, Building2,
  BarChart3, Cpu, BookOpen, Bell, Settings, LogOut, ChevronDown
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

export function Sidebar() {
  const location = useLocation();
  const { notifications } = useNexus();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div
      className="flex flex-col h-full shrink-0 rounded-2xl overflow-hidden"
      style={{
        width: '240px',
        background: 'rgba(21,21,27,0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="rounded-lg overflow-hidden shrink-0" style={{ width: 34, height: 34 }}>
          <ImageWithFallback
            src={nexusEmblem}
            alt="NEXUS"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="tracking-widest" style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em' }}>
            NEXUS
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <NavLink
                to={item.path}
                end={item.end}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-colors duration-150 no-underline"
                style={{
                  color: isActive ? 'var(--accent)' : '#A1A1AA',
                  background: isActive ? 'rgba(var(--accent-rgb),0.08)' : 'transparent',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(var(--accent-rgb),0.25)' : 'none',
                  fontSize: 13.5,
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <Icon size={16} style={{ opacity: isActive ? 1 : 0.7 }} />
                <span className="flex-1">{item.label}</span>
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 18,
                      height: 18,
                      background: 'var(--accent)',
                      color: '#0B0B0F',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* User */}
      <UserBlock />
    </div>
  );
}

function UserBlock() {
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
          className="rounded-full shrink-0 object-cover"
          style={{ width: 34, height: 34 }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full shrink-0"
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
      <div className="flex-1 min-w-0">
        <div className="truncate" style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500 }}>{displayName}</div>
        <div style={{ color: '#A1A1AA', fontSize: 11 }}>
          {session ? 'Workspace synced' : guest ? 'Guest · local workspace' : 'Creative Director'}
        </div>
      </div>
      {session || guest ? (
        <button
          onClick={signOut}
          title="Sign out"
          className="flex items-center justify-center rounded-md"
          style={{ width: 26, height: 26, background: 'transparent', border: 'none', cursor: 'pointer', color: '#A1A1AA' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#FF6B6B')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#A1A1AA')}
        >
          <LogOut size={14} />
        </button>
      ) : (
        <ChevronDown size={14} style={{ color: '#A1A1AA', opacity: 0.6 }} />
      )}
    </div>
  );
}
