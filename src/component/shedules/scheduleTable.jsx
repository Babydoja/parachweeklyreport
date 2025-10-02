import React from 'react';
import DayRow from './dayRow';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleTable = ({ schedule, onAddClick }) => (
  <div className="overflow-x-auto border rounded-lg shadow-md">
    <table className="min-w-full bg-white">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="text-left px-4 py-3 w-1/5">Day</th>
          <th className="text-left px-4 py-3">Scheduled Tutors</th>
          <th className="text-center px-4 py-3 w-32">Actions</th>
        </tr>
      </thead>
      <tbody>
        {days.map(day => (
          <DayRow
            key={day}
            day={day}
            entries={schedule[day] || []}
            onAdd={() => onAddClick(day)}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default ScheduleTable;
