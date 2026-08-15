import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Settings } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import nexusEmblem from '../../imports/NEXUS-_-EMBLEM.jpeg';
import { useOnboarding } from './OnboardingProvider';
import { WizardStepper } from './WizardStepper';
import { ExplorationStep1, ExplorationStep2 } from './ExplorationTour';
import { SetupStep1, SetupStep2, SetupStep3, SetupStep4 } from './SetupWizard';

const EXPLORATION_TOTAL = 2;
const SETUP_TOTAL = 4;

function IntentCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ borderColor: color, background: `${color}08` }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-2xl p-5 text-left w-full"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--hair)',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ width: 40, height: 40, background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div style={{ color: 'var(--text)', fontSize: 'calc(14px * var(--fs))', fontWeight: 600, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </motion.button>
  );
}

function slideVariants(dir: number) {
  return {
    initial: { opacity: 0, x: dir * 24 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: dir * -24 },
  };
}

export function WelcomeModal() {
  const ob = useOnboarding();
  const [prevStep, setPrevStep] = useState(0);
  const dir = ob.step >= prevStep ? 1 : -1;

  if (ob.dismissed) return null;

  function advance() {
    setPrevStep(ob.step);
    ob.advanceStep();
  }
  function back() {
    setPrevStep(ob.step);
    ob.goBack();
  }
  function pick(track: 'exploration' | 'setup') {
    setPrevStep(0);
    ob.pickTrack(track);
  }
  function close() {
    ob.completeWizard();
  }

  const total = ob.track === 'exploration' ? EXPLORATION_TOTAL : ob.track === 'setup' ? SETUP_TOTAL : 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(18px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex flex-col"
        style={{
          maxWidth: 440,
          background: 'var(--surface)',
          border: '1px solid rgba(var(--accent-rgb),0.18)',
          borderRadius: 'var(--radius-blob)',
          padding: '32px 28px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(var(--accent-rgb),0.08)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        {ob.step === 0 && (
          <div className="flex flex-col items-center text-center mb-7">
            <div className="rounded-2xl overflow-hidden mb-4" style={{ width: 60, height: 60, boxShadow: '0 0 40px rgba(var(--accent-rgb),0.18)' }}>
              <ImageWithFallback src={nexusEmblem} alt="NEXUS" className="w-full h-full object-cover" />
            </div>
            <div style={{ color: 'var(--text)', fontSize: 'calc(22px * var(--fs))', fontWeight: 700, letterSpacing: '0.18em', marginBottom: 6 }}>
              NEXUS
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
              The Operating System for Creative Enterprises.
            </p>
          </div>
        )}

        {ob.step > 0 && ob.track && (
          <div className="mb-6">
            <WizardStepper total={total} current={ob.step} />
          </div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${ob.track}-${ob.step}`}
            variants={slideVariants(dir)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {ob.step === 0 && (
              <div className="flex flex-col gap-4">
                <p style={{ color: 'var(--text)', fontSize: 'calc(16px * var(--fs))', fontWeight: 600, textAlign: 'center', marginBottom: 4 }}>
                  What brings you here?
                </p>
                <IntentCard
                  icon={Compass}
                  title="I'm exploring NEXUS"
                  description="Show me what this does. I have 5 minutes and want to see the AI in action."
                  color="var(--accent)"
                  onClick={() => pick('exploration')}
                />
                <IntentCard
                  icon={Settings}
                  title="I'm setting up my workspace"
                  description="I've decided to use NEXUS and want to configure it for my agency."
                  color="#A855F7"
                  onClick={() => pick('setup')}
                />
              </div>
            )}

            {ob.track === 'exploration' && ob.step === 1 && <ExplorationStep1 />}
            {ob.track === 'exploration' && ob.step === 2 && <ExplorationStep2 onClose={close} />}

            {ob.track === 'setup' && ob.step === 1 && <SetupStep1 />}
            {ob.track === 'setup' && ob.step === 2 && <SetupStep2 />}
            {ob.track === 'setup' && ob.step === 3 && <SetupStep3 />}
            {ob.track === 'setup' && ob.step === 4 && <SetupStep4 onClose={close} />}
          </motion.div>
        </AnimatePresence>

        {/* Back / skip */}
        {ob.step > 0 && (
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={back}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}
            >
              ← Back
            </button>
            <button
              onClick={close}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))' }}
            >
              Skip for now
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
