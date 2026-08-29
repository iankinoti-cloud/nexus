import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen, Settings, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import nexusEmblem from '../../../imports/NEXUS-_-EMBLEM.jpeg';
import { useNexus } from '../../data/store';
import { useAuth } from '../../auth/AuthProvider';
import { NAV_ITEMS, isPathActive } from './nav';

const PIN_KEY = 'nexus-sidebar-collapsed';
const COLLAPSED = 68;
const EXPANDED = 240;

export function Sidebar() {
  const location = useLocation();
  const { notifications } = useNexus();
  const unreadCount = notifications.filter(n => !n.read).length;

  const [pinned, setPinned] = useState(() => localStorage.getItem(PIN_KEY) === '1');
  const [hovered, setHovered] = useState(false);
  const [navHover, setNavHover] = useState<string | null>(null);
  const open = !pinned || hovered;

  const activePath = NAV_ITEMS.find(i => isPathActive(location.pathname, i))?.path;
  const highlight = navHover ?? activePath;

  const togglePin = () => {
    setPinned(p => {
      const next = !p;
      localStorage.setItem(PIN_KEY, next ? '1' : '0');
      return next;
    });
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div style={{ width: pinned ? COLLAPSED : EXPANDED, flexShrink: 0, position: 'relative' }}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setNavHover(null); }}
        animate={{ width: open ? EXPANDED : COLLAPSED }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 30,
          background: '#000000',
          boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
        }}
      >

        <div
          className="flex items-center gap-3 px-4 py-5 relative"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 74 }}
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
                style={{ color: '#FFFFFF', fontSize: 'calc(13px * var(--fs))', fontWeight: 700, letterSpacing: '0.18em', whiteSpace: 'nowrap' }}
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
              style={{ width: 26, height: 26, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
            >
              {pinned ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>
          )}
        </div>

        <nav className="flex-1 min-h-0 px-3 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden relative">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activePath === item.path;
            const isHi = highlight === item.path;
            const Icon = item.icon;
            const prevGroup = idx > 0 ? NAV_ITEMS[idx - 1].group : null;
            const groupChanged = prevGroup !== null && prevGroup !== item.group;
            return (
              <div key={item.path}>
                {groupChanged && (
                  <div style={{ padding: '6px 0 2px' }}>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginLeft: open ? 12 : 8, marginRight: open ? 12 : 8 }} />
                    <AnimatePresence>
                      {open && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                          style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px 2px' }}
                        >
                          {item.group}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <NavLink
                  to={item.path}
                  end={item.end}
                  title={item.label}
                  data-nav={item.label.toLowerCase().replace(/\s+/g, '-')}
                  onMouseEnter={() => setNavHover(item.path)}
                  className="flex items-center gap-3 rounded-xl relative no-underline"
                  style={{
                    padding: '10px 12px',
                    color: isHi ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                    fontSize: 'calc(13.5px * var(--fs))',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'color 0.18s ease',
                  }}
                >
                  {isHi && (
                    <motion.div
                      layoutId="liquidPill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'rgba(var(--accent-rgb),0.14)',
                        border: '1px solid rgba(var(--accent-rgb),0.35)',
                        boxShadow: 'inset 0 1px 0 0 var(--glass-rim), 0 6px 18px -6px rgba(var(--accent-rgb),0.5)',
                        backdropFilter: 'blur(6px) saturate(160%)',
                      }}
                      transition={{ type: 'spring', stiffness: 230, damping: 19, mass: 0.9 }}
                    />
                  )}
                  <div className="relative shrink-0 z-10" style={{ width: 16, height: 16 }}>
                    <Icon size={16} style={{ opacity: isHi ? 1 : 0.85 }} />
                    {!open && item.label === 'Notifications' && unreadCount > 0 && (
                      <span
                        className="absolute rounded-full"
                        style={{ top: -3, right: -3, width: 8, height: 8, background: 'var(--accent)', border: '2px solid var(--surface)' }}
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
                        className="flex-1 relative z-10"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {open && item.label === 'Notifications' && unreadCount > 0 && (
                    <span
                      className="flex items-center justify-center rounded-full shrink-0 relative z-10"
                      style={{ width: 18, height: 18, background: 'var(--accent)', color: '#F5F0E8', fontSize: 'calc(10px * var(--fs))', fontWeight: 700 }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </div>
            );
          })}
        </nav>

        <UserBlock open={open} />
      </motion.div>
    </div>
  );
}

export function UserBlock({ open = true }: { open?: boolean }) {
  const { session, guest, displayName, avatarUrl, signOut } = useAuth();
  const { resetDemo } = useNexus();
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);
  const [popover, setPopover] = useState(false);
  const initials = displayName.split(' ').map(w => w[0] ?? '').filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

  const avatar = avatarUrl && !imgFailed ? (
    <img
      src={avatarUrl}
      alt={displayName}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className="rounded-full shrink-0 object-cover"
      style={{ width: 34, height: 34 }}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 34, height: 34,
        background: 'linear-gradient(135deg, var(--accent) 0%, #6BA888 100%)',
        fontSize: 'calc(12px * var(--fs))', fontWeight: 700, color: '#F5F0E8',
      }}
    >
      {initials}
    </div>
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setPopover(true)}
      onMouseLeave={() => setPopover(false)}
    >
      {/* Hover popover — appears above the user block */}
      <AnimatePresence>
        {popover && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 8,
              right: 8,
              marginBottom: 6,
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: '12px 0 8px',
              boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
              zIndex: 50,
              minWidth: 180,
            }}
          >
            {/* User info */}
            <div className="flex items-center gap-2.5 px-3 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ flexShrink: 0 }}>{avatar}</div>
              <div className="min-w-0">
                <div className="truncate" style={{ color: '#FFFFFF', fontSize: 'calc(12px * var(--fs))', fontWeight: 600 }}>{displayName}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'calc(10px * var(--fs))' }}>
                  {session ? 'Workspace synced' : guest ? 'Guest · local' : 'Creative Director'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col pt-1.5">
              <PopoverAction
                icon={<Settings size={13} />}
                label="Settings"
                onClick={() => { navigate('/settings'); setPopover(false); }}
              />
              <PopoverAction
                icon={<RotateCcw size={13} />}
                label="Reset workspace"
                onClick={() => { resetDemo(); setPopover(false); }}
              />
              {(session || guest) && (
                <PopoverAction
                  icon={<LogOut size={13} />}
                  label="Sign out"
                  onClick={() => { signOut(); setPopover(false); }}
                  danger
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User block row */}
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', cursor: 'default' }}>
        {avatar}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 min-w-0"
            >
              <div className="truncate" style={{ color: '#FFFFFF', fontSize: 'calc(13px * var(--fs))', fontWeight: 500 }}>{displayName}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'calc(11px * var(--fs))', whiteSpace: 'nowrap' }}>
                {session ? 'Workspace synced' : guest ? 'Guest · local workspace' : 'Creative Director'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {open && (
          <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, transform: popover ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s ease' }} />
        )}
      </div>
    </div>
  );
}

function PopoverAction({ icon, label, onClick, danger = false }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-2"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: danger ? '#EF4444' : 'rgba(255,255,255,0.7)',
        fontSize: 'calc(12px * var(--fs))',
        fontWeight: 400,
        textAlign: 'left',
        transition: 'color 0.12s ease, background 0.12s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
    >
      {icon}
      {label}
    </button>
  );
}
