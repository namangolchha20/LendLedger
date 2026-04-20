import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoans } from '../../contexts/LoanContext';
import { formatCurrency, formatDate, getLoanStatus, getStatusColor, generateReminderMessage, generateWhatsAppLink } from '../../utils/helpers';
import { Edit2, Trash2, CheckCircle, MessageCircle, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../Common/ConfirmDialog';

const LoanCard = ({ loan, onEdit }) => {
  const navigate = useNavigate();
  const { editLoan, removeLoan } = useLoans();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  const status = getLoanStatus(loan);
  const statusColor = getStatusColor(status);
  const statusLabels = { paid: 'Paid', overdue: 'Overdue', 'due-soon': 'Due Soon', active: 'Active' };
  const confirmationLabels = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected' };

  const handleMarkAsPaid = async () => {
    setUpdating(true);
    const result = await editLoan(loan.id, { status: 'paid' });
    if (result.success) toast.success('Marked as repaid');
    else toast.error(result.error);
    setUpdating(false);
  };

  const handleUpdateConfirmation = async (confirmationStatus) => {
    setUpdating(true);
    const result = await editLoan(loan.id, { confirmationStatus });
    if (result.success) toast.success(`Confirmation ${confirmationStatus}`);
    else toast.error(result.error);
    setUpdating(false);
  };

  const handleSendReminder = () => {
    const daysOverdue = status === 'overdue' ? Math.floor((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24)) : 0;
    const message = generateReminderMessage(loan, daysOverdue);
    const link = generateWhatsAppLink(loan.borrowerPhone, message);
    window.open(link, '_blank');
    toast.success('Opening WhatsApp');
  };

  const handleSendConfirmation = () => {
    const message = `Dear ${loan.borrowerName}, you have been recorded as borrowing ${formatCurrency(loan.amount)} on ${formatDate(loan.date)}. Please reply "YES" to confirm this loan.`;
    const link = generateWhatsAppLink(loan.borrowerPhone, message);
    window.open(link, '_blank');
    toast.success('Opening WhatsApp');
  };

  const handleDelete = async () => {
    const result = await removeLoan(loan.id);
    if (result.success) {
      toast.success('Loan deleted');
      setShowDeleteConfirm(false);
    } else toast.error(result.error);
  };

  return (
    <>
      <div className="glass-card p-6 group">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 cursor-pointer" onClick={() => navigate(`/loans/${loan.id}`)}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight group-hover:text-blue-500 transition-colors">{loan.borrowerName}</h3>
              <span className={`badge-premium ${status === 'paid' ? 'badge-paid' : status === 'overdue' ? 'badge-overdue' : 'badge-pending'}`}>
                {statusLabels[status]}
              </span>
              <span className={`badge-premium ${loan.confirmationStatus === 'accepted' ? 'badge-paid' : loan.confirmationStatus === 'rejected' ? 'badge-overdue' : 'bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-color)]'}`}>
                {confirmationLabels[loan.confirmationStatus]}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[var(--text-secondary)]">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">Amount</span>
                <p className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(loan.amount)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">Due Date</span>
                <p className="text-sm font-bold text-[var(--text-primary)]">{formatDate(loan.dueDate)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">Interest</span>
                <p className="text-sm font-bold text-[var(--text-primary)]">{loan.interestRate > 0 ? `${loan.interestRate}%` : 'None'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">Phone</span>
                <p className="text-sm font-bold text-[var(--text-primary)]">{loan.borrowerPhone}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleSendReminder} className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500/20 transition-all" title="WhatsApp Reminder">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button onClick={handleSendConfirmation} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-all" title="Request Confirmation">
              <Send className="w-4 h-4" />
            </button>
            <button onClick={onEdit} className="p-2.5 bg-[var(--bg-input)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--active-bg)] hover:text-[var(--active-text)] transition-all">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Update Confirmation</span>
            <div className="flex bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-color)]">
              {['accepted', 'rejected', 'pending'].map(s => (
                <button 
                  key={s} 
                  onClick={() => handleUpdateConfirmation(s)} 
                  className={`text-[10px] px-3 py-1.5 rounded-md font-black uppercase tracking-tighter transition-all ${loan.confirmationStatus === s ? 'bg-[var(--bg-secondary)] text-[var(--active-text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          {loan.status !== 'paid' && (
            <button 
              onClick={handleMarkAsPaid} 
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 px-3 py-2 rounded-lg transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Settle Loan</span>
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Loan" message={`Delete loan of ${formatCurrency(loan.amount)} from ${loan.borrowerName}?`} onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />
    </>
  );
};

export default LoanCard;