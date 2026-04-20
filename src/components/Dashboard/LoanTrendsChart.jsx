import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', lent: 4000, repayments: 2400 },
  { name: 'Feb', lent: 3000, repayments: 1398 },
  { name: 'Mar', lent: 2000, repayments: 9800 },
  { name: 'Apr', lent: 2780, repayments: 3908 },
  { name: 'May', lent: 1890, repayments: 4800 },
  { name: 'Jun', lent: 2390, repayments: 3800 },
  { name: 'Jul', lent: 3490, repayments: 4300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-[var(--text-primary)] font-bold text-sm">
              {entry.name}: <span className="text-slate-500">₹{entry.value.toLocaleString()}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LoanTrendsChart = () => {
  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Loan Trends</h2>
          <p className="text-sm text-slate-500">Overview of lending vs repayments</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-400">Lent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">Repayments</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRepay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `₹${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="lent" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorLent)" 
              name="Lent"
            />
            <Area 
              type="monotone" 
              dataKey="repayments" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRepay)" 
              name="Repayments"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoanTrendsChart;
