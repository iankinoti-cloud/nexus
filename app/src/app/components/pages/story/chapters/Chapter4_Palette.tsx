import { motion } from 'motion/react';

const TER = '#E07A52';

const STAGES = [
  { label: 'ENQUIRY',    desc: 'Client submits a brief',           color: '#1B2D4E', text: '#F5F0E8' },
  { label: 'PROPOSAL',   desc: 'Core drafts it in seconds',        color: '#B87820', text: '#F5F0E8' },
  { label: 'PRODUCTION', desc: 'Talent assigned, timeline locked', color: '#D0542C', text: '#F5F0E8' },
  { label: 'INVOICE',    desc: 'Sent the moment work is approved', color: '#2A9E72', text: '#F5F0E8' },
];

export function Chapter4_Palette() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: '#0F0D0B',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {STAGES.map((stage, i) => (
        <motion.div
          key={stage.label}
          initial={{ flex: 0 }}
          animate={{ flex: 1 }}
          transition={{ delay: 0.06 + i * 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: stage.color,
            position: 'relative', overflow: 'hidden', minHeight: 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.15, duration: 0.38 }}
            style={{
              position: 'absolute',
              left: 'clamp(28px, 5vw, 72px)',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
            }}
          >
            <span style={{
              color: stage.text,
              fontSize: 'clamp(18px, 2.4vw, 28px)',
              letterSpacing: '0.14em',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}>
              {stage.label}
            </span>
            <span style={{
              color: stage.text,
              fontSize: 'clamp(12px, 1.4vw, 16px)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              opacity: 0.72,
              letterSpacing: '0.01em',
            }}>
              — {stage.desc}
            </span>
          </motion.div>

          {/* Step number — right edge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.3 }}
            style={{
              position: 'absolute',
              right: 'clamp(28px, 5vw, 72px)',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 60px)',
              color: stage.text,
              lineHeight: 1,
            }}
          >
            {`0${i + 1}`}
          </motion.div>
        </motion.div>
      ))}

      {/* Vertical terracotta center line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.85, duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 1.5, background: TER,
          transformOrigin: 'top', opacity: 0.35,
        }}
      />

      {/* Overlay stamp */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 300, damping: 26 }}
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', pointerEvents: 'none',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3.2vw, 42px)',
          color: '#F5F0E8', lineHeight: 1.2,
          background: 'rgba(15,13,11,0.84)',
          backdropFilter: 'blur(14px)',
          padding: 'clamp(14px, 2vw, 22px) clamp(22px, 3.5vw, 36px)',
          borderRadius: 4,
        }}>
          BRIEF TO INVOICE.
          <br />
          <span style={{ color: TER }}>IN ONE PLACE.</span>
        </div>
      </motion.div>
    </div>
  );
}
