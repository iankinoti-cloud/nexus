interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
}

const CONFIG = {
  low: {
    label: 'Low Risk',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.2)',
  },
  medium: {
    label: 'Medium Risk',
    color: '#FFB547',
    bg: 'rgba(255,181,71,0.1)',
    border: 'rgba(255,181,71,0.2)',
  },
  high: {
    label: 'High Risk',
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.1)',
    border: 'rgba(255,107,107,0.2)',
  },
};

export function RiskBadge({ level }: RiskBadgeProps) {
  const c = CONFIG[level];
  return (
    <span
      style={{
        color: c.color,
        background: c.bg,
        border: `1px solid ${c.border}`,
        fontSize: 'calc(11px * var(--fs))',
        fontWeight: 500,
        borderRadius: 6,
        padding: '2px 8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: c.color,
          display: 'inline-block',
        }}
      />
      {c.label}
    </span>
  );
}
