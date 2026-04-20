import React, { useState, useEffect } from 'react';
import { X, User, Phone, DollarSign, Calendar, FileText, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import { useLoans } from '../../contexts/LoanContext';
import toast from 'react-hot-toast';
import CustomSelect from '../Common/CustomSelect';

const LoanForm = ({ loan, onClose }) => {
  const { borrowers, addBorrower, addLoan, editLoan } = useLoans();
  const [loading, setLoading] = useState(false);
  const [showNewBorrowerForm, setShowNewBorrowerForm] = useState(false);
  
  const [formData, setFormData] = useState({
    borrowerId: '',
    borrowerName: '',
    borrowerPhone: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    interestRate: '',
    interestType: 'none',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    if (loan) {
      setFormData({
        borrowerId: loan.borrowerId || '',
        borrowerName: loan.borrowerName || '',
        borrowerPhone: loan.borrowerPhone || '',
        amount: loan.amount.toString(),
        date: loan.date ? new Date(loan.date).toISOString().split('T')[0] : '',
        dueDate: loan.dueDate ? new Date(loan.dueDate).toISOString().split('T')[0] : '',
        interestRate: loan.interestRate?.toString() || '',
        interestType: loan.interestType || 'none',
        status: loan.status || 'pending',
        notes: loan.notes || '',
      });
    }
  }, [loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBorrowerSelect = (e) => {
    const id = e.target.value;
    if (id === 'new') {
      setShowNewBorrowerForm(true);
      setFormData(prev => ({ ...prev, borrowerId: '', borrowerName: '', borrowerPhone: '' }));
    } else if (id) {
      const b = borrowers.find(borrower => borrower.id === id);
      setFormData(prev => ({ 
        ...prev, 
        borrowerId: id, 
        borrowerName: b.name, 
        borrowerPhone: b.phone 
      }));
      setShowNewBorrowerForm(false);
    } else {
      setFormData(prev => ({ ...prev, borrowerId: '', borrowerName: '', borrowerPhone: '' }));
      setShowNewBorrowerForm(false);
    }
  };

  const handleCreateNewBorrower = async () => {
    if (!formData.borrowerName || !formData.borrowerPhone) {
      toast.error('Name and phone are required');
      return;
    }
    setLoading(true);
    const result = await addBorrower({ name: formData.borrowerName, phone: formData.borrowerPhone });
    if (result.success) {
      setFormData(prev => ({ ...prev, borrowerId: result.borrower.id }));
      setShowNewBorrowerForm(false);
      toast.success('Borrower registered');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.borrowerId && !showNewBorrowerForm) {
      toast.error('Please select or create a borrower');
      return;
    }
    
    setLoading(true);
    const loanData = {
      ...formData,
      amount: parseFloat(formData.amount),
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : 0,
      date: new Date(formData.date),
      dueDate: new Date(formData.dueDate),
    };

    const result = loan 
      ? await editLoan(loan.id, loanData)
      : await addLoan(loanData);

    if (result.success) {
      toast.success(loan ? 'Loan updated' : 'Loan recorded');
      onClose();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const borrowerOptions = [
    { value: '', label: 'Choose existing borrower' },
    { value: 'new', label: '+ Register new entity' },
    ...borrowers.map(b => ({ value: b.id, label: `${b.name} (${b.phone})` }))
  ];

  const interestOptions = [
    { value: 'none', label: 'Zero Interest' },
    { value: 'simple', label: 'Simple Accrual' },
    { value: 'compound', label: 'Compound (Annual)' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Awaiting Repayment' },
    { value: 'paid', label: 'Settled / Closed' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-[720px] w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal relative">
        <div className="noise-bg" />
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-8 border-b border-[var(--border-color)] relative z-10 bg-[var(--bg-secondary)]">
          <div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              {loan ? 'Edit Loan Record' : 'Record New Loan'}
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1 font-medium">Capture transaction details with precision.</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-[var(--active-bg)] rounded-xl transition-all">
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto relative z-10 bg-[var(--bg-secondary)]">
          <div className="p-8 space-y-12">
            
            {/* Section 1: Borrower Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Borrower Information</h3>
              </div>

              <div className="space-y-4">
                <CustomSelect
                  label="Select Entity"
                  value={formData.borrowerId}
                  onChange={handleBorrowerSelect}
                  options={borrowerOptions}
                  required
                />

                {(showNewBorrowerForm || (!formData.borrowerId && !showNewBorrowerForm)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] animate-fade-in">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Entity Name <span className="text-blue-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Legal name or alias" 
                        value={formData.borrowerName} 
                        onChange={e => setFormData({...formData, borrowerName: e.target.value})} 
                        className="input-premium !bg-[var(--bg-secondary)]" 
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Mobile Number <span className="text-blue-500">*</span></label>
                      <input 
                        type="tel" 
                        placeholder="10-digit primary contact" 
                        value={formData.borrowerPhone} 
                        onChange={e => setFormData({...formData, borrowerPhone: e.target.value})} 
                        className="input-premium !bg-[var(--bg-secondary)]" 
                        required
                      />
                    </div>
                    {showNewBorrowerForm && (
                      <div className="sm:col-span-2 pt-2">
                        <button 
                          type="button" 
                          onClick={handleCreateNewBorrower} 
                          className="w-full text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 py-3.5 rounded-xl transition-all border border-blue-500/20"
                        >
                          Confirm & Register Entity
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Loan Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Transaction Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Principal Amount (₹) <span className="text-blue-500">*</span></label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-premium !text-lg font-black" placeholder="0.00" min="1" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Disbursement Date <span className="text-blue-500">*</span></label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-premium font-semibold" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Interest Rate (%)</label>
                  <input type="number" step="0.01" name="interestRate" value={formData.interestRate} onChange={handleChange} className="input-premium font-semibold" placeholder="0.00" />
                </div>
                <CustomSelect
                  label="Interest Protocol"
                  value={formData.interestType}
                  onChange={(e) => setFormData(prev => ({ ...prev, interestType: e.target.value }))}
                  options={interestOptions}
                />
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Repayment Deadline <span className="text-blue-500">*</span></label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="input-premium font-semibold" required />
                </div>
                <CustomSelect
                  label="Initial Status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  options={statusOptions}
                />
              </div>
            </div>

            {/* Section 3: Additional Info */}
            <div className="space-y-6 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-500">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Documentation</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Memo / Context</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  rows="3" 
                  className="input-premium resize-none py-4" 
                  placeholder="Record purpose of loan or any specific conditions..." 
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer Action */}
          <div className="sticky-footer flex items-center space-x-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-4"
            >
              Discard
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 btn-premium py-4"
            >
              {loading ? 'Processing Transaction...' : (loan ? 'Update Record' : 'Initialize Loan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanForm;