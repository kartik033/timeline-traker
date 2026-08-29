import React from 'react';
import { Plus, X, Calculator, Share2 } from 'lucide-react';

export default function Header({
  isCompareOpen,
  isFormOpen,
  onToggleCompare,
  onToggleAdd,
  onShareImage,
}) {
  return (
    <div className="flex justify-between items-center mb-5 sm:mb-6 px-1">
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
        Timeline Tracker
      </h1>
      <div className="flex gap-2">
        <button
          onClick={onShareImage}
          className="p-1.5 sm:p-2 rounded-full transition-colors shadow-sm bg-white/90 text-gray-700 hover:bg-white"
          title="Share timeline as image"
          aria-label="Share timeline as image"
        >
          <Share2 size={18} aria-hidden="true" />
        </button>
        <button
          onClick={onToggleCompare}
          className={`p-1.5 sm:p-2 rounded-full transition-colors shadow-sm ${
            isCompareOpen ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
          title="Compare Dates"
          aria-label="Compare dates between two events"
          aria-pressed={isCompareOpen}
        >
          <Calculator size={18} aria-hidden="true" />
        </button>
        <button
          onClick={onToggleAdd}
          className="bg-gray-900 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          title="Add Event"
          aria-label={isFormOpen ? 'Close add event form' : 'Add new event'}
        >
          {isFormOpen ? <X size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}