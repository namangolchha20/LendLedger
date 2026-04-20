import React, { useMemo } from 'react';
import { useLoans } from '../contexts/LoanContext';
import { useAuth } from '../contexts/AuthContext';
import LoanTrendsChart from '../components/Dashboard/LoanTrendsChart';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentLoans from '../components/Dashboard/RecentLoans';
import HighRiskBorrowers from '../components/Dashboard/HighRiskBorrowers';
import EmptyState from '../components/Common/EmptyState';
import { 
  DollarSign, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { calculateDashboardMetrics, formatCurrency, getRiskLevel, calculateBorrowerStats } from '../utils/helpers';

const Dashboard = () => {
  const { loans, borrowers, loading } = useLoans();
  const { user } = useAuth();

  const metrics = useMemo(() => calculateDashboardMetrics(loans), [loans]);
  
  const highRiskBorrowers = useMemo(() => {
    return borrowers.map(borrower => {
      const borrowerLoans = loans.filter(l => l.borrowerId === borrower.id);
      const stats = calculateBorrowerStats(borrowerLoans);
      return {
        ...borrower,
        stats,
        risk: getRiskLevel(stats)
      };
    }).filter(b => b.risk === 'high');
  }, [borrowers, loans]);

  const statsCards = [
    {
      title: 'Total Lent',
      value: formatCurrency(metrics.totalLent),
      icon: DollarSign,
      color: 'blue',
      change: `${metrics.activeLoans} active loans`,
      trend: 'up'
    },
    {
      title: 'Outstanding',
      value: formatCurrency(metrics.totalOutstanding),
      icon: TrendingDown,
      color: 'red',
      change: `${((metrics.totalOutstanding / metrics.totalLent) * 100 || 0).toFixed(1)}% of total`,
      trend: 'down'
    },
    {
      title: 'Overdue Loans',
      value: metrics.overdueLoans,
      icon: AlertCircle,
      color: 'orange',
      change: 'Require attention',
      trend: 'up'
    },
    {
      title: 'Repayment Rate',
      value: `${(metrics.repaymentRate * 100).toFixed(1)}%`,
      icon: CheckCircle,
      color: 'green',
      change: `${metrics.paidLoans} loans repaid`,
      trend: 'up'
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-8 border-[var(--border-color)] rounded-3xl" />
          <div className="absolute inset-0 border-8 border-blue-500 border-t-transparent rounded-3xl animate-spin" />
        </div>
        <p className="text-[var(--text-secondary)] font-black uppercase tracking-widest text-xs animate-pulse">Syncing Portfolio Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Intelligence Overview</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">Real-time performance metrics of your lending network.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/loans'}
          className="btn-premium px-8 py-4 h-14"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest">New Loan Record</span>
        </button>
      </div>

      {loans.length === 0 ? (
        <div className="pt-10">
          <EmptyState 
            title="LendLedger Initialized"
            message="Your portfolio is currently empty. Begin recording transactions to generate analytical insights."
            actionLabel="Start Recording"
            onAction={() => window.location.href = '/loans'}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => (
              <StatsCard key={index} {...card} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LoanTrendsChart />
            </div>
            <div className="lg:col-span-1">
              <HighRiskBorrowers borrowers={highRiskBorrowers} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <RecentLoans loans={loans.slice(0, 8)} />
          </div>
        </>
      )}
    </div>
  );
};


export default Dashboard;