import React, { useEffect, useState } from "react";
import API from "../api/api";

const AttendanceByStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    class_instance_id: "",
    attendance_status: "Present",
    date: "", // Optional
  });

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendances, setLoadingAttendances] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await API.get("students/");
        setStudents(res.data);
      } catch (err) {
        setError("Failed to fetch students");
      }
      setLoadingStudents(false);
    };

    fetchStudents();
  }, []);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("classes/");
        const data = res.data.results || res.data;
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes");
      }
    };

    fetchClasses();
  }, []);

  // Fetch attendances for selected student
  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchAttendances = async () => {
      setLoadingAttendances(true);
      try {
        const res = await API.get(`attendances/?student_id=${selectedStudentId}`);
        setAttendances(res.data.results || []);
      } catch (err) {
        setError("Failed to fetch attendances");
      }
      setLoadingAttendances(false);
    };

    fetchAttendances();
  }, [selectedStudentId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return alert("Please select a student");

    try {
      await API.post("attendances/", {
        ...formData,
        student_id: selectedStudentId,
      });

      // Reset form
      setFormData({
        class_instance_id: "",
        attendance_status: "Present",
        date: "",
      });

      // Refresh attendances
      const res = await API.get(`attendances/?student_id=${selectedStudentId}`);
      setAttendances(res.data.results || []);
    } catch (err) {
      console.error("Failed to add attendance:", err);
      alert('Attendance has been added ✅')
    }
  };

  return (
    <div style={styles.container}>
      {/* Students list */}
      <div style={styles.studentsList}>
        <h3 style={styles.heading}>Students</h3>
        {loadingStudents ? (
          <p style={styles.loadingText}>Loading students...</p>
        ) : (
          <ul style={styles.list}>
            {students.map((student) => (
              <li
                key={student.id}
                style={{
                  ...styles.listItem,
                  fontWeight: selectedStudentId === student.id ? "700" : "400",
                  backgroundColor:
                    selectedStudentId === student.id ? "#e0f7fa" : "transparent",
                }}
                onClick={() => setSelectedStudentId(student.id)}
              >
                {student.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Attendance records and form */}
      <div style={styles.attendanceSection}>
        <h3 style={styles.heading}>Attendances</h3>
        {loadingAttendances ? (
          <p style={styles.loadingText}>Loading attendances...</p>
        ) : attendances.length === 0 ? (
          <p style={styles.noDataText}>No attendance records found.</p>
        ) : (
          <ul style={styles.list}>
            {attendances.map((att) => (
              <li key={att.id} style={styles.attendanceItem}>
                <strong>Date:</strong> {att.date} | <strong>Status:</strong>{" "}
                {att.attendance_status} | <strong>Course:</strong>{" "}
                {att.class_instance?.course?.name || "N/A"}
              </li>
            ))}
          </ul>
        )}

        {/* Add attendance form */}
        {selectedStudentId && (
          <form onSubmit={handleAddAttendance} style={styles.form}>
            <h4 style={styles.formHeading}>Add Attendance</h4>

            <label style={styles.label}>
              Class:
              <select
                name="class_instance_id"
                value={formData.class_instance_id}
                onChange={handleFormChange}
                required
                style={styles.select}
              >
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.course.name} - {cls.date || "No Date"}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Status:
              <select
                name="attendance_status"
                value={formData.attendance_status}
                onChange={handleFormChange}
                style={styles.select}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </label>

            <label style={styles.label}>
              Date (optional):
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                style={styles.input}
              />
            </label>

            <button type="submit" style={styles.button}>
              Add Attendance
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "2rem",
    padding: "1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "80vh",
  },
  studentsList: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    overflowY: "auto",
    maxHeight: "75vh",
  },
  attendanceSection: {
    flex: 2,
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    overflowY: "auto",
    maxHeight: "75vh",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    marginBottom: "1rem",
    color: "#00796b",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "0.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  attendanceItem: {
    padding: "0.5rem",
    borderBottom: "1px solid #eee",
  },
  loadingText: {
    fontStyle: "italic",
    color: "#999",
  },
  noDataText: {
    fontStyle: "italic",
    color: "#999",
  },
  form: {
    marginTop: "2rem",
    borderTop: "1px solid #ddd",
    paddingTop: "1rem",
  },
  formHeading: {
    marginBottom: "1rem",
    color: "#004d40",
  },
  label: {
    display: "block",
    marginBottom: "1rem",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "0.25rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "0.25rem",
  },
  button: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#00796b",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default AttendanceByStudent;
