import React, { useEffect, useState } from "react";
import API from "../api/api";

const TutorTimetableManager = () => {
  const [entries, setEntries] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [entryForm, setEntryForm] = useState({
    tutor_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    subject: "",
  });

  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const HOURS = Array.from({ length: 14 }, (_, i) => 9 + i); // 9:00–22:00
  const HOUR_HEIGHT = 150;

  // Fetch tutors
  const fetchTutors = async () => {
    try {
      const res = await API.get("tutors/");
      setTutors(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch tutors:", err.response?.data || err.message);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err.response?.data || err.message);
    }
  };

  // Fetch timetable for selected tutor
  const fetchTutorEntries = async (tutorId) => {
    if (!tutorId) return;
    setLoading(true);
    try {
      const res = await API.get(`timetable/tutor/${tutorId}/`);
      setEntries(Array.isArray(res.data) ? res.data : res.data.results || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch timetable:", err.response?.data || err.message);
      setError("Failed to fetch timetable entries");
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

    const payload = {
      ...entryForm,
      tutor_id: selectedTutor.id,
    };

    try {
      if (editingId) {
        await API.put(`timetable/entries/${editingId}/`, payload);
        setEditingId(null);
      } else {
        await API.post("timetable/entries/create/", payload);
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
    tutorList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px",
    },
    tutorButton: {
      padding: "10px 15px",
      backgroundColor: "#eee",
      border: "1px solid #ccc",
      borderRadius: "5px",
      cursor: "pointer",
    },
    activeTutor: {
      backgroundColor: "#4CAF50",
      color: "white",
      borderColor: "#4CAF50",
    },
    heading: { textAlign: "center", marginBottom: "20px" },
    formGroup: { marginBottom: "15px" },
    label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
    input: { width: "100%", padding: "8px" },
    select: { width: "100%", padding: "8px" },
    button: {
      marginRight: "10px",
      padding: "10px 20px",
      fontSize: "14px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    cancelButton: {
      padding: "10px 20px",
      fontSize: "14px",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    gridWrapper: { overflowX: "auto", marginTop: "30px" },
    grid: { display: "grid", gridTemplateColumns: "100px repeat(7, 1fr)" },
    timeCell: {
      height: `${HOUR_HEIGHT}px`,
      borderBottom: "1px solid #eee",
      fontSize: "12px",
      color: "gray",
      padding: "4px",
    },
    dayCell: {
      height: `${HOUR_HEIGHT}px`,
      borderBottom: "1px solid #eee",
      borderLeft: "1px solid #ddd",
      position: "relative",
      padding: "4px",
    },
    entryBox: {
      backgroundColor: "#90cdf4",
      borderRadius: "6px",
      padding: "6px",
      fontSize: "12px",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
      marginBottom: "4px",
    },
    entryActions: { marginTop: "5px", display: "flex", gap: "5px" },
    smallButton: {
      fontSize: "11px",
      padding: "3px 6px",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
    },
  };

  const byDay = {};
  for (let i = 0; i < 7; i++) byDay[i] = [];
  entries.forEach((e) => byDay[e.day_of_week]?.push(e));

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tutor Timetable Manager</h2>

      {/* Tutor selection */}
      <div style={styles.tutorList}>
        {tutors.map((tutor) => (
          <button
            key={tutor.id}
            style={{
              ...styles.tutorButton,
              ...(selectedTutor?.id === tutor.id ? styles.activeTutor : {}),
            }}
            onClick={() => handleTutorSelect(tutor)}
          >
            {tutor.name}
          </button>
        ))}
      </div>

      {selectedTutor && (
        <>
          <h3>{selectedTutor.name}'s Timetable</h3>

          {/* Add/Edit Form */}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Day of Week:</label>
              <select
                name="day_of_week"
                value={entryForm.day_of_week}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select a day</option>
                {DAYS.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Start Time:</label>
              <input
                type="time"
                name="start_time"
                value={entryForm.start_time}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Time:</label>
              <input
                type="time"
                name="end_time"
                value={entryForm.end_time}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Subject:</label>
              <select
                name="subject"
                value={entryForm.subject}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.description}>
                    {course.description}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" style={styles.button}>
              {editingId ? "Update Entry" : "Add Entry"}
            </button>
            {editingId && (
              <button
                type="button"
                style={styles.cancelButton}
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
              >
                Cancel
              </button>
            )}
          </form>

          {/* Timetable Grid */}
          <div style={styles.gridWrapper}>
            {/* Header */}
            <div style={styles.grid}>
              <div></div>
              {DAYS.map((d) => (
                <div key={d} style={{ textAlign: "center", fontWeight: "bold" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Rows */}
            {HOURS.map((hour) => (
              <div key={hour} style={styles.grid}>
                <div style={styles.timeCell}>{hour}:00</div>
                {DAYS.map((day, dayIdx) => (
                  <div key={dayIdx} style={styles.dayCell}>
                    {byDay[dayIdx]
                      .filter(
                        (entry) =>
                          parseInt(entry.start_time.split(":")[0], 10) === hour
                      )
                      .map((entry) => (
                        <div key={entry.id} style={styles.entryBox}>
                          <div style={{ fontWeight: "bold" }}>{entry.subject}</div>
                          <div>
                            {entry.start_time} - {entry.end_time}
                          </div>
                          <div style={styles.entryActions}>
                            <button
                              style={{
                                ...styles.smallButton,
                                backgroundColor: "#2196F3",
                                color: "white",
                              }}
                              onClick={() => handleEdit(entry)}
                            >
                              Edit
                            </button>
                            <button
                              style={{
                                ...styles.smallButton,
                                backgroundColor: "#f44336",
                                color: "white",
                              }}
                              onClick={() => handleDelete(entry.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TutorTimetableManager;
