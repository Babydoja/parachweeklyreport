import React, { useState } from 'react';

const ScheduleModal = ({ day, onClose, onSave }) => {
  const [form, setForm] = useState({ tutor: '', subject: '', time: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.tutor || !form.subject || !form.time) {
      setError('All fields are required.');
      return;
    }

    const success = onSave(day, form);
    if (!success) {
      setError(`${form.tutor} already has a class at ${form.time}`);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Schedule for {day}</h2>
        <div className="space-y-3">
          <input
            name="tutor"
            onChange={handleChange}
            placeholder="Tutor"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          <input
            name="subject"
            onChange={handleChange}
            placeholder="Subject"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          <input
            name="time"
            type="time"
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
