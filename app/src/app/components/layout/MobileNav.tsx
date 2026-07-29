import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import nexusEmblem from '../../../imports/NEXUS-_-EMBLEM.jpeg';
import { useNexus } from '../../data/store';
import { NAV_ITEMS, isPathActive } from './nav';
import { UserBlock } from './Sidebar';

export function MobileNav() {
  const location = useLocation();
  const { notifications } = useNexus();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      {/* Top bar (in flow — pushes content down) */}
      <div
        className="glass flex items-center gap-3 px-4 shrink-0 relative z-40"
        style={{ height: 56, borderRadius: 16, margin: '8px 8px 0' }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex items-center justify-center rounded-lg"
          style={{ width: 36, height: 36, background: 'rgba(var(--accent-rgb),0.1)', border: '1px solid rgba(var(--accent-rgb),0.25)', color: 'var(--accent)', cursor: 'pointer' }}
        >
          <Menu size={18} />
        </button>
        <div className="rounded-lg overflow-hidden shrink-0" style={{ width: 30, height: 30 }}>
          <ImageWithFallback src={nexusEmblem} alt="NEXUS" className="w-full h-full object-cover" />
        </div>
        <span className="tracking-widest" style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', fontWeight: 700, letterSpacing: '0.18em' }}>NEXUS</span>
        {unreadCount > 0 && (
          <span
            className="ml-auto flex items-center justify-center rounded-full"
            style={{ width: 22, height: 22, background: 'var(--accent)', color: '#0B0B0F', fontSize: 'calc(11px * var(--fs))', fontWeight: 700 }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && [
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
          />,
          <motion.div
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="glass glass-strong fixed top-0 bottom-0 left-0 z-50 flex flex-col"
            style={{ width: 268, borderRadius: '0 20px 20px 0', paddingTop: 'env(safe-area-inset-top)' }}
          >
              <div
                className="flex items-center gap-3 px-5 py-5"
                style={{ borderBottom: '1px solid var(--hair)' }}
              >
                <div className="rounded-lg overflow-hidden shrink-0" style={{ width: 34, height: 34 }}>
                  <ImageWithFallback src={nexusEmblem} alt="NEXUS" className="w-full h-full object-cover" />
                </div>
                <span className="flex-1 tracking-widest" style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 700, letterSpacing: '0.18em' }}>NEXUS</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex items-center justify-center rounded-md"
                  style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex-1 min-h-0 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = isPathActive(location.pathname, item);
                  const Icon = item.icon;
                  const prevGroup = idx > 0 ? NAV_ITEMS[idx - 1].group : null;
                  const groupChanged = prevGroup !== null && prevGroup !== item.group;
                  return (
                    <div key={item.path}>
                      {groupChanged && (
                        <div style={{ padding: '6px 0 2px' }}>
                          <div style={{ height: 1, background: 'var(--hair)', margin: '0 12px' }} />
                          <p style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 14px 2px', opacity: 0.55, margin: 0 }}>
                            {item.group}
                          </p>
                        </div>
                      )}
                      <NavLink
                        to={item.path}
                        end={item.end}
                        className="flex items-center gap-3 rounded-xl no-underline relative"
                        style={{
                          padding: '12px 14px',
                          color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                          background: isActive ? 'rgba(var(--accent-rgb),0.12)' : 'transparent',
                          border: isActive ? '1px solid rgba(var(--accent-rgb),0.3)' : '1px solid transparent',
                          fontSize: 'calc(15px * var(--fs))',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        <Icon size={18} style={{ opacity: isActive ? 1 : 0.85 }} />
                        <span className="flex-1">{item.label}</span>
                        {item.label === 'Notifications' && unreadCount > 0 && (
                          <span
                            className="flex items-center justify-center rounded-full"
                            style={{ width: 20, height: 20, background: 'var(--accent)', color: '#0B0B0F', fontSize: 'calc(11px * var(--fs))', fontWeight: 700 }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </NavLink>
                    </div>
                  );
                })}
              </nav>

            <div className="shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <UserBlock open />
            </div>
          </motion.div>,
        ]}
      </AnimatePresence>
    </>
  );
}
