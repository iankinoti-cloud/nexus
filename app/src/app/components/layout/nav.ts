import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Users, Building2,
  BarChart3, Cpu, BookOpen, Bell, Settings, Workflow, Database, Layers, FileSearch,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/',             end: true,  group: 'Workspace' },
  { label: 'Projects',    icon: FolderKanban,    path: '/projects',     end: false, group: 'Workspace' },
  { label: 'Talent',      icon: Users,           path: '/talent',       end: false, group: 'Talent & Ops' },
  { label: 'DMF Pool',    icon: Database,        path: '/talent-pool',  end: false, group: 'Talent & Ops' },
  { label: 'Production',  icon: Layers,          path: '/production',   end: false, group: 'Talent & Ops' },
  { label: 'RFP Scanner', icon: FileSearch,      path: '/rfp-scanner',  end: false, group: 'Growth' },
  { label: 'Enquiries',   icon: Workflow,        path: '/enquiries',    end: false, group: 'Growth' },
  { label: 'Clients',     icon: Building2,       path: '/clients',      end: false, group: 'Growth' },
  { label: 'Core',        icon: Cpu,             path: '/core',         end: false, group: 'Intelligence' },
  { label: 'Analytics',   icon: BarChart3,       path: '/analytics',    end: false, group: 'Intelligence' },
  { label: 'Knowledge',   icon: BookOpen,        path: '/knowledge',    end: false, group: 'System' },
  { label: 'Notifications', icon: Bell,          path: '/notifications',end: false, group: 'System' },
  { label: 'Settings',    icon: Settings,        path: '/settings',     end: false, group: 'System' },
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
