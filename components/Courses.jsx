import React, { useEffect, useState } from "react";
import API from "../api/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await API.put(`courses/${editingId}/`, formData);
      } else {
        await API.post("courses/", formData);
      }

      setFormData({ name: "", description: "" });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course", err);
    }

    setLoading(false);
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name,
      description: course.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`courses/${id}/`);
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "1.5rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "1.5rem",
    },
    form: {
      marginBottom: "2rem",
      backgroundColor: "#fff",
      padding: "1rem",
      borderRadius: "6px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    },
    formTitle: {
      marginBottom: "1rem",
      color: "#34495e",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      minHeight: "80px",
      padding: "0.5rem",
      marginBottom: "1rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      resize: "vertical",
      boxSizing: "border-box",
    },
    button: {
      padding: "0.6rem 1.2rem",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      color: "#fff",
      backgroundColor: "#3498db",
      transition: "background-color 0.3s ease",
    },
    cancelButton: {
      padding: "0.6rem 1.2rem",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      color: "#fff",
      backgroundColor: "#95a5a6",
      marginLeft: "1rem",
      transition: "background-color 0.3s ease",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    listItem: {
      backgroundColor: "#fff",
      borderRadius: "6px",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    },
    courseName: {
      fontWeight: "700",
      color: "#2c3e50",
      fontSize: "1.1rem",
    },
    courseDescription: {
      color: "#555",
      margin: "0.4rem 0 1rem 0",
    },
    listButton: {
      padding: "0.4rem 1rem",
      fontSize: "0.9rem",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      color: "#fff",
      backgroundColor: "#3498db",
      transition: "background-color 0.3s ease",
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      marginLeft: "0.75rem",
      padding: "0.4rem 1rem",
      fontSize: "0.9rem",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      color: "#fff",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Courses</h2>

      {/* Add/Edit Course Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>{editingId ? "Edit Course" : "Add New Course"}</h3>

        <input
          type="text"
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Saving..." : editingId ? "Update Course" : "Add Course"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Course List */}
      <ul style={styles.list}>
        {courses.length === 0 && <li>No courses found.</li>}
        {courses.map((course) => (
          <li key={course.id} style={styles.listItem}>
            <div style={styles.courseName}>{course.name}</div>
            <div style={styles.courseDescription}>{course.description}</div>
            <button
              onClick={() => handleEdit(course)}
              style={styles.listButton}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(course.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
