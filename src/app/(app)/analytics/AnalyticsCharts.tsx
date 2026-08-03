'use client';

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface DailyData {
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
  ctr: number;
  cpa: number;
}

interface PlatformData {
  platform: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
}

export default function AnalyticsCharts({ dailyData, platformData }: { dailyData: DailyData[]; platformData: PlatformData[] }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Revenue vs Spend */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-white mb-4">المبيعات مقابل الإنفاق</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sp2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E0B973" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E0B973" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickFormatter={(v) => new Date(v).toLocaleDateString('ar-SA', { day: 'numeric' })}
            />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#rev2)" name="المبيعات" />
            <Area type="monotone" dataKey="spend" stroke="#E0B973" strokeWidth={2} fill="url(#sp2)" name="الإنفاق" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ROAS trend */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-white mb-4">اتجاه ROAS</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickFormatter={(v) => new Date(v).toLocaleDateString('ar-SA', { day: 'numeric' })}
            />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <Line type="monotone" dataKey="roas" stroke="#0F766E" strokeWidth={2} dot={{ fill: '#0F766E' }} name="ROAS" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* By platform */}
      <div className="card p-6 xl:col-span-2">
        <h3 className="text-base font-bold text-white mb-4">الأداء حسب المنصة</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={platformData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="platform" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="spend" fill="#E0B973" name="الإنفاق" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#10B981" name="الإيرادات" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
