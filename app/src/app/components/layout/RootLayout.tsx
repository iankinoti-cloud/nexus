import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useIsMobile } from './nav';
import { SpotlightManager } from '../../onboarding/SpotlightManager';
import { SidebarTour } from '../../onboarding/SidebarTour';
import { IntelligenceHeader } from '../intelligence/IntelligenceHeader';
import { CmdK, useCmdK } from '../intelligence/CmdK';

export function RootLayout() {
  const isMobile = useIsMobile();
  const { open: cmdKOpen, setOpen: setCmdKOpen } = useCmdK();

  const ambient =
    'radial-gradient(1200px 800px at -10% -20%, rgba(var(--accent-rgb),0.08), transparent 55%), radial-gradient(900px 700px at 110% 120%, rgba(var(--accent-rgb),0.05), transparent 55%), var(--bg)';

  if (isMobile) {
    return (
      <div className="flex flex-col h-dvh w-full overflow-hidden" style={{ background: ambient, paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-end px-3 py-2 shrink-0">
          <IntelligenceHeader />
        </div>
        <MobileNav />
        <SpotlightManager />
        <SidebarTour />
        <main
          className="flex-1 flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--hair)',
            margin: '0 8px 8px',
            marginBottom: 'max(8px, env(safe-area-inset-bottom))',
          }}
        >
          <Outlet />
        </main>
        <CmdK open={cmdKOpen} onClose={() => setCmdKOpen(false)} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-dvh w-full overflow-hidden"
      style={{ background: ambient }}
    >
      <SpotlightManager />
      <SidebarTour />
      <div className="flex items-center justify-end px-4 py-2 shrink-0" style={{ borderBottom: '1px solid var(--hair)' }}>
        <IntelligenceHeader />
      </div>
      <div className="flex flex-1 overflow-hidden p-3 gap-3">
        <Sidebar />
        <main
          className="flex-1 flex flex-col overflow-hidden rounded-2xl"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--hair)' }}
        >
          <Outlet />
        </main>
      </div>
      <CmdK open={cmdKOpen} onClose={() => setCmdKOpen(false)} />
    </div>
  );
}
