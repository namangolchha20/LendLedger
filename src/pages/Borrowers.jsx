import React, { useState, useMemo } from 'react';
import { useLoans } from '../contexts/LoanContext';
import BorrowerCard from '../components/Borrowers/BorrowerCard';
import EmptyState from '../components/Common/EmptyState';
import { Plus, Search, Users, X } from 'lucide-react';
import { getRiskLevel, calculateBorrowerStats } from '../utils/helpers';

const Borrowers = () => {
  const { borrowers, loans, addBorrower } = useLoans();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBorrower, setNewBorrower] = useState({ name: '', phone: '' });

  const borrowersWithStats = useMemo(() => {
    return borrowers.map(borrower => {
      const borrowerLoans = loans.filter(l => l.borrowerId === borrower.id);
      const stats = calculateBorrowerStats(borrowerLoans);
      return {
        ...borrower,
        stats,
        risk: getRiskLevel(stats)
      };
    });
  }, [borrowers, loans]);

  const filteredBorrowers = useMemo(() => {
    if (!searchTerm) return borrowersWithStats;
    return borrowersWithStats.filter(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm)
    );
  }, [borrowersWithStats, searchTerm]);

  const handleAddBorrower = async (e) => {
    e.preventDefault();
    if (!newBorrower.name || !newBorrower.phone) {
      return;
    }
    const result = await addBorrower(newBorrower);
    if (result.success) {
      setNewBorrower({ name: '', phone: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Borrower Directory</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">Complete record of your lending relationships.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium py-4 h-14">
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest">New Entity</span>
        </button>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Search Database</label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Query by name or contact number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium pl-12 h-14"
          />
        </div>
      </div>

      {/* Borrowers List */}
      {filteredBorrowers.length === 0 ? (
        <div className="pt-10">
          <EmptyState 
            title={searchTerm ? "No results found" : "Directory Empty"}
            message={searchTerm ? "No entities match your current query. Try different parameters." : "Initiate your borrower database by adding your first record."}
            actionLabel="Add First Entity"
            onAction={() => setShowForm(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBorrowers.map((borrower) => (
            <BorrowerCard key={borrower.id} borrower={borrower} />
          ))}
        </div>
      )}

      {/* Add Borrower Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card max-w-md w-full overflow-hidden shadow-2xl border-white/10">
            <div className="flex items-center justify-between p-8 border-b border-[var(--border-color)]">
              <div>
                <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">New Entity</h2>
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">Add to borrower directory</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddBorrower} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">
                  Full Name / Entity Name
                </label>
                <input
                  type="text"
                  value={newBorrower.name}
                  onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
                  className="input-premium h-14"
                  placeholder="e.g. Acme Corp / Jane Smith"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">
                  Primary Contact Number
                </label>
                <input
                  type="tel"
                  value={newBorrower.phone}
                  onChange={(e) => setNewBorrower({ ...newBorrower, phone: e.target.value })}
                  className="input-premium h-14"
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="flex-1 px-6 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all active:scale-95"
                >
                  Discard
                </button>
                <button type="submit" className="flex-1 btn-premium h-14">
                  <span className="font-black uppercase tracking-widest text-[10px]">Verify & Add</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default Borrowers;