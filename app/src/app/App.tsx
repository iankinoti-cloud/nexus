import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { initTheme } from './lib/theme';
import { NexusProvider } from './data/store';
import { Splash } from './components/Splash';

initTheme();
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/AuthProvider';
import { LoginScreen } from './auth/LoginScreen';
import { OnboardingProvider } from './onboarding/OnboardingProvider';
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
import { EnquiriesPage } from './components/pages/EnquiriesPage';
import { TalentPoolPage } from './components/pages/TalentPoolPage';
import { ProductionPage } from './components/pages/ProductionPage';
import { RfpScannerPage } from './components/pages/RfpScannerPage';
import { PipelinePage } from './components/pages/PipelinePage';
import { StoryPage } from './components/pages/story/StoryPage';

const pages = [
  { index: true, Component: DashboardPage },
  { path: 'projects', Component: ProjectsPage },
  { path: 'talent', Component: TalentPage },
  { path: 'talent-pool', Component: TalentPoolPage },
  { path: 'production', Component: ProductionPage },
  { path: 'rfp-scanner', Component: RfpScannerPage },
  { path: 'enquiries', Component: EnquiriesPage },
  { path: 'pipeline', Component: PipelinePage },
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
  {
    path: '/story',
    Component: StoryPage,
    ErrorBoundary: RouteError,
  },
]);

function Gate() {
  const { session, guest, loading } = useAuth();

  return (
    <OnboardingProvider>
      {loading ? null : !session && !guest ? (
        <LoginScreen />
      ) : (
        <NexusProvider>
          <RouterProvider router={router} />
        </NexusProvider>
      )}
    </OnboardingProvider>
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
