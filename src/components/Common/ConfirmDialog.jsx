import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card max-w-md w-full overflow-hidden shadow-2xl border-white/10">
        <div className="flex items-center justify-between p-8 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{title}</h2>
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">Irreversible Action</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8">
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-4 p-8 pt-0">
          <button 
            onClick={onCancel} 
            className="flex-1 px-6 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all active:scale-95"
          >
            Discard
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl transition-all shadow-lg shadow-rose-500/20 hover:-translate-y-1 active:scale-95"
          >
            Authorize Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;