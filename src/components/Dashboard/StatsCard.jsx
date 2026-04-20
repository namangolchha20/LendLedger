import React from 'react';

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600',
  green: 'bg-green-100 text-green-600',
};

const StatsCard = ({ title, value, icon: Icon, color, change, trend = 'up' }) => {
  const iconColors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/10',
    red: 'text-rose-500 bg-rose-500/10 border-rose-500/10',
    orange: 'text-amber-500 bg-amber-500/10 border-amber-500/10',
    green: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
  };

  return (
    <div className="glass-card p-6 group hover:-translate-y-1 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{title}</p>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter group-hover:text-blue-500 transition-colors">
              {value}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                trend === 'up' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' 
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/10'
              }`}>
                {change}
              </span>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${iconColors[color]} shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};



export default StatsCard;