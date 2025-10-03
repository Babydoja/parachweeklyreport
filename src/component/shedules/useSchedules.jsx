import { useState } from 'react';

const useSchedule = () => {
  const [schedule, setSchedule] = useState({});

  const addEntry = (day, entry) => {
    const dayEntries = schedule[day] || [];

    const hasClash = dayEntries.some(
      e => e.tutor.toLowerCase() === entry.tutor.toLowerCase() && e.time === entry.time
    );

    if (hasClash) return false;

    const updated = {
      ...schedule,
      [day]: [...dayEntries, entry]
    };

    setSchedule(updated);
    return true;
  };

  return { schedule, addEntry };
};

export default useSchedule;