import React from 'react';
import { Plus, Wallet } from 'lucide-react';

const EmptyState = ({ 
  title = "No data found", 
  message = "Start tracking your activity by adding your first entry.", 
  onAction, 
  actionLabel = "Add New" 
}) => {
  return (
    <div className="glass-card flex flex-col items-center justify-center py-24 px-8 text-center animate-fade-in border-dashed border-2">
      <div className="relative mb-10">
        <div className="w-28 h-28 bg-[var(--bg-input)] rounded-[2.5rem] flex items-center justify-center border border-[var(--border-color)]">
          <Wallet className="w-14 h-14 text-blue-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 border-4 border-[var(--bg-secondary)] rounded-2xl flex items-center justify-center shadow-xl">
          <Plus className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <h3 className="text-3xl font-black text-[var(--text-primary)] mb-3 tracking-tight">{title}</h3>

      <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-10 leading-relaxed font-medium">
        {message}
      </p>
      
      {onAction && (
        <button 
          onClick={onAction}
          className="btn-premium px-10 py-5 h-16 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-black uppercase tracking-widest">{actionLabel}</span>
        </button>
      )}
    </div>
  );
};


export default EmptyState;
