'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ChartData {
  date: string;
  spend: number;
  revenue: number;
  roas: number;
}

export default function DashboardCharts({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E0B973" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#E0B973" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          tickFormatter={(v) => new Date(v).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
        />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            background: '#0a0e1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#10B981"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          name="المبيعات"
        />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#E0B973"
          strokeWidth={2}
          fill="url(#colorSpend)"
          name="الإنفاق"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
