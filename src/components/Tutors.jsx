import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    active: true,
  });
  const [editingTutorId, setEditingTutorId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    active: true,
  });

  const fetchTutors = async () => {
    try {
      const res = await API.get("tutors/");
      setTutors(res.data);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  // Handle input changes for add form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle input changes for edit form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add new tutor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("tutors/", formData);
      setFormData({ name: "", email: "", specialization: "", active: true });
      toast.success('Tutor Added Successfully')
      fetchTutors();
    } catch (err) {
      console.error("Failed to add tutor", err.response?.data || err.message);
      toast.error("Failed to add tutor", err.response?.data || err.message);
    }
    setLoading(false);
  };

  // Start editing a tutor
  const startEditing = (tutor) => {
    setEditingTutorId(tutor.id);
    setEditFormData({
      name: tutor.name,
      email: tutor.email,
      specialization: tutor.specialization || "",
      active: tutor.active,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTutorId(null);
    setEditFormData({ name: "", email: "", specialization: "", active: true });
  };

  // Save edited tutor
  const saveEdit = async (id) => {
    setLoading(true);
    try {
      await API.patch(`tutors/${id}/`, editFormData);
      setEditingTutorId(null);
      fetchTutors();
    } catch (err) {
      console.error("Failed to update tutor", err.response?.data || err.message);
    }
    setLoading(false);
  };

  // Delete tutor
  const deleteTutor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tutor?")) return;
    try {
      await API.delete(`tutors/${id}/`);
      fetchTutors();
    } catch (err) {
      console.error("Failed to delete tutor", err);
    }
  };

  // Toggle active status (works for both list and edit form)
  const toggleActive = async (tutor) => {
    const updatedStatus = !tutor.active;
    try {
      await API.patch(`tutors/${tutor.id}/`, { active: updatedStatus });
      setTutors((prev) =>
        prev.map((t) => (t.id === tutor.id ? { ...t, active: updatedStatus } : t))
      );
    } catch (err) {
      console.error("Failed to toggle tutor status", err);
    }
  };

  const containerStyle = {
    maxWidth: 700,
    margin: "2rem auto",
    padding: "1rem 2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#333",
  };

  const formStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: 6,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    margin: "8px 0",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "inline-block",
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "600",
    color: "#555",
  };

  const checkboxLabelStyle = {
    fontWeight: "500",
    color: "#555",
    cursor: "pointer",
  };

  const buttonStyle = {
    padding: "8px 16px",
    marginTop: "1rem",
    marginRight: "0.5rem",
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: 4,
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: 16,
    transition: "background-color 0.3s",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.6,
    cursor: "not-allowed",
  };

  const listItemStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: 6,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
  };

  const tutorInfoStyle = {
    marginBottom: 8,
    fontSize: 18,
    color: "#222",
  };

  const statusStyle = (active) => ({
    color: active ? "green" : "red",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
  });

  const buttonGroupStyle = {
    marginTop: 8,
  };

  // JSX return with styles applied:

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Tutors</h2>

      {/* Add Tutor Form */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3>Add New Tutor</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          style={inputStyle}
        />
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            style={{ marginRight: 6 }}
          />
          Active
        </label>
        <br />
        <button
          type="submit"
          disabled={loading}
          style={loading ? disabledButtonStyle : buttonStyle}
        >
          {loading ? "Adding..." : "Add Tutor"}
        </button>
      </form>

      {/* Tutor List */}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {tutors.length === 0 && <li>No tutors found.</li>}
        {tutors.map((tutor) => (
          <li key={tutor.id} style={listItemStyle}>
            {editingTutorId === tutor.id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  name="specialization"
                  value={editFormData.specialization}
                  onChange={handleEditChange}
                  style={inputStyle}
                />
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={editFormData.active}
                    onChange={handleEditChange}
                    style={{ marginRight: 6 }}
                  />
                  Active
                </label>
                <div style={buttonGroupStyle}>
                  <button
                    onClick={() => saveEdit(tutor.id)}
                    disabled={loading}
                    style={loading ? disabledButtonStyle : buttonStyle}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={loading}
                    style={cancelButtonStyle}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={tutorInfoStyle}>
                  <strong>{tutor.name}</strong> ({tutor.email}) –{" "}
                  {tutor.specialization || "No specialization"} –{" "}
                  <span
                    style={statusStyle(tutor.active)}
                    onClick={() => toggleActive(tutor)}
                    title="Click to toggle status"
                  >
                    {tutor.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={buttonGroupStyle}>
                  <button
                    onClick={() => startEditing(tutor)}
                    style={{ ...buttonStyle, backgroundColor: "#2196f3" }}
                  >
                    Edit
                  </button>{" "}
                  <button
                    onClick={() => deleteTutor(tutor.id)}
                    style={cancelButtonStyle}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tutors;