import React, { useEffect } from 'react';
import { Undo2 } from 'lucide-react';

/**
 * Bottom toast with an Undo action. Auto-dismisses after `duration` ms
 * unless dismissed manually or undone.
 */
export default function Toast({ message, onUndo, onDismiss, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-4 max-w-[90vw]"
    >
      <span className="truncate">{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="flex items-center gap-1 font-semibold text-blue-300 hover:text-blue-200 transition-colors flex-shrink-0"
        >
          <Undo2 size={14} aria-hidden="true" />
          Undo
        </button>
      )}
    </div>
  );
}