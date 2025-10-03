import React, { useEffect, useState } from "react";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;

const AttendanceByStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [classes, setClasses] = useState([]);
  const [view, setView] = useState("students"); // "students" or "attendance"

  const [formData, setFormData] = useState({
    class_instance_id: "",
    attendance_status: "Present",
    date: "",
  });

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendances, setLoadingAttendances] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Toast helper
  const notify = (msg, type = "success") => {
    toast[type](msg, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await API.get("students/");
        setStudents(res.data);
      } catch (err) {
        notify("Failed to fetch students", "error");
      }
      setLoadingStudents(false);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("classes/");
        const data = res.data.results || res.data;
        setClasses(data);
      } catch (err) {
        notify("Failed to fetch classes", "error");
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchAttendances = async () => {
      setLoadingAttendances(true);
      try {
        const res = await API.get(`attendances/?student_id=${selectedStudentId}`);
        setAttendances(res.data.results || []);
      } catch (err) {
        notify("Failed to fetch attendances", "error");
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
    if (!selectedStudentId) return notify("Please select a student", "warning");

    try {
      await API.post("attendances/", {
        ...formData,
        student_id: selectedStudentId,
      });

      setFormData({
        class_instance_id: "",
        attendance_status: "Present",
        date: "",
      });

      const res = await API.get(`attendances/?student_id=${selectedStudentId}`);
      setAttendances(res.data.results || []);
      notify("Attendance added ✅");
    } catch (err) {
      console.error("Failed to add attendance:", err);
      notify("Failed to add attendance", "error");
    }
  };

  // Pagination helpers
  const paginatedStudents = students.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedAttendances = attendances.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer />

      {/* Toggle View (for mobile) */}
      <div className="md:hidden flex justify-center gap-4 mb-4">
        <button
          onClick={() => setView("students")}
          className={`px-4 py-2 rounded ${view === "students" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Students
        </button>
        <button
          onClick={() => setView("attendance")}
          className={`px-4 py-2 rounded ${view === "attendance" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Attendance
        </button>
      </div>

      <div className="md:flex gap-6">
        {/* Students List */}
        {(view === "students" || window.innerWidth >= 768) && (
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Students</h3>

            {loadingStudents ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <ul className="space-y-2">
                  {paginatedStudents.map((student) => (
                    <li
                      key={student.id}
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setView("attendance");
                      }}
                      className={`cursor-pointer px-3 py-2 rounded-md transition-all ${
                        selectedStudentId === student.id
                          ? "bg-blue-100 font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {student.name}
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                {totalPages(students) > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages(students) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-full ${
                          currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Attendance Section */}
        {(view === "attendance" || window.innerWidth >= 768) && (
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Attendances</h3>

            {loadingAttendances ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : attendances.length === 0 ? (
              <p className="text-gray-500 italic">No attendance records found.</p>
            ) : (
              <>
                <ul className="space-y-2 mb-6 text-sm">
                  {paginatedAttendances.map((att) => (
                    <li key={att.id} className="border-b pb-2 text-gray-700">
                      <strong>Date:</strong> {att.date} | <strong>Status:</strong>{" "}
                      {att.attendance_status} | <strong>Course:</strong>{" "}
                      {att.class_instance?.course?.name || "N/A"}
                    </li>
                  ))}
                </ul>

                {/* Pagination for attendance */}
                {totalPages(attendances) > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages(attendances) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-full ${
                          currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

        
            {selectedStudentId && (
              <form onSubmit={handleAddAttendance} className="border-t pt-4 space-y-4">
                <h4 className="text-lg font-semibold text-blue-800">Add Attendance</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    name="class_instance_id"
                    value={formData.class_instance_id}
                    onChange={handleFormChange}
                    required
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.course.name} — {cls.date || "No Date"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="attendance_status"
                    value={formData.attendance_status}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date (optional)</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Attendance
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceByStudent;
