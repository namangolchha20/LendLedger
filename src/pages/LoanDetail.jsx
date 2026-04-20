import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoans } from '../contexts/LoanContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate, getLoanStatus, getStatusColor, generateReminderMessage, generateWhatsAppLink } from '../utils/helpers';
import { ArrowLeft, Edit2, Trash2, CheckCircle, MessageCircle, Send, Calendar, DollarSign, User, Phone, FileText, AlertCircle, Share2, ShieldCheck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import LoanForm from '../components/Loans/LoanForm';
import ProofUpload from '../components/Loans/ProofUpload';

const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loans, editLoan, removeLoan } = useLoans();
  const [loan, setLoan] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const foundLoan = loans.find(l => l.id === id);
    if (foundLoan) {
      setLoan(foundLoan);
    } else {
      navigate('/loans');
    }
  }, [id, loans, navigate]);

  if (!loan) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const status = getLoanStatus(loan);
  const statusColor = getStatusColor(status);
  const statusLabels = {
    paid: 'Repaid',
    overdue: 'Overdue',
    'due-soon': 'Due Soon',
    active: 'Active',
  };

  const handleMarkAsPaid = async () => {
    setUpdating(true);
    const result = await editLoan(loan.id, { status: 'paid' });
    if (result.success) {
      toast.success('Loan marked as repaid');
    } else {
      toast.error(result.error);
    }
    setUpdating(false);
  };

  const handleUpdateConfirmation = async (confirmationStatus) => {
    setUpdating(true);
    const result = await editLoan(loan.id, { confirmationStatus });
    if (result.success) {
      toast.success(`Status: ${confirmationStatus.toUpperCase()}`);
      setLoan({ ...loan, confirmationStatus });
    } else {
      toast.error(result.error);
    }
    setUpdating(false);
  };

  const handleSendReminder = () => {
    const daysOverdue = status === 'overdue' ? Math.floor((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24)) : 0;
    const message = generateReminderMessage(loan, daysOverdue);
    const whatsappLink = generateWhatsAppLink(loan.borrowerPhone, message);
    window.open(whatsappLink, '_blank');
    toast.success('Reminder sent via WhatsApp');
  };

  const handleSendConfirmation = () => {
    const message = `Dear ${loan.borrowerName}, you have been recorded as borrowing ${formatCurrency(loan.amount)} on ${formatDate(loan.date)}. Please reply "YES" to confirm this loan.`;
    const whatsappLink = generateWhatsAppLink(loan.borrowerPhone, message);
    window.open(whatsappLink, '_blank');
    toast.success('Confirmation request sent');
  };

  const handleDelete = async () => {
    const result = await removeLoan(loan.id);
    if (result.success) {
      toast.success('Loan record deleted');
      navigate('/loans');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/loans')} 
          className="flex items-center text-[var(--text-secondary)] hover:text-[var(--active-text)] transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Return to Ledger</span>
        </button>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowEditForm(true)} 
            className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-500 hover:border-blue-500/30 rounded-2xl transition-all shadow-sm"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-rose-500 hover:border-rose-500/30 rounded-2xl transition-all shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="glass-card p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`badge-premium ${
                status === 'paid' ? 'badge-paid' :
                status === 'overdue' ? 'badge-overdue' :
                'badge-pending'
              }`}>
                {statusLabels[status]}
              </span>
              <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Entry ID: {loan.id.slice(0, 12)}</span>
            </div>
            <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tighter">
              {formatCurrency(loan.amount)}
            </h1>
            <p className="text-[var(--text-secondary)] font-medium text-lg">Transaction initiated on {formatDate(loan.date)}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {loan.status !== 'paid' && (
              <button 
                onClick={handleMarkAsPaid} 
                disabled={updating} 
                className="btn-premium px-10 py-5 h-16"
              >
                <CheckCircle className="w-6 h-6" />
                <span className="font-black uppercase tracking-widest">Settle Transaction</span>
              </button>
            )}
            <button 
              onClick={handleSendReminder}
              className="px-8 py-5 h-16 bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[var(--bg-secondary)] transition-all flex items-center justify-center space-x-3 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              <span>Push Reminder</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Borrower & Details Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight flex items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 text-blue-500">
                  <User className="w-5 h-5" />
                </div>
                Borrower Identification
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Legal Name</p>
                <p className="text-xl font-black text-[var(--text-primary)]">{loan.borrowerName}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Mobile Reach</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-black text-[var(--text-primary)]">{loan.borrowerPhone}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Settlement Deadline</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-black text-amber-500">{formatDate(loan.dueDate)}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Interest Protocol</p>
                <p className="text-xl font-black text-[var(--text-primary)]">
                  {loan.interestRate > 0 ? `${loan.interestRate}% (${loan.interestType})` : 'Zero Interest'}
                </p>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-[var(--border-color)]">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Transaction Memo</p>
              <div className="p-6 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed italic">
                  "{loan.notes || 'No specific memo recorded for this transaction.'}"
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-8 flex items-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mr-4 text-indigo-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              Verification Assets
            </h2>
            <ProofUpload loanId={loan.id} />
          </div>
        </div>

        {/* Status & Sidebars Column */}
        <div className="space-y-8">
          {/* Confirmation Control */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-6 flex items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 text-blue-500">
                <Share2 className="w-5 h-5" />
              </div>
              Validation
            </h2>
            <div className="space-y-6">
              <button 
                onClick={handleSendConfirmation}
                className="w-full p-5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group flex items-center justify-between shadow-sm active:scale-95"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">Social Proof</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Request via WhatsApp</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-[var(--text-muted)] rotate-180" />
              </button>

              <div className="pt-6 border-t border-[var(--border-color)] space-y-4">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest text-center">Set Authenticity Status</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'accepted', label: 'Verified', color: 'emerald', icon: ShieldCheck },
                    { id: 'pending', label: 'Awaiting', color: 'amber', icon: Clock },
                    { id: 'rejected', label: 'Disputed', color: 'rose', icon: AlertCircle }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleUpdateConfirmation(btn.id)}
                      className={`flex items-center justify-center space-x-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        loan.confirmationStatus === btn.id
                          ? `bg-${btn.color}-500 text-white border-${btn.color}-500 shadow-lg shadow-${btn.color}-500/20`
                          : `bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]`
                      }`}
                    >
                      <btn.icon className="w-4 h-4" />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle className="w-12 h-12 text-amber-500" />
            </div>
            <div className="flex items-center space-x-3 text-amber-500 mb-4">
              <AlertCircle className="w-5 h-5" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance Protocol</p>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              Maintain high trust by ensuring every transaction has a digital confirmation. Requesting the borrower to reply via WhatsApp creates an immutable social record.
            </p>
          </div>
        </div>
      </div>


      {showEditForm && (
        <LoanForm loan={loan} onClose={() => setShowEditForm(false)} />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Record?"
        message={`This will permanently remove the record of ${formatCurrency(loan.amount)} from ${loan.borrowerName}.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default LoanDetail;