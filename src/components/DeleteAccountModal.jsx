import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Confirmation modal for permanent account deletion. Unlike DeleteModal
 * (used for single events, which support undo), this action is
 * irreversible — the user must type "DELETE" to enable the confirm button.
 */
export default function DeleteAccountModal({ onCancel, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canConfirm = confirmText.trim().toUpperCase() === 'DELETE' && !deleting;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setDeleting(true);
    setErrorMsg('');
    const result = await onConfirm();
    if (result && result.success === false) {
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
      setDeleting(false);
    }
    // On success the parent unmounts this modal (session resets), so no
    // need to setDeleting(false) in that path.
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div className="glass-panel rounded-2xl p-6 max-w-sm w-full animate-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
          <AlertTriangle size={22} className="text-red-600" />
        </div>

        <h3 id="delete-account-title" className="text-lg font-bold text-gray-900 text-center mb-2">
          Delete your account?
        </h3>

        <p className="text-sm text-gray-500 text-center mb-4">
          This permanently deletes your account, all of your saved countdowns, and your profile
          (including your avatar). This action <strong>cannot be undone</strong>.
        </p>

        <label
          htmlFor="delete-account-confirm"
          className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider"
        >
          Type <strong>DELETE</strong> to confirm
        </label>
        <input
          id="delete-account-confirm"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          autoComplete="off"
          disabled={deleting}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 mb-3 disabled:opacity-60"
        />

        {errorMsg && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{errorMsg}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 font-semibold py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 font-semibold py-2 rounded-xl text-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {deleting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Deleting...
              </>
            ) : (
              'Delete permanently'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}