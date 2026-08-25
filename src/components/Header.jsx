import React, { useRef } from 'react';
import { Plus, X, Calculator, Download, Upload } from 'lucide-react';

export default function Header({
  isCompareOpen,
  isFormOpen,
  onToggleCompare,
  onToggleAdd,
  onExport,
  onImport,
}) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = '';
  };

  return (
    <div className="flex justify-between items-center mb-5 sm:mb-6 px-1">
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
        Timeline Tracker
      </h1>
      <div className="flex gap-2">
        <button
          onClick={onExport}
          className="p-1.5 sm:p-2 rounded-full transition-colors shadow-sm bg-white/90 text-gray-700 hover:bg-white"
          title="Export events as JSON"
          aria-label="Export events as JSON"
        >
          <Download size={18} aria-hidden="true" />
        </button>
        <button
          onClick={handleImportClick}
          className="p-1.5 sm:p-2 rounded-full transition-colors shadow-sm bg-white/90 text-gray-700 hover:bg-white"
          title="Import events from JSON"
          aria-label="Import events from JSON"
        >
          <Upload size={18} aria-hidden="true" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
        />
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