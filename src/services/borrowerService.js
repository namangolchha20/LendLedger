import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';

const BORROWERS_COLLECTION = 'borrowers';

export const getBorrowers = async (userId) => {
  const q = query(
    collection(db, BORROWERS_COLLECTION),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  }));
};

export const getBorrowerByPhone = async (userId, phone) => {
  const q = query(
    collection(db, BORROWERS_COLLECTION),
    where('userId', '==', userId),
    where('phone', '==', phone)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
    createdAt: snapshot.docs[0].data().createdAt?.toDate(),
  };
};

export const createBorrower = async (userId, borrowerData) => {
  const borrower = {
    ...borrowerData,
    userId,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, BORROWERS_COLLECTION), borrower);
  return {
    id: docRef.id,
    ...borrower,
    createdAt: new Date(),
  };
};

export const updateBorrower = async (borrowerId, borrowerData) => {
  const borrowerRef = doc(db, BORROWERS_COLLECTION, borrowerId);
  await updateDoc(borrowerRef, borrowerData);
};

export const deleteBorrower = async (borrowerId) => {
  const borrowerRef = doc(db, BORROWERS_COLLECTION, borrowerId);
  await deleteDoc(borrowerRef);
};