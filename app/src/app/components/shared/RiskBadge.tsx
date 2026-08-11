interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
}

const CONFIG = {
  low: {
    label: 'Low Risk',
    color: 'var(--status-success)',
    bg: 'rgba(107,168,136,0.1)',
    border: 'rgba(107,168,136,0.2)',
  },
  medium: {
    label: 'Medium Risk',
    color: 'var(--status-warning)',
    bg: 'rgba(201,135,78,0.1)',
    border: 'rgba(201,135,78,0.2)',
  },
  high: {
    label: 'High Risk',
    color: 'var(--status-danger)',
    bg: 'rgba(184,92,92,0.1)',
    border: 'rgba(184,92,92,0.2)',
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
