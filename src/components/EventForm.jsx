import React, { useState } from 'react';
import { Type, Calendar, ChevronDown } from 'lucide-react';
import DateTimePicker from './DateTimePicker';

export default function EventForm({
  editingId,
  newEventName,
  newEventDate,
  setNewEventName,
  setNewEventDate,
  onSubmit,
  onCancel,
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(!newEventDate);

  const displaySummary = newEventDate
    ? new Date(newEventDate).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Choose a date & time';

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm mb-5 sm:mb-6 space-y-4 animate-in fade-in slide-in-from-top-4 border border-gray-100"
    >
      <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-2">
        {editingId ? 'Edit Event' : 'Add New Event'}
      </h2>

      <div>
        <label htmlFor="event-name" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
          Event Name
        </label>
        <div className="relative">
          <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} aria-hidden="true" />
          <input
            id="event-name"
            type="text"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            placeholder="e.g. Assessment"
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
          Date & Time
        </label>
        <button
          type="button"
          onClick={() => setIsPickerOpen(!isPickerOpen)}
          className="w-full flex items-center justify-between pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors relative text-left"
        >
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} aria-hidden="true" />
          <span className={newEventDate ? 'text-gray-800 font-medium' : 'text-gray-400'}>
            {displaySummary}
          </span>
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isPickerOpen && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2">
            <DateTimePicker
              value={newEventDate}
              onChange={setNewEventDate}
              onDaySelected={() => setIsPickerOpen(false)}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        {editingId && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!newEventDate}
          className={`flex-[2] text-white font-semibold py-2 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 ${
            editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}