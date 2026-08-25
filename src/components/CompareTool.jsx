import React from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { getComparisonResult } from '../utils/dateHelpers';

export default function CompareTool({ events, compareId1, compareId2, setCompareId1, setCompareId2 }) {
  const ev1 = events.find((e) => e.id.toString() === compareId1);
  const ev2 = events.find((e) => e.id.toString() === compareId2);
  const comparison =
    compareId1 && compareId2 && compareId1 !== compareId2 ? getComparisonResult(ev1, ev2) : null;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm mb-5 sm:mb-6 space-y-4 animate-in fade-in slide-in-from-top-4 border border-gray-100">
      <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-2 flex items-center gap-2">
        <Calculator size={16} className="text-blue-600" aria-hidden="true" /> Time Between Stages
      </h2>

      <div className="flex flex-col gap-3">
        <select
          value={compareId1}
          onChange={(e) => setCompareId1(e.target.value)}
          aria-label="Select first stage to compare"
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
        >
          <option value="">Select first stage...</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} ({new Date(ev.date).toLocaleDateString()})
            </option>
          ))}
        </select>

        <div className="flex justify-center -my-1 relative z-10">
          <div className="bg-white p-1 rounded-full border border-gray-100 shadow-sm">
            <ArrowRight size={14} className="text-gray-400 rotate-90" aria-hidden="true" />
          </div>
        </div>

        <select
          value={compareId2}
          onChange={(e) => setCompareId2(e.target.value)}
          aria-label="Select second stage to compare"
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
        >
          <option value="">Select second stage...</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} ({new Date(ev.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {comparison && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
          <div className="text-xs text-blue-600/80 font-bold uppercase tracking-wider mb-1">
            Total Time Elapsed
          </div>
          <div className="text-xl font-bold text-blue-900 leading-tight">
            {comparison.months > 0 && `${comparison.months} Month${comparison.months !== 1 ? 's' : ''}`}
            {comparison.months > 0 && comparison.remainingDays > 0 && ', '}
            {(comparison.remainingDays > 0 || comparison.months === 0) &&
              `${comparison.remainingDays} Day${comparison.remainingDays !== 1 ? 's' : ''}`}
          </div>
          {comparison.months > 0 && (
            <div className="text-sm font-medium text-blue-700 mt-1 opacity-80">
              ({comparison.totalDays} total days)
            </div>
          )}
          <div className="text-[11px] text-blue-600/70 mt-2">
            From <strong>{comparison.firstEv.name}</strong> to <strong>{comparison.secondEv.name}</strong>
          </div>
        </div>
      )}
    </div>
  );
}