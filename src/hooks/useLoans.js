import { useContext } from 'react';
import { LoanContext } from '../contexts/LoanContext';

export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
};