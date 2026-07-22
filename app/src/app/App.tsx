import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { initTheme } from './lib/theme';
import { NexusProvider } from './data/store';
import { Splash } from './components/Splash';

initTheme();
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginScreen } from './auth/LoginScreen';
import { AppErrorBoundary, RouteError } from './components/ErrorBoundary';
import { RootLayout } from './components/layout/RootLayout';
import { DashboardPage } from './components/pages/DashboardPage';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { TalentPage } from './components/pages/TalentPage';
import { ClientsPage } from './components/pages/ClientsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { CorePage } from './components/pages/CorePage';
import { KnowledgePage } from './components/pages/KnowledgePage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { SettingsPage } from './components/pages/SettingsPage';

// Each page gets its own error boundary so a crash degrades that one panel
// while the shell (sidebar / mobile nav) keeps running.
const pages = [
  { index: true, Component: DashboardPage },
  { path: 'projects', Component: ProjectsPage },
  { path: 'talent', Component: TalentPage },
  { path: 'clients', Component: ClientsPage },
  { path: 'analytics', Component: AnalyticsPage },
  { path: 'core', Component: CorePage },
  { path: 'knowledge', Component: KnowledgePage },
  { path: 'notifications', Component: NotificationsPage },
  { path: 'settings', Component: SettingsPage },
].map(r => ({ ...r, ErrorBoundary: RouteError }));

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteError,
    children: pages,
  },
]);

function Gate() {
  const { cloudMode, loading, session, guest } = useAuth();

  if (cloudMode && loading) {
    return <div className="h-screen w-screen" style={{ background: 'var(--bg)' }} />;
  }
  // Landing always gates entry — Supabase or not. In local/no-cloud mode the
  // screen leads with "Explore as guest"; with cloud, Google sign-in appears.
  if (!session && !guest) {
    return <LoginScreen />;
  }
  return (
    <NexusProvider>
      <RouterProvider router={router} />
    </NexusProvider>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  return (
    <AppErrorBoundary>
      <AuthProvider>
        {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
        <Gate />
        <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            border: '1px solid rgba(var(--accent-rgb),0.25)',
            color: 'var(--text)',
          },
        }}
        />
      </AuthProvider>
    </AppErrorBoundary>
  );
}
