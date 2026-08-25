import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-xs w-full shadow-xl animate-in zoom-in-95">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle size={20} className="text-red-600" aria-hidden="true" />
          </div>
          <h3 id="delete-modal-title" className="text-lg font-bold text-gray-900">
            Delete Event?
          </h3>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          Are you sure you want to remove this countdown? You can undo this right after.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}