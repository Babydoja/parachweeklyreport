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
<div className="p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Tutor Reports</h2>

  {/* Tutor selection */}
  <div className="w-full max-w-md">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      Select Tutor:
    </label>
    <div className="relative">
      <select
        value={selectedTutorId || ""}
        onChange={(e) => setSelectedTutorId(e.target.value)}
        className="w-full appearance-none border border-blue-300 bg-white text-gray-800 rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      >
        <option value="">-- Select Tutor --</option>
        {tutors.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>



{/* Loading state */}
{loading && (
  <p className="text-blue-600 text-sm font-medium mb-4 animate-pulse">
    Loading…
  </p>
)}

{/* Error state */}
{error && (
  <p className="text-red-600 text-sm font-medium mb-4">
    {error}
  </p>
)}

{/* Reports table */}
{reports.length > 0 && (
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <thead>
        <tr className="bg-blue-100 text-blue-800 text-sm font-semibold">
          <th className="px-4 py-2 text-left border-b">Course</th>
          <th className="px-4 py-2 text-left border-b">Student</th>
          <th className="px-4 py-2 text-left border-b">Topic</th>
          <th className="px-4 py-2 text-left border-b">Mode</th>
          <th className="px-4 py-2 text-left border-b">Attendance</th>
          <th className="px-4 py-2 text-left border-b">Date</th>
          <th className="px-4 py-2 text-left border-b">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-700">
        {reports.map((report) => (
          <tr key={report.id} className="hover:bg-gray-50 transition">
            <td className="px-4 py-2 border-b">{courseMap[report.course]}</td>
            <td className="px-4 py-2 border-b">{studentMap[report.student]}</td>
            <td className="px-4 py-2 border-b">{topicMap[report.topic]}</td>
            <td className="px-4 py-2 border-b">{report.mode_of_learning}</td>
            <td className="px-4 py-2 border-b">{report.attendance}</td>
            <td className="px-4 py-2 border-b">{report.created_at}</td>
            <td className="px-4 py-2 border-b">
              <button
                onClick={() => handleDeleteReport(report.id)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs font-medium transition duration-150"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{/* Create new report form */}
{selectedTutorId && (
  <div className="mt-8">
    <TutorReportForm
      tutorId={selectedTutorId}
      onReportCreated={() => fetchReports(selectedTutorId)}
    />
  </div>
)}

    </div>
  );
};

export default TutorReports;
