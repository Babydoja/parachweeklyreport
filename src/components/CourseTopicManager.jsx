import React, { useEffect, useState } from "react";
import API from "../api/api";

const ITEMS_PER_PAGE = 8;

const CourseTopicManager = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [error, setError] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // pagination states
  const [coursePage, setCoursePage] = useState(1);
  const [topicPage, setTopicPage] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      setError(null);
      try {
        const res = await API.get("courses/");
        setCourses(res.data.results || res.data);
      } catch {
        setError("Failed to fetch courses");
      }
      setLoadingCourses(false);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setTopics([]);
      return;
    }

    const fetchTopics = async () => {
      setLoadingTopics(true);
      setError(null);
      try {
        const res = await API.get(`topics/${selectedCourseId}/`);
        setTopics(res.data.results || res.data);
      } catch {
        setError("Failed to fetch topics");
      }
      setLoadingTopics(false);
    };

    fetchTopics();
  }, [selectedCourseId]);

  const handleAddTopic = async () => {
    if (!newTitle.trim()) return;
    setError(null);
    try {
      const res = await API.post(`topics/${selectedCourseId}/`, { title: newTitle });
      setTopics((prev) => [...prev, res.data]);
      setNewTitle("");
    } catch {
      setError("Failed to add topic");
    }
  };

  const startEditing = (topic) => {
    setEditingTopicId(topic.id);
    setEditingTitle(topic.title);
  };

  const cancelEditing = () => {
    setEditingTopicId(null);
    setEditingTitle("");
  };

  const saveEditing = async () => {
    if (!editingTitle.trim()) return;
    setError(null);
    try {
      const res = await API.patch(`topic/${editingTopicId}/`, { title: editingTitle });
      setTopics((prev) =>
        prev.map((topic) => (topic.id === editingTopicId ? res.data : topic))
      );
      cancelEditing();
    } catch {
      setError("Failed to update topic");
    }
  };

  const deleteTopic = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    setError(null);
    try {
      await API.delete(`topic/${id}/`);
      setTopics((prev) => prev.filter((topic) => topic.id !== id));
    } catch {
      setError("Failed to delete topic");
    }
  };

  // pagination helpers
  const paginate = (data, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  const styles = {
    container: {
      display: "flex",
      gap: "2rem",
      maxWidth: "900px",
      margin: "2rem auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#2c3e50",
    },
    sidebar: {
      flex: 1,
      backgroundColor: "#f5f7fa",
      borderRadius: "8px",
      padding: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      height: "fit-content",
    },
    mainContent: {
      flex: 2,
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "1rem 1.5rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    },
    header: {
      marginBottom: "1rem",
      borderBottom: "2px solid #3498db",
      paddingBottom: "0.3rem",
      fontWeight: "700",
      fontSize: "1.5rem",
    },
    courseItem: (isSelected) => ({
      cursor: "pointer",
      fontWeight: isSelected ? "700" : "400",
      padding: "0.5rem 0.75rem",
      borderRadius: "4px",
      backgroundColor: isSelected ? "#3498db" : "transparent",
      color: isSelected ? "#fff" : "#2c3e50",
      transition: "background-color 0.3s ease, color 0.3s ease",
      userSelect: "none",
      marginBottom: "0.3rem",
    }),
    topicList: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
      maxHeight: "320px",
      overflowY: "auto",
      marginBottom: "1rem",
    },
    topicItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem 0",
      borderBottom: "1px solid #e1e4e8",
    },
    topicTitle: {
      flex: 1,
      fontSize: "1rem",
      color: "#34495e",
      wordBreak: "break-word",
    },
    input: {
      flex: 1,
      padding: "0.4rem 0.6rem",
      fontSize: "1rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginRight: "0.5rem",
    },
    button: {
      padding: "0.35rem 0.8rem",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      marginLeft: "0.3rem",
      transition: "background-color 0.3s ease",
      fontSize: "0.9rem",
    },
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "1rem",
    },
    pageButton: (isActive) => ({
      padding: "0.35rem 0.8rem",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      backgroundColor: isActive ? "#3498db" : "#ecf0f1",
      color: isActive ? "#fff" : "#2c3e50",
      fontWeight: "600",
    }),
    editButton: { backgroundColor: "#3498db", color: "#fff" },
    saveButton: { backgroundColor: "#2ecc71", color: "#fff" },
    cancelButton: { backgroundColor: "#95a5a6", color: "#fff" },
    deleteButton: { backgroundColor: "#e74c3c", color: "#fff" },
    addTopicContainer: {
      display: "flex",
      alignItems: "center",
      marginTop: "0.5rem",
    },
    errorMessage: {
      color: "red",
      marginBottom: "1rem",
      fontWeight: "600",
    },
    placeholderText: {
      color: "#7f8c8d",
      fontStyle: "italic",
    },
  };

  const selectedCourse = (courses || []).find(
    (c) => String(c.id) === String(selectedCourseId)
  );

  const paginatedCourses = paginate(courses, coursePage);
  const paginatedTopics = paginate(topics, topicPage);

  return (
    <div style={styles.container}>
      {/* Courses list */}
      <div style={styles.sidebar}>
        <h2 style={styles.header}>Courses</h2>
        {loadingCourses ? (
          <p style={styles.placeholderText}>Loading courses...</p>
        ) : (
          <>
            <ul style={{ paddingLeft: 0, margin: 0 }}>
              {paginatedCourses.map((course) => (
                <li
                  key={course.id}
                  style={styles.courseItem(selectedCourseId === course.id)}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setTopicPage(1);
                  }}
                >
                  {course.name}
                </li>
              ))}
            </ul>

            {totalPages(courses) > 1 && (
              <div style={styles.paginationContainer}>
                {Array.from({ length: totalPages(courses) }).map((_, i) => (
                  <button
                    key={i}
                    style={styles.pageButton(coursePage === i + 1)}
                    onClick={() => setCoursePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Topics list */}
      <div style={styles.mainContent}>
        <h2 style={styles.header}>
          Topics {selectedCourse ? `for ${selectedCourse.name}` : ""}
        </h2>

        {loadingTopics ? (
          <p style={styles.placeholderText}>Loading topics...</p>
        ) : selectedCourseId ? (
          <>
            {error && <p style={styles.errorMessage}>{error}</p>}
            {topics.length === 0 && (
              <p style={styles.placeholderText}>No topics found.</p>
            )}

            <ul style={styles.topicList}>
              {paginatedTopics.map((topic) => (
                <li key={topic.id} style={styles.topicItem}>
                  {editingTopicId === topic.id ? (
                    <>
                      <input
                        style={styles.input}
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={saveEditing}
                        style={{ ...styles.button, ...styles.saveButton }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        style={{ ...styles.button, ...styles.cancelButton }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={styles.topicTitle}>{topic.title}</span>
                      <div>
                        <button
                          onClick={() => startEditing(topic)}
                          style={{ ...styles.button, ...styles.editButton }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          style={{ ...styles.button, ...styles.deleteButton }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* Pagination for topics */}
            {totalPages(topics) > 1 && (
              <div style={styles.paginationContainer}>
                {Array.from({ length: totalPages(topics) }).map((_, i) => (
                  <button
                    key={i}
                    style={styles.pageButton(topicPage === i + 1)}
                    onClick={() => setTopicPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Add topic input */}
            <div style={styles.addTopicContainer}>
              <input
                placeholder="New topic title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ ...styles.input, marginRight: "0.5rem" }}
              />
              <button
                onClick={handleAddTopic}
                style={{ ...styles.button, ...styles.editButton }}
              >
                Add Topic
              </button>
            </div>
          </>
        ) : (
          <p style={styles.placeholderText}>Please select a course to see topics.</p>
        )}
      </div>
    </div>
  );
};

export default CourseTopicManager;
