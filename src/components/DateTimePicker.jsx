import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/style.css';

const pad = (n) => String(n).padStart(2, '0');
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const YEARS_PER_PAGE = 12;

export default function DateTimePicker({ value, onChange, onDaySelected }) {
  const initialDate = value ? new Date(value) : new Date();

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [month, setMonth] = useState(initialDate);
  const [view, setView] = useState('day');
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor(initialDate.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE
  );
  const [hours, setHours] = useState(pad(initialDate.getHours()));
  const [minutes, setMinutes] = useState(pad(initialDate.getMinutes()));

  const buildValue = (date, h, m) => {
    const d = new Date(date);
    d.setHours(Number(h), Number(m), 0, 0);
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}T${pad(h)}:${pad(m)}`;
  };

  // Selecting a day now finalizes the date immediately and collapses
  // the picker -- no separate "Confirm" click needed. The event form's
  // own Add/Update button remains the real submit action.
  const handleDaySelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setMonth(date);
    onChange(buildValue(date, hours, minutes));
    onDaySelected?.();
  };

  const handleTimeChange = (field, val) => {
    const clean = val.replace(/\D/g, '').slice(0, 2);
    if (field === 'hours') {
      const clamped = clean === '' ? '' : String(Math.min(23, Number(clean)));
      setHours(clamped);
      if (clamped !== '') onChange(buildValue(selectedDate, clamped, minutes || '0'));
    } else {
      const clamped = clean === '' ? '' : String(Math.min(59, Number(clean)));
      setMinutes(clamped);
      if (clamped !== '') onChange(buildValue(selectedDate, hours || '0', clamped));
    }
  };

  const handleMonthPick = (monthIndex) => {
    const newMonth = new Date(month.getFullYear(), monthIndex, 1);
    setMonth(newMonth);
    setView('day');
  };

  const handleYearPick = (year) => {
    const newMonth = new Date(year, month.getMonth(), 1);
    setMonth(newMonth);
    setView('month');
  };

  const displayLabel = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const currentYear = month.getFullYear();

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <CalendarIcon size={15} className="text-blue-600" aria-hidden="true" />
        {displayLabel}
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
        {view === 'year' ? (
          <>
            <button
              type="button"
              onClick={() => setYearPageStart((p) => p - YEARS_PER_PAGE)}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Previous years"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-gray-800">
              {yearPageStart} – {yearPageStart + YEARS_PER_PAGE - 1}
            </span>
            <button
              type="button"
              onClick={() => setYearPageStart((p) => p + YEARS_PER_PAGE)}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Next years"
            >
              <ChevronRight size={16} />
            </button>
          </>
        ) : view === 'month' ? (
          <button
            type="button"
            onClick={() => setView('year')}
            className="w-full text-center text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors py-1"
          >
            {currentYear} <span className="text-gray-400 text-xs">(tap to change year)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setView('month')}
            className="w-full text-center text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors py-1"
          >
            {MONTH_NAMES[month.getMonth()]} {currentYear}{' '}
            <span className="text-gray-400 text-xs">(tap to zoom out)</span>
          </button>
        )}
      </div>

      {view === 'year' && (
        <div className="grid grid-cols-4 gap-2 animate-in fade-in zoom-in-95">
          {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i).map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearPick(year)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                year === currentYear
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {view === 'month' && (
        <div className="grid grid-cols-3 gap-2 animate-in fade-in zoom-in-95">
          {MONTH_NAMES.map((name, idx) => (
            <button
              key={name}
              type="button"
              onClick={() => handleMonthPick(idx)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                idx === month.getMonth()
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {view === 'day' && (
        <div className="animate-in fade-in zoom-in-95">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            month={month}
            onMonthChange={setMonth}
            hideNavigation
            className="mx-auto"
            classNames={{
              day_button: 'rounded-lg hover:bg-blue-50 transition-colors text-sm',
              selected: 'bg-blue-600 text-white rounded-lg',
              today: 'font-bold text-blue-600',
              month_caption: 'hidden',
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
        <Clock size={15} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium text-gray-500 flex-shrink-0">Time:</span>
        <input
          type="text"
          inputMode="numeric"
          value={hours}
          onChange={(e) => handleTimeChange('hours', e.target.value)}
          placeholder="HH"
          aria-label="Hour"
          className="w-12 text-center px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-400 font-bold">:</span>
        <input
          type="text"
          inputMode="numeric"
          value={minutes}
          onChange={(e) => handleTimeChange('minutes', e.target.value)}
          placeholder="MM"
          aria-label="Minute"
          className="w-12 text-center px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-[11px] text-gray-400 ml-1">24h format</span>
      </div>
    </div>
  );
}