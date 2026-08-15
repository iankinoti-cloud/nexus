import { motion } from 'motion/react';

const BLK = '#0F0D0B';
const CRM = '#F5F0E8';
const TER = '#E07A52';
const SAG = '#6BA888';
const PAR = '#F7F4F0';
const CHR = '#2D2620';
const DIM = '#7A6E66';

const AGENTS = [
  {
    id: 'strategy',
    tag: 'STRATEGY',
    color: TER,
    action: 'Surfaces scope creep, burnout risk, and revenue gaps before they cost you.',
  },
  {
    id: 'creative',
    tag: 'CREATIVE',
    color: SAG,
    action: 'Drafts briefs, proposals, and scopes of work in seconds — not hours.',
  },
  {
    id: 'operations',
    tag: 'OPERATIONS',
    color: '#C9A87C',
    action: 'Rebalances workloads, re-slots deadlines, and keeps production moving.',
  },
  {
    id: 'financial',
    tag: 'FINANCIAL',
    color: '#6E8FA8',
    action: 'Tracks margin per project, forecasts pipeline, flags billing delays.',
  },
];

const TITLE = 'CORE';

export function Chapter3_Formula() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: PAR,
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(28px, 8vw, 100px)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 720 }}>
        {/* Title */}
        <div style={{ marginBottom: 6, overflow: 'hidden' }}>
          {TITLE.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(52px, 8vw, 96px)',
                color: CHR, lineHeight: 1,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 0.55, x: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{
            fontFamily: 'Inter', fontSize: 13,
            color: DIM, letterSpacing: '0.01em',
            marginBottom: 20,
          }}
        >
          The AI that doesn't just advise — it acts.
        </motion.div>

        {/* Terracotta rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 2, background: TER, transformOrigin: 'left', marginBottom: 32 }}
        />

        {/* Agent rows */}
        {AGENTS.map((agent, i) => (
          <motion.div key={agent.id}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 + i * 0.22, duration: 0.4, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 16 }}
            >
              <div style={{
                padding: '5px 12px',
                borderRadius: 3,
                background: `${agent.color}18`,
                border: `1px solid ${agent.color}40`,
                color: agent.color,
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.14em',
                fontFamily: 'Inter',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {agent.tag}
              </div>
              <div style={{ fontSize: 13, color: DIM, lineHeight: 1.6, fontFamily: 'Inter' }}>
                {agent.action}
              </div>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.85 + i * 0.22, duration: 0.35, ease: 'easeOut' }}
              style={{
                height: 1, background: 'rgba(60,40,20,0.08)',
                transformOrigin: 'left', marginBottom: 16,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
