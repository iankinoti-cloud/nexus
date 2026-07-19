import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';

export function RootLayout() {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden p-3 gap-3"
      style={{
        background:
          'radial-gradient(1200px 800px at -10% -20%, rgba(var(--accent-rgb),0.05), transparent 60%), #0B0B0F',
      }}
    >
      <Sidebar />
      <main
        className="flex-1 flex flex-col overflow-hidden rounded-2xl"
        style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
