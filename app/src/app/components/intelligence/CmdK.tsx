import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, FolderKanban, Users, Building2, TrendingUp, BarChart3, BookOpen, Layers, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router';

interface QuickLink {
  label: string;
  path: string;
  icon: React.ElementType;
  group: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Agency Overview', path: '/', icon: LayoutDashboard, group: 'Navigate' },
  { label: 'Projects',        path: '/projects',    icon: FolderKanban, group: 'Navigate' },
  { label: 'Talent',          path: '/talent',      icon: Users,        group: 'Navigate' },
  { label: 'Production',      path: '/production',  icon: Layers,       group: 'Navigate' },
  { label: 'Pipeline',        path: '/pipeline',    icon: TrendingUp,   group: 'Navigate' },
  { label: 'Clients',         path: '/clients',     icon: Building2,    group: 'Navigate' },
  { label: 'Analytics',       path: '/analytics',   icon: BarChart3,    group: 'Navigate' },
  { label: 'Knowledge',       path: '/knowledge',   icon: BookOpen,     group: 'Navigate' },
];

interface CmdKProps {
  open: boolean;
  onClose: () => void;
}

export function CmdK({ open, onClose }: CmdKProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query.trim().length === 0
    ? QUICK_LINKS
    : QUICK_LINKS.filter(l =>
        l.label.toLowerCase().includes(query.toLowerCase()) ||
        l.path.includes(query.toLowerCase())
      );

  const go = useCallback((path: string) => {
    navigate(path);
    setQuery('');
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && filtered.length > 0) go(filtered[0].path);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, go, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cmdk-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          <motion.div
            key="cmdk-panel"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="fixed z-50"
            style={{
              top: '18vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(300px, 90vw, 560px)',
              background: 'var(--surface)',
              border: '1px solid var(--hair-2)',
              borderRadius: 16,
              boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(var(--accent-rgb),0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid var(--hair)' }}
            >
              <Search size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Navigate, search, or ask a question..."
                className="flex-1 bg-transparent outline-none"
                style={{
                  color: 'var(--text)',
                  fontSize: 'calc(14px * var(--fs))',
                  border: 'none',
                  padding: 0,
                }}
              />
              <kbd
                style={{
                  fontSize: 10,
                  color: 'var(--text-dim)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--hair-2)',
                  borderRadius: 4,
                  padding: '2px 5px',
                }}
              >
                ESC
              </kbd>
            </div>

            <div className="py-2 max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-5 py-6 text-center" style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
                  No matches for "{query}"
                </p>
              ) : (
                filtered.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.path}
                      onClick={() => go(link.path)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{
                        background: idx === 0 && query ? 'rgba(var(--accent-rgb),0.08)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(var(--accent-rgb),0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = idx === 0 && query ? 'rgba(var(--accent-rgb),0.08)' : 'transparent')}
                    >
                      <div
                        className="flex items-center justify-center rounded-md shrink-0"
                        style={{ width: 28, height: 28, background: 'var(--surface-2)', border: '1px solid var(--hair)' }}
                      >
                        <Icon size={13} style={{ color: 'var(--text-dim)' }} />
                      </div>
                      <span style={{ flex: 1, fontSize: 'calc(13px * var(--fs))', fontWeight: 450 }}>
                        {link.label}
                      </span>
                      <ArrowRight size={13} style={{ color: 'var(--text-dim)', opacity: 0.5 }} />
                    </button>
                  );
                })
              )}
            </div>

            <div
              className="flex items-center gap-3 px-4 py-2"
              style={{ borderTop: '1px solid var(--hair)', background: 'var(--surface-2)' }}
            >
              <span style={{ fontSize: 10, color: 'var(--text-dim)', opacity: 0.7 }}>
                ↑↓ navigate · Enter select · Esc dismiss
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function useCmdK() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return { open, setOpen };
}
