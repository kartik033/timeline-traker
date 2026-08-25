import React from 'react';
import { Calendar } from 'lucide-react';
import EventCard from './EventCard';

export default function EventList({ events, currentTime, onEdit, onDeleteRequest }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 panel-animate">
        <Calendar size={36} className="mx-auto mb-3 opacity-20" aria-hidden="true" />
        <p className="text-sm">No events left. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div key={event.id} className="card-animate" style={{ '--i': index }}>
          <EventCard
            event={event}
            currentTime={currentTime}
            onEdit={onEdit}
            onDeleteRequest={onDeleteRequest}
          />
        </div>
      ))}
    </div>
  );
}