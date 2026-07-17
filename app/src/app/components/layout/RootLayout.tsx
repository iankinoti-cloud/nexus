import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';

export function RootLayout() {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: '#0B0B0F' }}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
