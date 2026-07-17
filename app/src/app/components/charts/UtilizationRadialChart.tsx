import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { UTILIZATION_DATA } from '../../data/mockData';

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#1E1E26',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '10px 14px',
    }}>
      <p style={{ color: '#A1A1AA', fontSize: 12, marginBottom: 4 }}>{d.name}</p>
      <p style={{ color: d.fill, fontSize: 14, fontWeight: 600 }}>{d.utilization}% utilized</p>
    </div>
  );
}

export function UtilizationRadialChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadialBarChart
        innerRadius="25%"
        outerRadius="90%"
        data={UTILIZATION_DATA}
        startAngle={180}
        endAngle={-180}
      >
        <RadialBar
          key="utilization"
          dataKey="utilization"
          cornerRadius={4}
          background={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconSize={8}
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: '#A1A1AA', paddingTop: 8 }}
          formatter={(value, entry: any) => (
            <span style={{ color: entry.payload.fill }}>{entry.payload.name}</span>
          )}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
