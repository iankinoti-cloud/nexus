import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Users, Building2,
  BarChart3, BookOpen, Settings, Layers, TrendingUp,
  Cpu, Inbox, ScanSearch, Bell,
} from 'lucide-react';

export const NAV_ITEMS = [
  // ── COMMAND ──────────────────────────────────────────────────────────────────
  { label: 'Overview',      icon: LayoutDashboard, path: '/',              end: true,  group: 'COMMAND' },
  { label: 'Core',          icon: Cpu,             path: '/core',          end: false, group: 'COMMAND' },

  // ── WORK ─────────────────────────────────────────────────────────────────────
  { label: 'Projects',      icon: FolderKanban,    path: '/projects',      end: false, group: 'WORK' },
  { label: 'Talent',        icon: Users,           path: '/talent',        end: false, group: 'WORK' },
  { label: 'Production',    icon: Layers,          path: '/production',    end: false, group: 'WORK' },

  // ── GROWTH ────────────────────────────────────────────────────────────────────
  { label: 'Pipeline',      icon: TrendingUp,      path: '/pipeline',      end: false, group: 'GROWTH' },
  { label: 'Enquiries',     icon: Inbox,           path: '/enquiries',     end: false, group: 'GROWTH' },
  { label: 'RFP Scanner',   icon: ScanSearch,      path: '/rfp-scanner',   end: false, group: 'GROWTH' },
  { label: 'Clients',       icon: Building2,       path: '/clients',       end: false, group: 'GROWTH' },

  // ── BUSINESS ─────────────────────────────────────────────────────────────────
  { label: 'Analytics',     icon: BarChart3,       path: '/analytics',     end: false, group: 'BUSINESS' },
  { label: 'Knowledge',     icon: BookOpen,        path: '/knowledge',     end: false, group: 'BUSINESS' },

  // ── SYSTEM ───────────────────────────────────────────────────────────────────
  { label: 'Notifications', icon: Bell,            path: '/notifications', end: false, group: 'SYSTEM' },
  { label: 'Settings',      icon: Settings,        path: '/settings',      end: false, group: 'SYSTEM' },
];

export function isPathActive(pathname: string, item: { path: string; end: boolean }) {
  return item.end ? pathname === item.path : pathname.startsWith(item.path);
}

export function useIsMobile(query = '(max-width: 1023px)') {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return mobile;
}
