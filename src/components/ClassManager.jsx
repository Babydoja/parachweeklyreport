import React, { useEffect, useState } from "react";
import API from "../api/api";

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState(null);
  const [tutors, setTutors] = useState(null);
  const [topics, setTopics] = useState(null);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState(null);

  const [newClass, setNewClass] = useState({
    course_name: "",
    tutor_name: "",
    topic_name: "",
    date: "",
  });

  const [filterDate, setFilterDate] = useState("");
  const [filterTutor, setFilterTutor] = useState("");

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const res = await API.get("classes/");
      const data = res.data;
      const classList = Array.isArray(data) ? data : data.results || [];
      setClasses(classList);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch classes:", err.response?.data || err.message);
      setError("Failed to fetch class list");
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [coursesRes, tutorsRes, topicsRes] = await Promise.all([
        API.get("courses/"),
        API.get("tutors/"),
        API.get("topics/"),
      ]);

      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.results || []);
      setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : tutorsRes.data.results || []);
      setTopics(Array.isArray(topicsRes.data) ? topicsRes.data : topicsRes.data.results || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dropdown options:", err.response?.data || err.message);
      setError("Failed to load dropdown options");
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("classes/", newClass);
      console.log("Class created:", response.data);
      fetchClasses();
      setNewClass({ course_name: "", tutor_name: "", topic_name: "", date: "" });
    } catch (err) {
      console.error("Error creating class:", err.response?.data || err.message);
      alert("Error creating class. Check console for details.");
    }
  };

  if (loadingOptions) {
    return <p style={{ textAlign: "center" }}>Loading options...</p>;
  }
  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }
  if (!courses || !tutors || !topics) {
    return <p style={{ textAlign: "center" }}>One or more options failed to load.</p>;
  }

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#333",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    select: {
      width: "100%",
      padding: "8px",
      fontSize: "16px",
    },
    input: {
      width: "100%",
      padding: "8px",
      fontSize: "16px",
    },
    button: {
      marginTop: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    list: {
      listStyle: "none",
      padding: 0,
    },
    listItem: {
      marginBottom: "10px",
      backgroundColor: "#fff",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    hr: {
      margin: "30px 0",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Class Manager</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Course:</label>
          <select
            name="course_name"
            value={newClass.course_name}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tutor:</label>
          <select
            name="tutor_name"
            value={newClass.tutor_name}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select a tutor</option>
            {tutors.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Topic:</label>
          <select
            name="topic_name"
            value={newClass.topic_name}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select a topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Date:</label>
          <input
            type="date"
            name="date"
            value={newClass.date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Create Class</button>
      </form>

      <hr style={styles.hr} />

      <h3 style={styles.heading}>Filter Classes</h3>
      <div style={{ ...styles.formGroup, display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 45%" }}>
          <label style={styles.label}>Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={styles.input}
          />
        </div> <br /> <br />

        <div style={{ flex: "1 1 45%" }}>
          <label style={styles.label}>Filter by Tutor:</label>
          <select
            value={filterTutor}
            onChange={(e) => setFilterTutor(e.target.value)}
            style={styles.select}
          >
            <option value="">All Tutors</option>
            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.name}>
                {tutor.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr style={styles.hr} />

      <h3 style={styles.heading}>Class List</h3>
      {loadingClasses ? (
        <p>Loading classes...</p>
      ) : (
        <ul style={styles.list}>
          {classes
            .filter((cls) => {
              const matchesDate = !filterDate || cls.date === filterDate;
              const matchesTutor = !filterTutor || cls.tutor?.name === filterTutor;
              return matchesDate && matchesTutor;
            })
            .map((cls) => (
              <li key={cls.id} style={styles.listItem}>
                <strong>{cls.topic?.title || "Untitled Topic"}</strong> — {cls.course?.name} —{" "}
                {cls.tutor?.name} on {cls.date}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default ClassManager;
