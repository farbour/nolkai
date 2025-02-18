import { CalendarIcon } from '@heroicons/react/24/outline';
import { Event } from '@/types/dashboard';
import React from 'react';

// file path: src/components/dashboard/Calendar.tsx


interface CalendarProps {
  events: Event[];
}

export const Calendar: React.FC<CalendarProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
          <CalendarIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {events.map((event) => (
          <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">{event.title}</h3>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
                <div className="mt-1">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    event.type === 'meeting'
                      ? 'bg-blue-50 text-blue-700'
                      : event.type === 'deadline'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};