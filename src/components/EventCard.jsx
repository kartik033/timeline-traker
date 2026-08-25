import React from 'react';
import { Check, Edit2, Trash2 } from 'lucide-react';
import { calculateTimeDiff, formatDateLabel } from '../utils/dateHelpers';

export default function EventCard({ event, currentTime, onEdit, onDeleteRequest }) {
  const timeDiff = calculateTimeDiff(event.date, currentTime);

  return (
    <div
      className="flex rounded-[18px] overflow-hidden text-white shadow-sm transition-transform hover:scale-[1.01] cursor-default relative group h-[80px] sm:h-[88px]"
    >
      {/* Left Side (Details) */}
      <div className={`flex-1 ${event.theme.main} pl-3 pr-2 sm:px-4 py-2 flex items-center relative min-w-0`}>
        {/* Action Buttons (Edit / Delete) */}
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 bg-black/15 hover:bg-black/30 rounded-full transition-colors"
            title="Edit"
            aria-label={`Edit ${event.name}`}
          >
            <Edit2 size={11} className="text-white" aria-hidden="true" />
          </button>
          <button
            onClick={() => onDeleteRequest(event.id)}
            className="p-1.5 bg-black/15 hover:bg-red-500/80 rounded-full transition-colors"
            title="Delete"
            aria-label={`Delete ${event.name}`}
          >
            <Trash2 size={11} className="text-white" aria-hidden="true" />
          </button>
        </div>

        {/* Icon Area */}
        <div className="relative mr-2.5 sm:mr-3.5 flex-shrink-0">
          <div className="text-[28px] sm:text-[32px] filter drop-shadow-sm leading-none" aria-hidden="true">
            {event.icon}
          </div>
          <div className="absolute -bottom-0.5 -right-1 sm:-right-1.5 bg-[#2c2c2e] rounded-full p-[2px] border-[1.5px] border-transparent">
            <Check size={8} strokeWidth={4} className="text-white" aria-hidden="true" />
          </div>
        </div>

        {/* Text Details Area */}
        <div className="flex-1 min-w-0 pr-8 sm:pr-10 flex flex-col justify-center">
          <h2 className="text-[18px] sm:text-[22px] leading-tight font-bold tracking-tight mb-0.5 drop-shadow-sm truncate">
            {event.name}
          </h2>
          <div className="flex items-center text-[11px] sm:text-[13px] text-white/90 font-medium truncate">
            <span className="truncate tracking-wide">{formatDateLabel(event.date)}</span>
            {event.hasO && (
              <div
                className="ml-1.5 flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-black/25 rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-bold"
                title="Officially confirmed"
                aria-label="Officially confirmed"
              >
                o
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side (Countdown Number) */}
      <div className={`w-[80px] sm:w-[96px] flex-shrink-0 ${event.theme.dark} flex flex-col justify-center items-center px-1`}>
        <div className="text-[30px] sm:text-[36px] leading-none font-bold tracking-tight drop-shadow-sm">
          {timeDiff.value}
        </div>
        <div className="text-[10px] sm:text-[12px] font-medium text-white/90 tracking-wide mt-0.5 text-center leading-tight uppercase">
          {timeDiff.unit}
          <br />
          {timeDiff.suffix}
        </div>
      </div>
    </div>
  );
}