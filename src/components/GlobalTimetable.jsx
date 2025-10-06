import React, { useEffect, useState } from "react";
import { Clock, User, Users } from "lucide-react";
import API from "../api/api";
import { Link } from "react-router-dom";

const GlobalTimetable = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const HOURS = Array.from({ length: 14 }, (_, i) => 9 + i); // 9:00–22:00
  const HOUR_HEIGHT = 80;

  const fetchAllEntries = async () => {
    setLoading(true);
    try {
      const res = await API.get("timetable/all/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      data.sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
        return (a.start_time || "").localeCompare(b.start_time || "");
      });
      setEntries(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch global timetable:", err.response?.data || err.message);
      setError("Failed to load timetable");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEntries();
  }, []);

  // Group entries by day
  const byDay = {};
  for (let i = 0; i < 7; i++) byDay[i] = [];
  entries.forEach((e) => {
    const d = Number(e.day_of_week);
    if (!isNaN(d) && d >= 0 && d < 7) byDay[d].push(e);
  });

  const tutorDisplay = (entry) => entry.tutor_name || "Unknown Tutor";

  // 🎨 Define a color palette for tutors
  const tutorColors = [
    "from-pink-100 to-pink-200 border-pink-400",
    "from-green-100 to-green-200 border-green-400",
    "from-yellow-100 to-yellow-200 border-yellow-400",
    "from-purple-100 to-purple-200 border-purple-400",
    "from-orange-100 to-orange-200 border-orange-400",
    "from-teal-100 to-teal-200 border-teal-400",
    "from-indigo-100 to-indigo-200 border-indigo-400",
    "from-red-100 to-red-200 border-red-400",
  ];

  // 🔢 Map tutors to specific colors
  const tutorColorMap = {};
  let colorIndex = 0;
  entries.forEach((entry) => {
    const tutor = tutorDisplay(entry);
    if (!tutorColorMap[tutor]) {
      tutorColorMap[tutor] = tutorColors[colorIndex % tutorColors.length];
      colorIndex++;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Global Timetable</h1>
          <p className="max-w-2xl mx-auto my-2">
            Showing all tutors' scheduled sessions — each tutor has a different color.
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
            <Link to="/tutortable">View All Tutor Entries</Link>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-blue-700">Loading timetable...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-6">
            <p className="text-blue-700 text-center">{error}</p>
          </div>
        )}

        {/* Timetable */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              {/* Days Header */}
              <div className="grid grid-cols-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white sticky top-0 z-10">
                <div className="p-4 border-r border-blue-400">
                  <Clock className="w-5 h-5 mx-auto" />
                </div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center font-semibold border-r border-blue-400 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Hours */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-8 border-b border-blue-100 hover:bg-blue-50 transition-colors"
                >
                  {/* Hour */}
                  <div
                    className="p-4 text-sm text-[#1d1e4f] font-medium border-r border-blue-100 flex items-start justify-center bg-blue-50"
                    style={{ minHeight: `${HOUR_HEIGHT}px` }}
                  >
                    <span className="sticky top-20">{hour}:00</span>
                  </div>

                  {/* Day Cells */}
                  {DAYS.map((_, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="p-3 border-r border-blue-100 last:border-r-0 flex flex-wrap gap-2"
                      style={{ minHeight: `${HOUR_HEIGHT}px` }}
                    >
                      {byDay[dayIdx]
                        .filter((entry) => {
                          if (!entry.start_time) return false;
                          const entryHour = parseInt(String(entry.start_time).split(":")[0], 10);
                          return entryHour === hour;
                        })
                        .map((entry) => {
                          const tutor = tutorDisplay(entry);
                          const color = tutorColorMap[tutor] || "from-gray-100 to-gray-200 border-gray-300";
                          return (
                            <div
                              key={entry.id}
                              className={`rounded-lg p-3 text-sm transition-all duration-200 hover:shadow-md flex gap-[20px] items-center bg-gradient-to-br ${color}`}
                            >
                              <div className="font-semibold text-blue-900 flex items-start gap-1">
                                <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-700" />
                                <span className="line-clamp-2">{entry.subject || "Untitled"}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-blue-700">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{tutor}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color Legend */}
        {!loading && !error && entries.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            {Object.entries(tutorColorMap).map(([tutor, color]) => (
              <div key={tutor} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded bg-gradient-to-br ${color}`}></div>
                <span className="text-blue-700 font-medium">{tutor}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalTimetable;
