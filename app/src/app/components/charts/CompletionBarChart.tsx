import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { COMPLETION_DATA } from '../../data/mockData';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E1E26',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '10px 14px',
    }}>
      <p style={{ color: '#A1A1AA', fontSize: 12, marginBottom: 6 }}>{label}</p>
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
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="week" tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#A1A1AA', paddingTop: 10 }} />
        <Bar key="target" dataKey="target" name="Target" fill="rgba(79,209,197,0.15)" radius={[4, 4, 0, 0]} />
        <Bar key="completed" dataKey="completed" name="Completed" fill="#4FD1C5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
