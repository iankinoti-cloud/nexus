import { createBrowserRouter, RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { NexusProvider } from './data/store';
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

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'projects', Component: ProjectsPage },
      { path: 'talent', Component: TalentPage },
      { path: 'clients', Component: ClientsPage },
      { path: 'analytics', Component: AnalyticsPage },
      { path: 'core', Component: CorePage },
      { path: 'knowledge', Component: KnowledgePage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);

export default function App() {
  return (
    <NexusProvider>
      <RouterProvider router={router} />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#15151B',
            border: '1px solid rgba(79,209,197,0.25)',
            color: '#F4F4F5',
          },
        }}
      />
    </NexusProvider>
  );
}
