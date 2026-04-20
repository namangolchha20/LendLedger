import React, { useState, useEffect } from 'react';
import { uploadProof, getProofsForLoan, deleteProof } from '../../services/storageService';
import { Image, FileText, X, Upload, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const ProofUpload = ({ loanId }) => {
  const [proofs, setProofs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loanId) {
      loadProofs();
    }
  }, [loanId]);

  const loadProofs = async () => {
    setLoading(true);
    try {
      const files = await getProofsForLoan(loanId);
      setProofs(files);
    } catch (error) {
      console.error('Error loading proofs:', error);
      toast.error('Failed to load proofs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF files are allowed');
      return;
    }

    setUploading(true);
    try {
      const proof = await uploadProof(loanId, file);
      setProofs(prev => [...prev, proof]);
      toast.success('Proof uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload proof');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteProof = async (proof) => {
    if (window.confirm('Delete this verification asset?')) {
      try {
        await deleteProof(proof.path);
        setProofs(prev => prev.filter(p => p.path !== proof.path));
        toast.success('Asset deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete asset');
      }
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <Image className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const isImage = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--border-color)] border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group cursor-pointer relative">
        <input
          type="file"
          id="proof-upload"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="proof-upload"
          className="cursor-pointer flex flex-col items-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-blue-500 group-hover:scale-110 transition-all shadow-sm">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider block">
              {uploading ? 'Processing Protocol...' : 'Upload Verification Asset'}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Supports JPG, PNG, PDF (Max 5MB)</span>
          </div>
        </label>
      </div>

      {/* Proofs List */}
      {proofs.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Stored Assets</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {proofs.map((proof, index) => (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden bg-[var(--bg-input)] border border-[var(--border-color)] shadow-sm aspect-square"
              >
                {isImage(proof.name) ? (
                  <img
                    src={proof.url}
                    alt={proof.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-blue-500">
                      {getFileIcon(proof.name)}
                    </div>
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-tight truncate max-w-[80%]">
                      {proof.name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-3">
                  <a
                    href={proof.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    title="View Asset"
                  >
                    <Eye className="w-5 h-5 text-blue-900" />
                  </a>
                  <button
                    onClick={() => handleDeleteProof(proof)}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-rose-50 hover:scale-110 transition-transform shadow-lg group/del"
                    title="Discard Asset"
                  >
                    <Trash2 className="w-5 h-5 text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {proofs.length === 0 && !loading && (
        <div className="p-6 rounded-2xl bg-[var(--bg-input)]/50 border border-[var(--border-color)] text-center">
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">No verification assets uploaded to this record.</p>
        </div>
      )}
    </div>
  );
};


export default ProofUpload;