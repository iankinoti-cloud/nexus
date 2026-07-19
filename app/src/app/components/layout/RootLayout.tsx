import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';

export function RootLayout() {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden p-3 gap-3"
      style={{
        background:
          'radial-gradient(1200px 800px at -10% -20%, rgba(var(--accent-rgb),0.08), transparent 55%), radial-gradient(900px 700px at 110% 120%, rgba(var(--accent-rgb),0.05), transparent 55%), var(--bg)',
      }}
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
