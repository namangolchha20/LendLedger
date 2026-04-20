import { useContext } from 'react';
import { LoanContext } from '../contexts/LoanContext';

export const useBorrowers = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useBorrowers must be used within a LoanProvider');
  }
  // Return only borrower-related methods from the context
  return {
    borrowers: context.borrowers,
    loading: context.loading,
    addBorrower: context.addBorrower,
    editBorrower: context.editBorrower,
    removeBorrower: context.removeBorrower,
    refreshData: context.refreshData,
  };
};