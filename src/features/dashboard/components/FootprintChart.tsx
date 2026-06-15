"use client";

import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

type ChartData = {
  name: string;
  value: number;
}[];

export function FootprintChart({ data }: { data: ChartData }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-on-surface-variant font-body-md">
        No footprint data available for this week.
      </div>
    );
  }

  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-inter)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-inter)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface-container)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 10px 20px rgba(0,108,73,0.1)'
            }}
            itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
            labelStyle={{ color: 'var(--color-on-surface)', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="kg CO2"
            stroke="var(--color-primary)" 
            strokeWidth={4} 
            dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 2, stroke: '#fff' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
