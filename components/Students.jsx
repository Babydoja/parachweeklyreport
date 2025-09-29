import React, { useEffect, useState } from "react";
import API from "../api/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    course_ids: [],
    tutor_id: "",
    mode: "",
    week: 1,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchTutors();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("students/");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchTutors = async () => {
    try {
      const res = await API.get("tutors/");
      setTutors(res.data);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course_ids") {
      const selected = Array.from(e.target.selectedOptions, (option) =>
        parseInt(option.value)
      );
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCourseNames = courses
      .filter((course) => formData.course_ids.includes(course.id))
      .map((course) => course.name);

    const payload = {
      name: formData.name,
      course_names: selectedCourseNames,
      tutor: formData.tutor_id || null,
      mode: formData.mode,
      week: formData.week,
    };

    try {
      if (editingId) {
        await API.put(`students/${editingId}/`, payload);
      } else {
        await API.post("students/", payload);
      }

      setFormData({
        name: "",
        course_ids: [],
        tutor_id: "",
        mode: "",
        week: 1,
      });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error("Failed to save student", err.response?.data || err.message);
    }
  };

  const handleEdit = (student) => {
    const selectedCourseIds = courses
      .filter((course) => student.courses.includes(course.name))
      .map((course) => course.id);

    setFormData({
      name: student.name,
      course_ids: selectedCourseIds,
      tutor_id: student.tutor || "",
      mode: student.mode || "",
      week: student.week || 1,
    });

    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`students/${id}/`);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  // Styles
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "2rem auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#2c3e50",
      padding: "1rem",
      backgroundColor: "#fefefe",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    header: {
      fontSize: "2rem",
      marginBottom: "1rem",
      borderBottom: "3px solid #3498db",
      paddingBottom: "0.5rem",
      fontWeight: "700",
      color: "#34495e",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      marginBottom: "2rem",
    },
    input: {
      padding: "0.5rem 0.75rem",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "1.5px solid #ccc",
      transition: "border-color 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#3498db",
      outline: "none",
    },
    label: {
      fontWeight: "600",
      marginBottom: "0.25rem",
      color: "#34495e",
    },
    select: {
      padding: "0.5rem 0.75rem",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "1.5px solid #ccc",
      width: "100%",
      boxSizing: "border-box",
      cursor: "pointer",
    },
    buttonsRow: {
      display: "flex",
      gap: "0.75rem",
      marginTop: "0.5rem",
    },
    button: {
      padding: "0.6rem 1.2rem",
      fontSize: "1rem",
      fontWeight: "600",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    addButton: {
      backgroundColor: "#3498db",
      color: "white",
    },
    cancelButton: {
      backgroundColor: "#95a5a6",
      color: "white",
    },
    studentList: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
    },
    studentItem: {
      backgroundColor: "#f8f9fa",
      marginBottom: "0.7rem",
      padding: "0.8rem 1rem",
      borderRadius: "6px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem",
    },
    studentInfo: {
      fontSize: "1rem",
      color: "#2c3e50",
    },
    studentName: {
      fontWeight: "700",
      fontSize: "1.15rem",
      color: "#2c3e50",
    },
    studentDetails: {
      color: "#7f8c8d",
    },
    actionButtons: {
      marginTop: "0.5rem",
      display: "flex",
      gap: "0.5rem",
    },
    editButton: {
      backgroundColor: "#2ecc71",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "0.3rem 0.7rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "0.3rem 0.7rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    noStudents: {
      fontStyle: "italic",
      color: "#7f8c8d",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{editingId ? "Edit Student" : "Add Student"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Courses:</label>
        <select
          name="course_ids"
          multiple
          value={formData.course_ids}
          onChange={handleChange}
          required
          style={styles.select}
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Tutor:</label>
        <select
          name="tutor_id"
          value={formData.tutor_id}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">-- Select Tutor --</option>
          {tutors.map((tutor) => (
            <option key={tutor.id} value={tutor.id}>
              {tutor.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="mode"
          placeholder="Mode of Learning"
          value={formData.mode}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="week"
          placeholder="Current Week"
          value={formData.week}
          min={1}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={styles.buttonsRow}>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.addButton }}
          >
            {editingId ? "Update Student" : "Add Student"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  course_ids: [],
                  tutor_id: "",
                  mode: "",
                  week: 1,
                });
              }}
              style={{ ...styles.button, ...styles.cancelButton }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ ...styles.header, fontSize: "1.5rem", marginBottom: "1rem" }}>
        Student List
      </h3>
      <ul style={styles.studentList}>
        {students.length === 0 && (
          <li style={styles.noStudents}>No students found.</li>
        )}
        {students.map((student) => (
          <li key={student.id} style={styles.studentItem}>
            <span style={styles.studentName}>{student.name}</span>
            <span style={styles.studentDetails}>
              Courses: {student.courses?.join(", ") || "No courses"}
            </span>
            <span style={styles.studentDetails}>
              Tutor: {student.tutor_name || "No tutor"}
            </span>

            <div style={styles.actionButtons}>
              <button
                onClick={() => handleEdit(student)}
                style={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
