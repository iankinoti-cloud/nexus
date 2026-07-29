import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useIsMobile } from './nav';

export function RootLayout() {
  const isMobile = useIsMobile();

  const ambient =
    'radial-gradient(1200px 800px at -10% -20%, rgba(var(--accent-rgb),0.08), transparent 55%), radial-gradient(900px 700px at 110% 120%, rgba(var(--accent-rgb),0.05), transparent 55%), var(--bg)';

  if (isMobile) {
    return (
      <div className="flex flex-col h-dvh w-full overflow-hidden" style={{ background: ambient, paddingTop: 'env(safe-area-inset-top)' }}>
        <MobileNav />
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
      </div>
    );
  }

  return (
    <div
      className="flex h-dvh w-full overflow-hidden p-3 gap-3"
      style={{ background: ambient }}
    >
      <Sidebar />
      <main
        className="flex-1 flex flex-col overflow-hidden rounded-2xl"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--hair)' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
