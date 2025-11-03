import React, { useEffect, useState } from "react";
import { Clock, Pencil, Trash2 } from "lucide-react"; // icons
import API from "../api/api";

const TutorTimetableManager = () => {
  const [entries, setEntries] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [entryForm, setEntryForm] = useState({
    tutor_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    subject: "",
  });

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const HOURS = Array.from({ length: 14 }, (_, i) => 9 + i); // 9AM–10PM

  // Fetch Tutors
  const fetchTutors = async () => {
    try {
      const res = await API.get("tutors/");
      setTutors(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch tutors:", err.response?.data || err.message);
    }
  };

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err.response?.data || err.message);
    }
  };

  // Fetch Tutor Timetable
  const fetchTutorEntries = async (tutorId) => {
    if (!tutorId) return;
    setLoading(true);
    try {
      const res = await API.get(`timetable/tutor/${tutorId}/`);
      setEntries(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch timetable:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
    fetchCourses();
  }, []);

  const handleTutorSelect = (tutor) => {
    setSelectedTutor(tutor);
    setEntryForm((prev) => ({ ...prev, tutor_id: tutor.id }));
    fetchTutorEntries(tutor.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedTutor) return;

  const payloadBase = {
    ...entryForm,
    tutor_id: selectedTutor.id,
  };

  const startHour = parseInt(entryForm.start_time.split(":")[0], 10);
  const endHour = parseInt(entryForm.end_time.split(":")[0], 10);

  // Validate time range
  if (startHour > endHour) {
    alert("Start time must be before end time.");
    return;
  }

  try {
    if (editingId) {
      // Single update for editing
      await API.put(`timetable/entries/${editingId}/`, payloadBase);
      setEditingId(null);
    } else {
      // Create an entry for every hour in the range
      const createRequests = [];
      for (let hour = startHour; hour <= endHour; hour++) {
        const hourStr = hour.toString().padStart(2, "0");

        const payload = {
          ...payloadBase,
          start_time: `${hourStr}:00`,
          end_time: `${hourStr}:59`,
        };

        createRequests.push(API.post("timetable/entries/create/", payload));
      }

      await Promise.all(createRequests);
    }

    fetchTutorEntries(selectedTutor.id);
    setEntryForm({
      tutor_id: selectedTutor.id,
      day_of_week: "",
      start_time: "",
      end_time: "",
      subject: "",
    });
  } catch (err) {
    console.error("Error saving entry:", err.response?.data || err.message);
    alert("Error saving timetable entry.");
  }
};


  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEntryForm({
      tutor_id: selectedTutor.id,
      day_of_week: entry.day_of_week,
      start_time: entry.start_time,
      end_time: entry.end_time,
      subject: entry.subject,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await API.delete(`timetable/entries/${id}/`);
      fetchTutorEntries(selectedTutor.id);
    } catch (err) {
      console.error("Error deleting entry:", err.response?.data || err.message);
      alert("Error deleting timetable entry.");
    }
  };

  // Group entries by day
  const byDay = {};
  for (let i = 0; i < 7; i++) byDay[i] = [];
  entries.forEach((e) => byDay[e.day_of_week]?.push(e));

  return (
    <div className="max-w-7xl mx-auto p-6 my-4 bg-gray-50 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center  mb-6">
        Tutor Timetable Manager
      </h2>

      {/* Tutor Selector */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {tutors.map((tutor) => (
          <button
            key={tutor.id}
            onClick={() => handleTutorSelect(tutor)}
            className={`px-4 py-2 rounded-lg border ${
              selectedTutor?.id === tutor.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-blue-300 hover:bg-blue-100"
            }`}
          >
            {tutor.name}
          </button>
        ))}
      </div>

      {/* Form */}
      {selectedTutor && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {editingId ? "Edit Entry" : "Add New Entry"}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Day of Week</label>
              <select
                name="day_of_week"
                value={entryForm.day_of_week}
                onChange={handleChange}
                required
                className="w-full border border-blue-300 rounded-lg p-2 mt-1"
              >
                <option value="">Select a day</option>
                {DAYS.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={entryForm.start_time}
                onChange={handleChange}
                required
                className="w-full border border-blue-300 rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input
                type="time"
                name="end_time"
                value={entryForm.end_time}
                onChange={handleChange}
                required
                className="w-full border border-blue-300 rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Course</label>
              <select
                name="subject"
                value={entryForm.subject}
                onChange={handleChange}
                required
                className="w-full border border-blue-300 rounded-lg p-2 mt-1"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.description}>
                    {course.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex gap-4 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? "Update Entry" : "Add Entry"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEntryForm({
                      tutor_id: selectedTutor.id,
                      day_of_week: "",
                      start_time: "",
                      end_time: "",
                      subject: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Timetable */}
      {selectedTutor && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <div className="grid grid-cols-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white sticky top-0 z-10">
            <div className="p-4 border-r border-r-blue-400">
                <Clock className="w-5 h-5 mx-auto" />
            </div>
            {DAYS.map((day) => (
              
              <div key={day} className="p-4 text-center font-semibold border-r border-blue-400 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-blue-100 hover:bg-blue-50 transition-colors">
              <div className="p-2 text-gray-500">{hour}:00</div>
              {DAYS.map((_, dayIdx) => (
                <div key={dayIdx} className="border-l border-l-blue-100 p-2 min-h-[80px] relative">
                  {byDay[dayIdx]
                    .filter((entry) => parseInt(entry.start_time.split(":")[0], 10) === hour)
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-blue-100 border flex justify-between items-center border-blue-400 text-blue-800 mb-2 shadow-sm rounded-lg p-3 text-sm transition-all duration-200 hover:shadow-md"
                      >
                        <div className="font-semibold">{entry.subject}</div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorTimetableManager;
