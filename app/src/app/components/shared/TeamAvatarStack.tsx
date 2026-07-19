const COLORS = ['var(--accent)', '#A78BFA', '#22C55E', '#FFB547', '#60A5FA', '#F472B6'];

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
            color: '#0B0B0F',
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
