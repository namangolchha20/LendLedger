import { db } from './firebase';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp 
} from 'firebase/firestore';

const LOANS_COLLECTION = 'loans';

export const getLoans = async (userId) => {
  const q = query(
    collection(db, LOANS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate(),
    dueDate: doc.data().dueDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  }));
};

export const getLoansByBorrower = async (userId, borrowerId) => {
  const q = query(
    collection(db, LOANS_COLLECTION),
    where('userId', '==', userId),
    where('borrowerId', '==', borrowerId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate(),
    dueDate: doc.data().dueDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  }));
};

export const createLoan = async (userId, loanData) => {
  const loan = {
    ...loanData,
    userId,
    borrowerId: loanData.borrowerId,
    amount: Number(loanData.amount),
    interestRate: Number(loanData.interestRate) || 0,
    interestType: loanData.interestType || 'none',
    date: Timestamp.fromDate(loanData.date),
    dueDate: Timestamp.fromDate(loanData.dueDate),
    status: loanData.status || 'pending',
    confirmationStatus: loanData.confirmationStatus || 'pending',
    notes: loanData.notes || '',
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, LOANS_COLLECTION), loan);
  return {
    id: docRef.id,
    ...loan,
    date: loanData.date,
    dueDate: loanData.dueDate,
    createdAt: new Date(),
  };
};

export const updateLoan = async (loanId, loanData) => {
  const loanRef = doc(db, LOANS_COLLECTION, loanId);
  const updates = { ...loanData };
  if (loanData.date && loanData.date instanceof Date) {
    updates.date = Timestamp.fromDate(loanData.date);
  }
  if (loanData.dueDate && loanData.dueDate instanceof Date) {
    updates.dueDate = Timestamp.fromDate(loanData.dueDate);
  }
  if (loanData.amount) {
    updates.amount = Number(loanData.amount);
  }
  if (loanData.interestRate !== undefined) {
    updates.interestRate = Number(loanData.interestRate);
  }
  if (loanData.interestType) {
    updates.interestType = loanData.interestType;
  }
  await updateDoc(loanRef, updates);
};

export const deleteLoan = async (loanId) => {
  const loanRef = doc(db, LOANS_COLLECTION, loanId);
  await deleteDoc(loanRef);
};

export const markAsRepaid = async (loanId) => {
  const loanRef = doc(db, LOANS_COLLECTION, loanId);
  await updateDoc(loanRef, {
    status: 'paid',
    repaidAt: Timestamp.now(),
  });
};