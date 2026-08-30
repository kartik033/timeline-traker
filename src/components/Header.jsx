import React from 'react';
import { Plus, X, Calculator, Share2, LogIn, User } from 'lucide-react';

export default function Header({
  isCompareOpen,
  isFormOpen,
  isGuest,
  avatarUrl,
  onToggleCompare,
  onToggleAdd,
  onShareImage,
  onOpenAuth,
  onOpenProfile,
}) {
  return (
    <div className="flex justify-between items-center mb-5 sm:mb-6 px-1 gap-2">
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm truncate">MyPathTracker</h1>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Primary account action: always visible, never a dead end. */}
        {isGuest ? (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-white text-gray-800 font-semibold px-3 py-1.5 rounded-full text-xs hover:bg-gray-100 transition-colors shadow-sm"
          >
            <LogIn size={13} aria-hidden="true" />
            Sign up
          </button>
        ) : (
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center ring-1 ring-white/40 hover:ring-white/70 transition-all flex-shrink-0"
            aria-label="Open profile"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={14} className="text-white" aria-hidden="true" />
            )}
          </button>
        )}

        <div className="w-px h-5 bg-white/20 mx-0.5" aria-hidden="true" />

        <button
          onClick={onShareImage}
          className="p-1.5 sm:p-2 rounded-full transition-colors shadow-sm bg-white/90 text-gray-700 hover:bg-white"
          title="Share timeline as image"
          aria-label="Share timeline as image"
        >
          <Share2 size={17} aria-hidden="true" />
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
          <Calculator size={17} aria-hidden="true" />
        </button>
        <button
          onClick={onToggleAdd}
          className="bg-gray-900 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          title="Add Event"
          aria-label={isFormOpen ? 'Close add event form' : 'Add new event'}
        >
          {isFormOpen ? <X size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}