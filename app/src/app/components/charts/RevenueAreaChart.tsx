import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { REVENUE_DATA } from '../../data/mockData';

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
          {p.name}: ${p.value}K
        </p>
      ))}
    </div>
  );
}

export function RevenueAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4FD1C5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4FD1C5" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4FD1C5" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#4FD1C5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#A1A1AA', paddingTop: 10 }}
        />
        <Area
          key="forecast"
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="#4FD1C5"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          fill="url(#forecastGrad)"
          dot={false}
        />
        <Area
          key="revenue"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#4FD1C5"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={{ fill: '#4FD1C5', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#4FD1C5' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
