import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  delay?: number;
}

export function KPICard({ label, value, change, changeType, icon: Icon, delay = 0 }: KPICardProps) {
  const changeColor =
    changeType === 'up' ? '#22C55E' :
    changeType === 'down' ? '#FF6B6B' :
    '#A1A1AA';

  const ChangeIcon = changeType === 'up' ? TrendingUp : changeType === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="rounded-xl p-5 flex flex-col gap-4 cursor-default"
      style={{
        background: '#15151B',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 34, height: 34, background: 'rgba(var(--accent-rgb),0.1)' }}
        >
          <Icon size={16} style={{ color: 'var(--accent)' }} />
        </div>
      </div>
      <div>
        <div style={{ color: '#F4F4F5', fontSize: 28, fontWeight: 600, lineHeight: 1.1 }}>{value}</div>
        <div className="flex items-center gap-1.5 mt-2">
          <ChangeIcon size={12} style={{ color: changeColor }} />
          <span style={{ color: changeColor, fontSize: 12 }}>{change}</span>
        </div>
      </div>
    </motion.div>
  );
}
