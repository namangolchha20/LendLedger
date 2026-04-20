import React, { useState, useMemo } from 'react';
import { useLoans } from '../contexts/LoanContext';
import { useAuth } from '../contexts/AuthContext';
import LoanCard from '../components/Loans/LoanCard';
import LoanForm from '../components/Loans/LoanForm';
import EmptyState from '../components/Common/EmptyState';
import CustomSelect from '../components/Common/CustomSelect';
import { Plus, Search, Filter } from 'lucide-react';
import { getLoanStatus } from '../utils/helpers';

const Loans = () => {
  const { loans, loading } = useLoans();
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLoans = useMemo(() => {
    let filtered = loans;
    
    if (searchTerm) {
      filtered = filtered.filter(loan => 
        loan.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.borrowerPhone?.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(loan => {
        const status = getLoanStatus(loan);
        if (statusFilter === 'paid') return loan.status === 'paid';
        if (statusFilter === 'overdue') return status === 'overdue';
        if (statusFilter === 'active') return status === 'active' || status === 'due-soon';
        return true;
      });
    }
    
    return filtered;
  }, [loans, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = loans.length;
    const paid = loans.filter(l => l.status === 'paid').length;
    const overdue = loans.filter(l => getLoanStatus(l) === 'overdue').length;
    const active = total - paid;
    return { total, paid, overdue, active };
  }, [loans]);

  const statusOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'active', label: 'Active Loans' },
    { value: 'paid', label: 'Settled Loans' },
    { value: 'overdue', label: 'Overdue Alerts' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 rounded-2xl border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Loan Ledger</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">Precision tracking for your lending portfolio.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium py-4">
          <Plus className="w-4 h-4" />
          <span className="font-black uppercase tracking-widest">New Loan Record</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Portfolio Size', value: stats.total, color: 'blue' },
          { label: 'Settled', value: stats.paid, color: 'emerald' },
          { label: 'Delinquent', value: stats.overdue, color: 'rose' },
          { label: 'Active', value: stats.active, color: 'blue' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 group hover:border-blue-500/20 transition-all">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter group-hover:scale-110 transition-transform origin-left">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-6 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Search Database</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Query by borrower name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-12 h-14"
            />
          </div>
        </div>
        <div className="w-full sm:w-[240px]">
          <CustomSelect
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <div className="pt-10">
          <EmptyState 
            title={searchTerm || statusFilter !== 'all' ? "No matches found" : "Portfolio Empty"}
            message={searchTerm || statusFilter !== 'all' ? "Try adjusting your query or filter parameters." : "Initialize your lending portfolio by recording your first transaction."}
            actionLabel="Add New Loan"
            onAction={() => setShowForm(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredLoans.map((loan) => (
            <LoanCard 
              key={loan.id} 
              loan={loan} 
              onEdit={() => setEditingLoan(loan)}
            />
          ))}
        </div>
      )}

      {/* Loan Form Modal */}
      {(showForm || editingLoan) && (
        <LoanForm
          loan={editingLoan}
          onClose={() => {
            setShowForm(false);
            setEditingLoan(null);
          }}
        />
      )}
    </div>
  );
};

export default Loans;