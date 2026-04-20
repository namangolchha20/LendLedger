import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getLoanStatus, getStatusColor } from '../../utils/helpers';
import { ArrowRight } from 'lucide-react';

const RecentLoans = ({ loans }) => {
  const statusLabels = {
    paid: 'Repaid',
    overdue: 'Overdue',
    'due-soon': 'Due Soon',
    active: 'Active',
  };

  const statusBadgeClasses = {
    paid: 'badge-paid',
    overdue: 'badge-overdue',
    'due-soon': 'badge-pending',
    active: 'badge-pending',
  };

  return (
    <div className="glass-card flex flex-col">
      <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Recent Activity</h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">Live transaction feed</p>
        </div>
        <Link 
          to="/loans" 
          className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors flex items-center group"
        >
          Full Archive <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        {loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-[var(--bg-input)] rounded-3xl flex items-center justify-center mb-6 border border-[var(--border-color)]">
              <ArrowRight className="w-8 h-8 text-[var(--text-muted)] -rotate-45" />
            </div>
            <p className="text-[var(--text-primary)] font-black uppercase tracking-widest text-xs">No Recent Records</p>
            <p className="text-[var(--text-muted)] text-sm mt-2 font-medium">Initialize a transaction to see it here.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-input)]/30">
                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Borrower Entity</th>
                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Value</th>
                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">State</th>
                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loans.map((loan) => {
                const status = getLoanStatus(loan);
                return (
                  <tr 
                    key={loan.id} 
                    className="group hover:bg-[var(--bg-input)] transition-all cursor-pointer"
                    onClick={() => window.location.href = `/loans/${loan.id}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-blue-500 font-black text-sm shadow-sm">
                          {loan.borrowerName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-black text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                          {loan.borrowerName || 'Anonymous Entity'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-[var(--text-primary)]">{formatCurrency(loan.amount)}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`badge-premium ${statusBadgeClasses[status]}`}>
                        {statusLabels[status] || status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-[11px] text-[var(--text-secondary)] font-black uppercase tracking-tight">{formatDate(loan.date)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};



export default RecentLoans;