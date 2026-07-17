import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { REVENUE_DATA } from '../../data/mockData';

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E1E26',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      padding: '6px 10px',
      fontSize: 12,
      color: '#4FD1C5',
    }}>
      ${payload[0].value}K
    </div>
  );
}

export function MiniAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4FD1C5" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#4FD1C5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomTooltip />} />
        <Area
          key="revenue"
          type="monotone"
          dataKey="revenue"
          stroke="#4FD1C5"
          strokeWidth={1.5}
          fill="url(#miniGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
