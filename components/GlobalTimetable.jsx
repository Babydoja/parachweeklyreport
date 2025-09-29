import React, { useEffect, useState } from "react";
import API from "../api/api";

const GlobalTimetable = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const HOURS = Array.from({ length: 14 }, (_, i) => 9 + i); // 9:00–22:00
  const HOUR_HEIGHT = 80;

  // Fetch all timetable entries (global)
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

  const styles = {
    container: {
      maxWidth: "95%",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    heading: { textAlign: "center", marginBottom: "12px" },
    sub: { textAlign: "center", marginBottom: "18px", color: "#666", fontSize: 14 },
    gridWrapper: { overflowX: "auto", marginTop: "12px" },
    grid: { display: "grid", gridTemplateColumns: "100px repeat(7, 1fr)" },
    timeCell: {
      height: `${HOUR_HEIGHT}px`,
      borderBottom: "1px solid #eee",
      fontSize: "12px",
      color: "gray",
      padding: "8px 6px",
    },
    dayHeader: {
      textAlign: "center",
      fontWeight: "bold",
      padding: "8px 6px",
      borderBottom: "1px solid #ddd",
    },
    dayCell: {
      minHeight: `${HOUR_HEIGHT}px`,
      borderBottom: "1px solid #eee",
      borderLeft: "1px solid #ddd",
      padding: "6px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    entryBox: (students) => ({
      backgroundColor: "#f1f5f9",
      border: `2px solid ${students === 0 ? "#f56565" : "#dbeafe"}`,
      borderRadius: "6px",
      padding: "6px",
      fontSize: "13px",
      boxShadow: "0px 1px 2px rgba(0,0,0,0.06)",
    }),
  };

  // Group entries by day_of_week index
  const byDay = {};
  for (let i = 0; i < 7; i++) byDay[i] = [];
  entries.forEach((e) => {
    const d = Number.isFinite(Number(e.day_of_week)) ? Number(e.day_of_week) : null;
    if (d !== null && d >= 0 && d < 7) byDay[d].push(e);
  });

  const tutorDisplay = (entry) => entry.tutor_name || "Unknown Tutor";

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Global Timetable</h2>
      <div style={styles.sub}>
        Showing all tutors' scheduled sessions — click a tutor in the admin to edit individual timetables.
      </div>

      {loading && <p>Loading timetable...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.gridWrapper}>
        {/* header row (days) */}
        <div style={styles.grid}>
          <div></div>
          {DAYS.map((d) => (
            <div key={d} style={styles.dayHeader}>{d}</div>
          ))}
        </div>

        {/* hour rows */}
        {HOURS.map((hour) => (
          <div key={hour} style={styles.grid}>
            <div style={styles.timeCell}>{hour}:00</div>
            {DAYS.map((_, dayIdx) => (
              <div key={dayIdx} style={styles.dayCell}>
                {byDay[dayIdx]
                  .filter((entry) => {
                    if (!entry.start_time) return false;
                    const entryHour = parseInt(String(entry.start_time).split(":")[0], 10);
                    return entryHour === hour;
                  })
                  .map((entry) => (
                    <div key={entry.id} style={styles.entryBox(entry.active_student_count ?? 0)}>
                      {/* Single line: course - tutor_name */}
                      {entry.subject || "Untitled"} - {tutorDisplay(entry)}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalTimetable;
