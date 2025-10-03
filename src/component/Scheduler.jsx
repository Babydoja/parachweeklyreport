import React, { useState } from 'react';
import ScheduleTable from './shedules/scheduleTable.jsx';
import ScheduleModal from './shedules/ScheduleModal';
import useSchedule from './shedules/useSchedules';

function Scheduler() {
  const { schedule, addEntry } = useSchedule();
  const [modalDay, setModalDay] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Tutor Weekly Scheduler</h1>

      <ScheduleTable
        schedule={schedule}
        onAddClick={(day) => setModalDay(day)}
      />

      {modalDay && (
        <ScheduleModal
          day={modalDay}
          onClose={() => setModalDay(null)}
          onSave={addEntry}
        />
      )}
    </div>
  );
}

export default Scheduler

