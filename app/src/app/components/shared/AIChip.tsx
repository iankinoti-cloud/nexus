interface AIChipProps {
  text: string;
  className?: string;
}

export function AIChip({ text, className }: AIChipProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: 6,
        background: 'rgba(var(--accent-rgb),0.07)',
        border: '1px solid rgba(var(--accent-rgb),0.2)',
        borderRadius: 8,
        padding: '6px 10px',
        color: 'var(--accent)',
        fontSize: 12,
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: 11, marginTop: 1, opacity: 0.8, flexShrink: 0 }}>✦</span>
      <span>{text}</span>
    </div>
  );
}
