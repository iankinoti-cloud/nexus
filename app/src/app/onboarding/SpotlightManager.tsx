import { useNavigate } from 'react-router';
import { useOnboarding } from './OnboardingProvider';
import { SpotlightBeacon } from './SpotlightBeacon';

interface SpotlightConfig {
  selector: string;
  title: string;
  body: string;
  actionLabel: string;
  navigateTo?: string;
}

const SPOTLIGHT_MAP: Record<string, SpotlightConfig> = {
  core: {
    selector: '[data-nav="core"]',
    title: 'Meet Core AI',
    body: 'Ask Core a question about your agency — it knows your projects, team, and clients. Try "What should I focus on today?"',
    actionLabel: 'Open Core AI',
    navigateTo: '/core',
  },
  analytics: {
    selector: '[data-nav="analytics"]',
    title: 'Revenue at a glance',
    body: 'Analytics tracks revenue trends, project completion rates, and client satisfaction — all in one view.',
    actionLabel: 'Explore Analytics',
    navigateTo: '/analytics',
  },
};

export function SpotlightManager() {
  const { dismissed, pendingSpotlight, allGuidanceDismissed, dismissSpotlight } = useOnboarding();
  const navigate = useNavigate();

  if (!dismissed || allGuidanceDismissed || !pendingSpotlight) return null;

  const config = SPOTLIGHT_MAP[pendingSpotlight];
  if (!config) {
    dismissSpotlight();
    return null;
  }

  function handleAction() {
    if (config.navigateTo) navigate(config.navigateTo);
  }

  return (
    <SpotlightBeacon
      key={pendingSpotlight}
      targetSelector={config.selector}
      title={config.title}
      body={config.body}
      actionLabel={config.actionLabel}
      onAction={handleAction}
    />
  );
}
