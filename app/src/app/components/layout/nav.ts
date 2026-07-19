import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Users, Building2,
  BarChart3, Cpu, BookOpen, Bell, Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
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

export function isPathActive(pathname: string, item: { path: string; end: boolean }) {
  return item.end ? pathname === item.path : pathname.startsWith(item.path);
}

export function useIsMobile(query = '(max-width: 820px)') {
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
