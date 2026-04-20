import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { Users, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const riskConfig = {
  low: { color: 'green', icon: Shield, label: 'Low Risk' },
  medium: { color: 'yellow', icon: TrendingUp, label: 'Medium Risk' },
  high: { color: 'red', icon: AlertTriangle, label: 'High Risk' },
};

const BorrowerCard = ({ borrower }) => {
  const riskConfig = {
    low: { color: 'emerald', icon: Shield, label: 'Low Risk' },
    medium: { color: 'amber', icon: TrendingUp, label: 'Medium Risk' },
    high: { color: 'rose', icon: AlertTriangle, label: 'High Risk' },
  };

  const config = riskConfig[borrower.risk] || riskConfig.low;
  const Icon = config.icon;

  return (
    <Link to={`/borrowers/${borrower.id}`} className="block group">
      <div className="glass-card p-6 hover:-translate-y-1 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight group-hover:text-blue-500 transition-colors">{borrower.name}</h3>
              <span className={`badge-premium ${
                borrower.risk === 'low' ? 'badge-paid' :
                borrower.risk === 'medium' ? 'badge-pending' :
                'badge-overdue'
              }`}>
                {config.label}
              </span>
            </div>
            <div className="flex items-center mt-2 text-[var(--text-secondary)]">
              <div className="w-6 h-6 rounded-md bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center mr-2">
                <Users className="w-3 h-3 text-blue-500" />
              </div>
              <span className="text-xs font-black tracking-tight">{borrower.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Aggregate Debt</p>
            <p className="text-sm font-black text-[var(--text-primary)]">{formatCurrency(borrower.stats.totalBorrowed)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Live Exposure</p>
            <p className={`text-sm font-black ${borrower.stats.outstanding > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {formatCurrency(borrower.stats.outstanding)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Entries</p>
            <p className="text-sm font-black text-[var(--text-primary)]">{borrower.stats.numberOfLoans}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Delinquencies</p>
            <p className={`text-sm font-black ${borrower.stats.overdueCount > 0 ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
              {borrower.stats.overdueCount} Alerts
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Confirmation Score</span>
            <span className="text-[10px] font-black text-blue-500">{(borrower.stats.confirmationRate * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-[var(--bg-input)] rounded-full h-1.5 overflow-hidden border border-[var(--border-color)]">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
              style={{ width: `${borrower.stats.confirmationRate * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export default BorrowerCard;