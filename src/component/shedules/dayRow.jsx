import React from 'react';

const DayRow = ({ day, entries, onAdd }) => (
  <tr className="border-t hover:bg-gray-50">
    <td className="px-4 py-3 font-semibold">{day}</td>
    <td className="px-4 py-3">
      {entries.length > 0 ? (
        <ul className="space-y-3">
          {entries.map((entry, idx) => (
            <li
              key={idx}
              className="bg-white border rounded shadow-sm p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">{entry.tutor}</p>
                <p className="text-sm text-gray-500">{entry.subject}</p>
              </div>
              <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {entry.time}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <span className="italic text-gray-400">No schedules</span>
      )}
    </td>
    <td className="px-4 py-3 text-center">
      <button
        onClick={onAdd}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      >
        + Add
      </button>
    </td>
  </tr>
);

export default DayRow;
