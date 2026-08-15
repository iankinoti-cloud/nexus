import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useCountUp } from '../useCountUp';
import nexusEmblem from '../../../../../imports/NEXUS-_-EMBLEM.jpeg';

const BLK = '#0F0D0B';
const CRM = '#F5F0E8';
const TER = '#E07A52';
const SAG = '#6BA888';

export function Chapter5_Result() {
  const count = useCountUp(12, 1600, true);

  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: BLK,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 64px)',
        textAlign: 'center',
      }}
    >
      {/* Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.78 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
        style={{
          width: 60, height: 60, borderRadius: '50%',
          overflow: 'hidden', marginBottom: 20,
          border: `1.5px solid rgba(224,122,82,0.38)`,
        }}
      >
        <img
          src={nexusEmblem}
          alt="NEXUS"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Logotype */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.35 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 8vw, 88px)',
          color: CRM, lineHeight: 1, marginBottom: 40,
        }}
      >
        NEXUS
      </motion.div>

      {/* Terracotta rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 'clamp(120px, 20vw, 240px)',
          height: 2, background: TER,
          transformOrigin: 'left', marginBottom: 32,
        }}
      />

      {/* Count-up */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 8vw, 72px)',
          color: SAG, lineHeight: 1,
        }}
      >
        {count}+
      </motion.div>

      <div style={{ marginBottom: 44 }} />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.85, type: 'spring', stiffness: 280, damping: 24 }}
      >
        <Link
          to="/"
          style={{
            color: TER, fontFamily: 'Inter, sans-serif',
            fontSize: 15, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.01em',
            padding: '13px 30px',
            border: `1.5px solid rgba(224,122,82,0.4)`,
            borderRadius: 6, display: 'inline-block',
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.background = 'rgba(224,122,82,0.15)';
            el.style.borderColor = TER;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.background = 'transparent';
            el.style.borderColor = 'rgba(224,122,82,0.4)';
          }}
        >
          Enter your workspace →
        </Link>
      </motion.div>
    </div>
  );
}
