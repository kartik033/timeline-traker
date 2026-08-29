import React from 'react';
import { X, Download } from 'lucide-react';
import { downloadDataUrl } from '../utils/exportImage';

export default function SharePreviewModal({ dataUrl, onClose }) {
  const handleDownload = () => downloadDataUrl(dataUrl, 'my-timeline.png');

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">Your Timeline Image</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <img
          src={dataUrl}
          alt="Your timeline"
          className="w-full rounded-xl border border-gray-100 mb-4"
        />

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
        >
          <Download size={15} aria-hidden="true" />
          Download Image
        </button>
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Save it, then share to WhatsApp, Instagram, or wherever you like.
        </p>
      </div>
    </div>
  );
}