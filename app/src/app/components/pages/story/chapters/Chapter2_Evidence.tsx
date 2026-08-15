import { motion } from 'motion/react';
import { StampText } from '../StampText';

const BLK = '#0F0D0B';
const CRM = '#F5F0E8';
const TER = '#E07A52';
const SAG = '#6BA888';
const PAR = '#F7F4F0';
const CHR = '#2D2620';

const MODULES = [
  { name: 'PROJECTS',  desc: 'Active pipeline — budgets, timelines, risks', color: TER },
  { name: 'TALENT',    desc: 'Burnout-aware scheduling across your whole team', color: SAG },
  { name: 'CLIENTS',   desc: 'Full relationship dossiers with health scoring', color: '#C9A87C' },
  { name: 'ENQUIRIES', desc: 'RFP to proposal to invoice — one continuous flow', color: TER },
  { name: 'CORE',      desc: 'AI that detects risks and acts on your behalf', color: SAG },
  { name: 'ANALYTICS', desc: 'Revenue, capacity and forecasts — always live', color: '#C9A87C' },
];

export function Chapter2_Evidence() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* Left dark panel */}
      <div
        style={{
          flex: '0 0 42%',
          background: BLK,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(24px, 6vw, 72px)',
        }}
      >
        <StampText
          text="ONE"
          delay={0.1}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px, 10vw, 120px)',
            color: CRM, lineHeight: 0.95,
          }}
        />
        <StampText
          text="SYSTEM."
          delay={0.38}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px, 10vw, 120px)',
            color: TER, lineHeight: 0.95, marginBottom: 28,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            color: CRM, fontSize: 14, lineHeight: 1.68,
            fontFamily: 'Inter, sans-serif', maxWidth: 220,
          }}
        >
          Every part of your agency — connected, intelligent, and in one place.
        </motion.p>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
        style={{
          width: 1, flexShrink: 0,
          background: 'rgba(224,122,82,0.22)', transformOrigin: 'top',
        }}
      />

      {/* Right parchment — module list */}
      <div
        style={{
          flex: 1, background: PAR,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(24px, 5vw, 64px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: 'Inter', color: CHR, marginBottom: 20, fontWeight: 600,
          }}
        >
          What NEXUS covers
        </motion.div>

        {MODULES.map((mod, i) => (
          <motion.div
            key={mod.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.12, duration: 0.38, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}
          >
            <div style={{
              width: 3, height: 32, borderRadius: 2,
              background: mod.color, flexShrink: 0, marginTop: 2,
            }} />
            <div>
              <div style={{
                fontFamily: 'Inter', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', color: CHR, marginBottom: 2,
              }}>
                {mod.name}
              </div>
              <div style={{ fontSize: 12, color: '#7A6E66', fontFamily: 'Inter', lineHeight: 1.5 }}>
                {mod.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
