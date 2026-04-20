import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoans } from '../contexts/LoanContext';
import { formatCurrency, formatDate, getRiskLevel, getRiskColor, calculateBorrowerStats, getLoanStatus } from '../utils/helpers';
import { ArrowLeft, User, Phone, DollarSign, Calendar, AlertTriangle, Shield, TrendingUp, MessageCircle } from 'lucide-react';
import LoanCard from '../components/Loans/LoanCard';
import EmptyState from '../components/Common/EmptyState';

const BorrowerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { borrowers, loans } = useLoans();
  const [borrower, setBorrower] = useState(null);

  useEffect(() => {
    const found = borrowers.find(b => b.id === id);
    if (found) {
      setBorrower(found);
    } else {
      navigate('/borrowers');
    }
  }, [id, borrowers, navigate]);

  const borrowerLoans = useMemo(() => {
    return loans.filter(loan => loan.borrowerId === id);
  }, [loans, id]);

  const stats = useMemo(() => {
    return calculateBorrowerStats(borrowerLoans);
  }, [borrowerLoans]);

  const risk = getRiskLevel(stats);
  const riskColor = getRiskColor(risk);

  const riskConfig = {
    low: { color: 'emerald', icon: Shield, label: 'Low Risk', description: 'Excellent repayment history and high trust score.' },
    medium: { color: 'amber', icon: TrendingUp, label: 'Medium Risk', description: 'Occasional delays observed. Monitor closely.' },
    high: { color: 'rose', icon: AlertTriangle, label: 'High Risk', description: 'Frequent delays or multiple overdue records found.' },
  };

  const config = riskConfig[risk] || riskConfig.low;

  if (!borrower) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/borrowers')} 
          className="flex items-center text-[var(--text-secondary)] hover:text-[var(--active-text)] transition-colors group w-fit"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Return to Database</span>
        </button>

        <div className="flex items-center space-x-3">
          <a 
            href={`https://wa.me/${borrower.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium px-8 py-4 h-14"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.5)' }}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest">Direct Connect</span>
          </a>
        </div>
      </div>

      {/* Profile Info Header */}
      <div className="glass-card p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 bg-[var(--bg-input)] rounded-3xl flex items-center justify-center border border-[var(--border-color)] shadow-inner">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[var(--bg-secondary)] border-4 border-[var(--bg-primary)] flex items-center justify-center shadow-lg`}>
              <config.icon className={`w-5 h-5 text-${config.color}-500`} />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">{borrower.name}</h1>
              <span className={`badge-premium ${
                risk === 'low' ? 'badge-paid' :
                risk === 'medium' ? 'badge-pending' :
                'badge-overdue'
              }`}>
                {config.label} Profile
              </span>
            </div>
            <div className="flex items-center mt-3 text-[var(--text-secondary)] space-x-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center mr-3">
                  <Phone className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-black tracking-tight">{borrower.phone}</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-black tracking-tight">Active since {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Borrowed', value: formatCurrency(stats.totalBorrowed), color: 'text-[var(--text-primary)]' },
          { label: 'Total Repaid', value: formatCurrency(stats.totalRepaid), color: 'text-emerald-500' },
          { label: 'Outstanding', value: formatCurrency(stats.outstanding), color: stats.outstanding > 0 ? 'text-rose-500' : 'text-emerald-500' },
          { label: 'Active Loans', value: stats.numberOfLoans, color: 'text-blue-500' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-6 hover:-translate-y-1 transition-all cursor-default group">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3 group-hover:text-blue-500 transition-colors">{stat.label}</p>
            <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Detail Section */}
        <div className={`lg:col-span-1 glass-card p-8 border-l-8 ${
          risk === 'low' ? 'border-emerald-500/50' :
          risk === 'medium' ? 'border-amber-500/50' :
          'border-rose-500/50'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Security Assessment</h2>
            <div className={`p-3 rounded-2xl ${
              risk === 'low' ? 'bg-emerald-500/10 text-emerald-500' :
              risk === 'medium' ? 'bg-amber-500/10 text-amber-500' :
              'bg-rose-500/10 text-rose-500'
            }`}>
              <config.icon className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Internal Designation</p>
              <p className="text-sm font-bold text-[var(--text-primary)] mb-2">{config.label}</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{config.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Overdue Incidents</span>
                <span className={`text-sm font-black ${stats.overdueCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {stats.overdueCount} Alerts
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Trust Factor</span>
                <span className="text-sm font-black text-[var(--text-primary)]">
                  {(stats.confirmationRate * 100).toFixed(0)}% Reliable
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Repayment Efficacy</span>
                <span className="text-sm font-black text-[var(--text-primary)]">
                  {stats.avgDelayDays > 0 ? `${Math.round(stats.avgDelayDays)}d Delay Avg.` : 'Punctual'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loan History Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Transaction History</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{borrowerLoans.length} total entries</span>
          </div>
          
          {borrowerLoans.length === 0 ? (
            <div className="pt-8">
              <EmptyState 
                title="Historical Data Missing" 
                message="This entity currently lacks recorded lending history. Record the first transaction to initiate tracking."
                actionLabel="Initialize Record"
                onAction={() => navigate('/loans')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {borrowerLoans.map(loan => (
                <LoanCard key={loan.id} loan={loan} onEdit={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BorrowerDetail;