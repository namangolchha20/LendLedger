import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getLoans, 
  createLoan, 
  updateLoan, 
  deleteLoan,
  getLoansByBorrower 
} from '../services/loanService';
import { getBorrowers, createBorrower, updateBorrower, deleteBorrower } from '../services/borrowerService';

export const LoanContext = createContext();

export const useLoans = () => useContext(LoanContext);

export const LoanProvider = ({ children }) => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loansData, borrowersData] = await Promise.all([
        getLoans(user.uid),
        getBorrowers(user.uid)
      ]);
      setLoans(loansData);
      setBorrowers(borrowersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLoan = async (loanData) => {
    try {
      const newLoan = await createLoan(user.uid, loanData);
      setLoans(prev => [...prev, newLoan]);
      return { success: true, loan: newLoan };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const editLoan = async (loanId, loanData) => {
    try {
      await updateLoan(loanId, loanData);
      setLoans(prev => prev.map(loan => 
        loan.id === loanId ? { ...loan, ...loanData } : loan
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeLoan = async (loanId) => {
    try {
      await deleteLoan(loanId);
      setLoans(prev => prev.filter(loan => loan.id !== loanId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addBorrower = async (borrowerData) => {
    try {
      const newBorrower = await createBorrower(user.uid, borrowerData);
      setBorrowers(prev => [...prev, newBorrower]);
      return { success: true, borrower: newBorrower };
    } catch (error) {
      console.error('Add borrower error:', error);
      return { success: false, error: error.message };
    }
  };

  const editBorrower = async (borrowerId, borrowerData) => {
    try {
      await updateBorrower(borrowerId, borrowerData);
      setBorrowers(prev => prev.map(borrower => 
        borrower.id === borrowerId ? { ...borrower, ...borrowerData } : borrower
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeBorrower = async (borrowerId) => {
    try {
      await deleteBorrower(borrowerId);
      setBorrowers(prev => prev.filter(borrower => borrower.id !== borrowerId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    loans,
    borrowers,
    loading,
    addLoan,
    editLoan,
    removeLoan,
    addBorrower,
    editBorrower,
    removeBorrower,
    refreshData: loadData,
  };

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
};