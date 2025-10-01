import React, { useEffect, useState } from "react";
import API from "../api/api";
import TutorReportForm from "./TutorReportForm";

const TutorReports = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maps for ID -> Name
  const [tutorMap, setTutorMap] = useState({});
  const [courseMap, setCourseMap] = useState({});
  const [studentMap, setStudentMap] = useState({});
  const [topicMap, setTopicMap] = useState({});

  // --- Fetch all mapping data ---
  const fetchData = async () => {
    try {
      const [tutorsRes, coursesRes, studentsRes, topicsRes] = await Promise.all([
        API.get("/tutors/"),
        API.get("/courses/"),
        API.get("/students/"),
        API.get("/topics/"),
      ]);

      setTutors(tutorsRes.data);
      setTutorMap(tutorsRes.data.reduce((acc, t) => ({ ...acc, [t.id]: t.name }), {}));
      setCourseMap(coursesRes.data.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {}));
      setStudentMap(
        studentsRes.data.reduce(
          (acc, s) => ({ ...acc, [s.id]: s.name || `${s.first_name} ${s.last_name}` || s.username }),
          {}
        )
      );
      setTopicMap(topicsRes.data.reduce((acc, t) => ({ ...acc, [t.id]: t.title }), {}));
    } catch (err) {
      setError("Failed to fetch reference data.");
      console.error(err);
    }
  };

  // --- Fetch reports ---
  const fetchReports = async (tutorId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/tutors/${tutorId}/reports/`);
      setReports(res.data);
    } catch (err) {
      setReports([]);
      setError("Failed to fetch tutor reports.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleDeleteReport = async (reportId) => {
    const confirm = window.confirm("Are you sure you want to delete this report?");
    if (!confirm) return;

    try {
      await API.delete(`/tutors/${selectedTutorId}/reports/${reportId}/`);
      await fetchReports(selectedTutorId);
    } catch (err) {
      alert("Failed to delete report.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTutorId) fetchReports(selectedTutorId);
  }, [selectedTutorId]);

  // --- Styles ---
  const tableStyle = { borderCollapse: "collapse", width: "100%", marginTop: "1rem" };
  const thTdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "left" };
  const buttonStyle = { padding: "0.4rem 0.8rem", marginRight: "0.5rem", borderRadius: "4px", border: "none", cursor: "pointer" };
  const dangerButtonStyle = { ...buttonStyle, backgroundColor: "#dc3545", color: "white" };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Tutor Reports</h2>

      {/* Tutor selection */}
      <div>
        <label>Select Tutor: </label>
        <select value={selectedTutorId || ""} onChange={(e) => setSelectedTutorId(e.target.value)}>
          <option value="">-- Select Tutor --</option>
          {tutors.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading …</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Reports table */}
      {reports.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>Course</th>
              <th style={thTdStyle}>Student</th>
              <th style={thTdStyle}>Topic</th>
              <th style={thTdStyle}>Mode</th>
              <th style={thTdStyle}>Attendance</th>
              <th style={thTdStyle}>Date</th>
              <th style={thTdStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td style={thTdStyle}>{courseMap[report.course]}</td>
                <td style={thTdStyle}>{studentMap[report.student]}</td>
                <td style={thTdStyle}>{topicMap[report.topic]}</td>
                <td style={thTdStyle}>{report.mode_of_learning}</td>
                <td style={thTdStyle}>{report.attendance}</td>
                <td style={thTdStyle}>{report.created_at}</td>
                <td style={thTdStyle}>
                  <button onClick={() => handleDeleteReport(report.id)} style={dangerButtonStyle}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create new report */}
      {selectedTutorId && (
        <TutorReportForm
          tutorId={selectedTutorId}
          onReportCreated={() => fetchReports(selectedTutorId)}
        />
      )}
    </div>
  );
};

export default TutorReports;
