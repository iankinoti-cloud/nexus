import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { SATISFACTION_DATA } from '../../data/mockData';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--hair-2)',
      borderRadius: 10,
      padding: '10px 14px',
    }}>
      <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#4FD1C5', fontSize: 14, fontWeight: 600 }}>{payload[0].value} / 5.0</p>
    </div>
  );
}

export function SatisfactionLineChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={SATISFACTION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[3.5, 5]} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={4.5}
          stroke="#FFB547"
          strokeDasharray="4 3"
          strokeWidth={1.5}
          label={{ value: 'Target', position: 'right', fill: '#FFB547', fontSize: 11 }}
        />
        <Line
          key="score"
          type="monotone"
          dataKey="score"
          stroke="#4FD1C5"
          strokeWidth={2}
          dot={{ fill: '#4FD1C5', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#4FD1C5' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
