import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const HighRiskBorrowers = ({ borrowers }) => {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Watchlist</h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">High-priority alerts</p>
        </div>
        <Link 
          to="/borrowers" 
          className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors flex items-center group"
        >
          View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="p-6 space-y-4">
        {borrowers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-emerald-500/5 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/10">
              <AlertTriangle className="w-8 h-8 text-emerald-500/50" />
            </div>
            <p className="text-[var(--text-primary)] font-black uppercase tracking-widest text-xs">Portfolio Secured</p>
            <p className="text-[var(--text-muted)] text-sm mt-2 font-medium">No high-risk entities identified.</p>
          </div>
        ) : (
          borrowers.map((borrower) => (
            <Link
              key={borrower.id}
              to={`/borrowers/${borrower.id}`}
              className="flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-input)]/50 border border-[var(--border-color)] hover:bg-[var(--bg-input)] hover:border-rose-500/30 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-rose-500 font-black shadow-sm">
                    {borrower.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-[var(--bg-secondary)] rounded-lg flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[var(--text-primary)] group-hover:text-rose-500 transition-colors tracking-tight">
                    {borrower.name}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">
                    {borrower.stats.overdueCount} Alerts • {formatCurrency(borrower.stats.outstanding)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-black text-rose-500 uppercase tracking-tighter">Intensity</div>
                <div className="text-lg font-black text-rose-500">84%</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};



export default HighRiskBorrowers;