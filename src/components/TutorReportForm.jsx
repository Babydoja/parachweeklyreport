import React, { useEffect, useState } from "react";
import API from "../api/api";

const TutorReportForm = ({ tutorId, onReportCreated }) => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [topics, setTopics] = useState([]);

  const [course, setCourse] = useState("");
  const [student, setStudent] = useState("");
  const [topic, setTopic] = useState("");
  const [week, setWeek] = useState(1);
  const [modeOfLearning, setModeOfLearning] = useState("physical");
  const [attendance, setAttendance] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes, topicsRes] = await Promise.all([
          API.get("/courses/"),
          API.get("/students/"),
          API.get("/topics/"),
        ]);
        setCourses(coursesRes.data);
        setStudents(studentsRes.data);
        setTopics(topicsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        course,
        student,
        topic,
        week,
        mode_of_learning: modeOfLearning,
        attendance,
      };

      const res = await API.post(`/tutors/${tutorId}/reports/`, payload);
      setSuccess("Report created successfully!");

      setCourse("");
      setStudent("");
      setTopic("");
      setWeek(1);
      setModeOfLearning("physical");
      setAttendance(0);

      if (onReportCreated) onReportCreated(res.data);
    } catch (err) {
      console.error("Report creation failed:", err.response?.data || err.message);
      setError("Failed to create report. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Create New Tutor Report</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Course */}
        <label style={styles.label}>Course:</label>
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          style={styles.select}
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Student */}
        <label style={styles.label}>Student:</label>
        <select
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          required
          style={styles.select}
        >
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name || `${s.first_name || ""} ${s.last_name || ""}` || s.username}
            </option>
          ))}
        </select>

        {/* Topic */}
        <label style={styles.label}>Topic:</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          style={styles.select}
        >
          <option value="">-- Select Topic --</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>



        {/* Mode of learning */}
        <label style={styles.label}>Mode of Learning:</label>
        <select
          value={modeOfLearning}
          onChange={(e) => setModeOfLearning(e.target.value)}
          style={styles.select}
        >
          <option value="physical">Physical</option>
          <option value="online">Online</option>
        </select>

        {/* Attendance */}
        <label style={styles.label}>Attendance:</label>
        <input
          type="number"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          min="0"
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    color: "#00796b",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "500",
    marginBottom: "0.25rem",
    color: "#333",
  },
  select: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: "#00796b",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    marginTop: "0.5rem",
  },
  success: {
    color: "green",
    marginTop: "0.5rem",
  },
};

export default TutorReportForm;
