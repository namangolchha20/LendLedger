import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

export const uploadProof = async (loanId, file) => {
  const timestamp = Date.now();
  const fileRef = ref(storage, `proofs/${loanId}/${timestamp}_${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return {
    url,
    name: file.name,
    timestamp,
    path: fileRef.fullPath,
  };
};

export const getProofsForLoan = async (loanId) => {
  const proofsRef = ref(storage, `proofs/${loanId}`);
  try {
    const result = await listAll(proofsRef);
    const proofs = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          url,
          name: itemRef.name,
          path: itemRef.fullPath,
        };
      })
    );
    return proofs;
  } catch (error) {
    return [];
  }
};

export const deleteProof = async (filePath) => {
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
};