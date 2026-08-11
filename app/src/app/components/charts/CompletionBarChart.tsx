import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { COMPLETION_DATA } from '../../data/mockData';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--hair-2)',
      borderRadius: 10,
      padding: '10px 14px',
    }}>
      <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, fontSize: 13, fontWeight: 500 }}>
          {p.name}: {p.value} tasks
        </p>
      ))}
    </div>
  );
}

export function CompletionBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={COMPLETION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
        <CartesianGrid stroke="rgba(255,235,200,0.06)" vertical={false} />
        <XAxis dataKey="week" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-dim)', paddingTop: 10 }} />
        <Bar key="target" dataKey="target" name="Target" fill="rgba(201,168,124,0.2)" radius={[4, 4, 0, 0]} />
        <Bar key="completed" dataKey="completed" name="Completed" fill="#E07A52" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
