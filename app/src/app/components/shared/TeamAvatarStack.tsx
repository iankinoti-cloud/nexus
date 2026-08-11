const COLORS = ['#C4602E', '#6BA888', '#A07C6E', '#C9A87C', '#6E8FA8', '#7A9B6E'];

interface TeamAvatarStackProps {
  avatars: string[];
  max?: number;
  size?: number;
}

export function TeamAvatarStack({ avatars, max = 3, size = 26 }: TeamAvatarStackProps) {
  const visible = avatars.slice(0, max);
  const remainder = avatars.length - max;

  return (
    <div className="flex items-center" style={{ gap: 0 }}>
      {visible.map((initials, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-full"
          style={{
            width: size,
            height: size,
            background: COLORS[i % COLORS.length],
            border: '2px solid var(--surface)',
            marginLeft: i === 0 ? 0 : -(size / 4),
            color: '#F5F0E8',
            fontSize: size * 0.36,
            fontWeight: 700,
            zIndex: visible.length - i,
            position: 'relative',
          }}
        >
          {initials}
        </div>
      ))}
      {remainder > 0 && (
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: size,
            height: size,
            background: 'var(--surface-2)',
            border: '2px solid var(--surface)',
            marginLeft: -(size / 4),
            color: 'var(--text-dim)',
            fontSize: size * 0.32,
            fontWeight: 600,
            zIndex: 0,
            position: 'relative',
          }}
        >
          +{remainder}
        </div>
      )}
    </div>
  );
}
