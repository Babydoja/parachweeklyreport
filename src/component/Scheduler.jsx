import React, { useState, useRef } from 'react';

const hours = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`);

export default function Scheduler() {
const [people, setPeople] = useState([]);

  const [dragging, setDragging] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const dragMode = useRef(null);

  const toggleSlot = (personId, hourIndex, mode = null) => {
    setPeople(prev =>
      prev.map(p =>
        p.id === personId
          ? {
              ...p,
              schedule: p.schedule.map((s, i) =>
                i === hourIndex ? (mode === null ? !s : mode === 'select') : s
              ),
            }
          : p
      )
    );
  };

  const openEditModal = (personId) => {
    setSelectedPersonId(personId);
    setEditModalOpen(true);
  };

  const saveEditSchedule = (newSchedule) => {
    setPeople(prev =>
      prev.map(p =>
        p.id === selectedPersonId
          ? { ...p, schedule: newSchedule }
          : p
      )
    );
    setEditModalOpen(false);
  };

  const openAddModal = () => {
    setNewPersonName('');
    setAddModalOpen(true);
  };

  const addPerson = () => {
    if (!newPersonName.trim()) return;

    const id = Date.now(); // unique ID
    setPeople([
      ...people,
      { id, name: newPersonName.trim(), schedule: Array(hours.length).fill(false) },
    ]);
    setAddModalOpen(false);
  };

  const removePerson = (id) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const selectedPerson = people.find(p => p.id === selectedPersonId);

  return (
    <div className="p-6 font-[inter]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Team Scheduler</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Person
        </button>
      </div>

      <div className="overflow-x-auto">
       {people.length === 0 ? (
  <div className="text-center mt-12 text-gray-500">
    <p className="text-xl">🚫 No schedules found.</p>
    <p className="mt-2">Click <span className="font-semibold">"Add Person"</span> to begin scheduling.</p>
  </div>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full table-fixed border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1 w-32 text-left">Name</th>
          {hours.map(hour => (
            <th key={hour} className="border px-2 py-1 text-center">{hour}</th>
          ))}
          <th className="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {people.map(person => (
          <tr key={person.id} className="hover:bg-gray-50">
            <td className="border px-2 py-1 font-medium">{person.name}</td>
            {person.schedule.map((active, idx) => (
              <td
                key={idx}
                onMouseDown={() => {
                  setDragging(true);
                  dragMode.current = active ? 'deselect' : 'select';
                  toggleSlot(person.id, idx, dragMode.current);
                }}
                onMouseEnter={() => {
                  if (dragging) {
                    toggleSlot(person.id, idx, dragMode.current);
                  }
                }}
                onMouseUp={() => setDragging(false)}
                className={`border px-2 py-1 cursor-pointer select-none transition-colors ${
                  active ? 'bg-green-500 text-white' : 'bg-white'
                }`}
              />
            ))}
            <td className="border px-2 py-1 text-center space-x-2">
              <button
                onClick={() => openEditModal(person.id)}
                className="text-blue-600 underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => removePerson(person.id)}
                className="text-red-600 underline text-sm"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>

      {/* Edit Schedule Modal */}
      {editModalOpen && selectedPerson && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Schedule for {selectedPerson.name}</h2>
            <div className="grid grid-cols-4 gap-2">
              {hours.map((hour, idx) => (
                <div key={hour} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPerson.schedule[idx]}
                    onChange={(e) => {
                      const newSchedule = [...selectedPerson.schedule];
                      newSchedule[idx] = e.target.checked;
                      setSelectedPersonId(prev => {
                        setPeople(ps =>
                          ps.map(p =>
                            p.id === selectedPerson.id
                              ? { ...p, schedule: newSchedule }
                              : p
                          )
                        );
                        return prev;
                      });
                    }}
                  />
                  <span>{hour}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEditSchedule(selectedPerson.schedule)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Add New Person</h2>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter name"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addPerson}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag End Fix */}
      <div
        onMouseUp={() => setDragging(false)}
        className="fixed inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
