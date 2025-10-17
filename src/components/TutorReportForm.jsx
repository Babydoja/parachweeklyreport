import React, { useEffect, useState } from "react";
import API from "../api/api";

const TutorReportForm = ({ tutorId, onReportCreated }) => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [course, setCourse] = useState("");
  const [student, setStudent] = useState("");
  const [manualTopic, setManualTopic] = useState("");
  const [week, setWeek] = useState(1);
  const [modeOfLearning, setModeOfLearning] = useState("physical");
  const [attendance, setAttendance] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all courses & students once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          API.get("/courses/"),
          API.get("/students/"),
        ]);
        setCourses(coursesRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Auto-fetch latest week per tutor-student combination
  useEffect(() => {
    const fetchStudentWeek = async () => {
      if (!tutorId || !student) return;
      try {
        const res = await API.get(`/tutors/${tutorId}/reports/`);
        const studentReports = res.data.filter((r) => r.student === parseInt(student));
        if (studentReports.length > 0) {
          const latest = studentReports[studentReports.length - 1];
          setWeek(latest.week + 1);
        } else {
          setWeek(1);
        }
      } catch (err) {
        console.error("Failed to fetch week for student:", err);
      }
    };
    fetchStudentWeek();
  }, [tutorId, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        course,
        student,
        manual_topic: manualTopic,
        week,
        mode_of_learning: modeOfLearning,
        attendance,
      };

      const res = await API.post(`/tutors/${tutorId}/reports/`, payload);
      setSuccess("Report created successfully!");

      // Reset some fields
      setCourse("");
      setStudent("");
      setManualTopic("");
      setModeOfLearning("physical");
      setAttendance(0);

      // Increment next week number automatically
      setWeek((prev) => prev + 1);

      if (onReportCreated) onReportCreated(res.data);
    } catch (err) {
      console.error("Report creation failed:", err.response?.data || err.message);
      setError("Failed to create report. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
      <h3 className="text-xl font-semibold text-blue-700 mb-6 text-center">
        Create New Tutor Report
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Student */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student
          </label>
          <select
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || `${s.first_name || ""} ${s.last_name || ""}` || s.username}
              </option>
            ))}
          </select>
        </div>

        {/* Manual Topic Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic (manual entry)
          </label>
          <input
            type="text"
            value={manualTopic}
            onChange={(e) => setManualTopic(e.target.value)}
            placeholder="Enter topic covered..."
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Week Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Week Number
          </label>
          <input
            type="number"
            value={week}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Mode of Learning */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mode of Learning
          </label>
          <select
            value={modeOfLearning}
            onChange={(e) => setModeOfLearning(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="physical">Physical</option>
            <option value="online">Online</option>
          </select>
        </div>

        {/* Attendance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attendance
          </label>
          <input
            type="number"
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>

        {/* Feedback messages */}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default TutorReportForm;
