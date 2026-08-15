import { motion } from 'motion/react';
import { StampText } from '../StampText';

const BLK = '#0F0D0B';
const CRM = '#F5F0E8';
const TER = '#E07A52';
const COLD = '#3B6B9A';

const TOOLS = ['NOTION', 'SHEETS', 'SLACK', 'EMAIL', 'DRIVE', 'XERO'];

function FragmentedTools() {
  const positions = [
    { x: '8%',  y: '12%' }, { x: '52%', y: '8%'  },
    { x: '28%', y: '38%' }, { x: '68%', y: '34%' },
    { x: '12%', y: '64%' }, { x: '58%', y: '62%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.5 }}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {/* Disconnected tool chips */}
      {TOOLS.map((tool, i) => (
        <motion.div
          key={tool}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + i * 0.14, duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: positions[i].x,
            top: positions[i].y,
            padding: '7px 14px',
            borderRadius: 4,
            border: `1px solid ${COLD}40`,
            background: `${COLD}12`,
            color: `${CRM}55`,
            fontSize: 10,
            letterSpacing: '0.14em',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {tool}
        </motion.div>
      ))}

      {/* Broken connection lines */}
      {[[0,2],[1,3],[2,4],[3,5]].map(([a, b], i) => {
        const from = positions[a];
        const to = positions[b];
        return (
          <motion.div
            key={`line${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 + i * 0.12, duration: 0.4 }}
            style={{
              position: 'absolute',
              left: from.x, top: from.y,
              width: '2px', height: '60px',
              background: `repeating-linear-gradient(to bottom, ${COLD}35 0px, ${COLD}35 4px, transparent 4px, transparent 8px)`,
              transform: 'rotate(45deg)',
              transformOrigin: 'top left',
            }}
          />
        );
      })}

      {/* Red X marks */}
      {[0, 2, 4].map((idx, i) => (
        <motion.div
          key={`x${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 + i * 0.15, duration: 0.25 }}
          style={{
            position: 'absolute',
            left: `calc(${positions[idx].x} + 60px)`,
            top: `calc(${positions[idx].y} + 30px)`,
            color: '#B85C5C',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'Inter',
          }}
        >
          ✕
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Chapter1_Problem() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: BLK,
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(28px, 7vw, 88px)',
      }}
    >
      <div style={{ flex: '0 0 54%', paddingRight: '4vw' }}>
        <StampText
          text="CREATIVE"
          delay={0.1}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 78px)',
            color: `${CRM}90`, lineHeight: 1.05, marginBottom: 4,
          }}
        />
        <StampText
          text="AGENCIES"
          delay={0.38}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 78px)',
            color: CRM, lineHeight: 1.05, marginBottom: 4,
          }}
        />
        <StampText
          text="RUN ON"
          delay={0.66}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 5vw, 62px)',
            color: `${CRM}70`, lineHeight: 1.05,
            paddingLeft: '1.5vw', marginBottom: 4,
          }}
        />
        <StampText
          text="FRAGMENTATION."
          delay={0.94}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 58px)',
            color: TER, lineHeight: 1.05,
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.36 }}
          transition={{ delay: 2.0, duration: 0.9 }}
          style={{
            color: CRM, fontSize: 12,
            lineHeight: 1.7, fontFamily: 'Inter, sans-serif',
            maxWidth: 280, marginTop: 24,
          }}
        >
          Proposals in Notion. Talent in spreadsheets.<br />
          Finance in Excel. Nothing talks to anything.
        </motion.p>
      </div>

      <div style={{ flex: 1, position: 'relative', height: '60vh', maxHeight: 460 }}>
        <FragmentedTools />
      </div>
    </div>
  );
}
