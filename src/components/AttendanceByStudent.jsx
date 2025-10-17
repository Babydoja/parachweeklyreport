import React, { useEffect, useState } from "react";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ITEMS_PER_PAGE = 10;

const AttendanceByStudent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [formData, setFormData] = useState({ attendance_status: "Present", date: "" });
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendances, setLoadingAttendances] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartData, setChartData] = useState([]);

  const COLORS = ["#4ade80", "#f87171"]; // green for present, red for absent

  const notify = (msg, type = "success") =>
    toast[type](msg, { position: "top-right", autoClose: 3000 });

  // Fetch students and classes
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await API.get("students/");
        const data = res.data.results || res.data;
        setStudents(data);
        setFilteredStudents(data);
      } catch {
        notify("Failed to fetch students", "error");
      }
      setLoadingStudents(false);
    };

  const fetchClasses = async () => {
  try {
    let allClasses = [];
    let nextUrl = "classes/";

    while (nextUrl) {
      const res = await API.get(nextUrl);
      const data = res.data.results || res.data;
      allClasses = [...allClasses, ...data];

      // Use the full next URL if available (absolute or relative)
      nextUrl = res.data.next || null;
    }

    // Sort newest-first (by ID)
    allClasses.sort((a, b) => (b.id || 0) - (a.id || 0));

    setClasses(allClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    notify("Failed to fetch classes", "error");
  }
};



    fetchStudents();
    fetchClasses();
  }, []);

  // Fetch attendances for selected student
  useEffect(() => {
    if (!selectedStudentId) return;
    const fetchAttendances = async () => {
      setLoadingAttendances(true);
      try {
        const res = await API.get(`attendances/?student_id=${selectedStudentId}`);
        const data = res.data.results || [];
        setAttendances(data);

        // Calculate chart data dynamically
        const presentCount = data.filter(a => a.attendance_status === "Present").length;
        const absentCount = data.filter(a => a.attendance_status === "Absent").length;
        setChartData([
          { name: "Present", value: presentCount },
          { name: "Absent", value: absentCount }
        ]);
      } catch {
        notify("Failed to fetch attendances", "error");
      }
      setLoadingAttendances(false);
    };
    fetchAttendances();
  }, [selectedStudentId]);

  // Filter students by class
  useEffect(() => {
    if (!selectedClass) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((s) =>
        s.myclass?.some((clsName) => clsName === selectedClass)
      );
      setFilteredStudents(filtered);
      setCurrentPage(1);
    }
  }, [selectedClass, students]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return notify("Please select a student", "warning");
    const selectedClassObj = classes.find((cls) => cls.name === selectedClass);
    if (!selectedClassObj) return notify("Please select a class", "warning");

    try {
      await API.post("attendances/", {
        student_id: selectedStudentId,
        class_instance_id: selectedClassObj.id,
        attendance_status: formData.attendance_status,
        date: formData.date || null,
      });

      setFormData({ attendance_status: "Present", date: "" });

      // Refresh attendances and chart
      const res = await API.get(`attendances/?student_id=${selectedStudentId}`);
      const data = res.data.results || [];
      setAttendances(data);

      const presentCount = data.filter(a => a.attendance_status === "Present").length;
      const absentCount = data.filter(a => a.attendance_status === "Absent").length;
      setChartData([
        { name: "Present", value: presentCount },
        { name: "Absent", value: absentCount }
      ]);

      notify("Attendance added ✅");
    } catch (err) {
      console.error("Failed to add attendance:", err);
      notify("Attendance added ✅");
    }
  };

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const paginatedAttendances = attendances.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  // Calculate attendance percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const percentage = total ? Math.round((chartData[0].value / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-2">
          Attendance Management
        </h1>
        <div className="md:flex gap-6">
          {/* Students List */}
          <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Students</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Filter by Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {loadingStudents ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <ul className="space-y-2">
                  {paginatedStudents.map((student) => (
                    <li
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        selectedStudentId === student.id ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                      }`}
                    >
                      {student.name}
                    </li>
                  ))}
                </ul>

                {totalPages(filteredStudents) > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages(filteredStudents) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 text-sm rounded-full ${
                          currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
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

          {/* Attendance Section */}
          <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-100 mt-6 md:mt-0">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Attendance Records</h3>

            {/* Pie Chart */}
            {selectedStudentId && (
              <div className="mb-6 w-full h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center mt-2 text-blue-700 font-semibold">
                  Attendance: {percentage}%
                </p>
              </div>
            )}

            {loadingAttendances ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : attendances.length === 0 ? (
              <p className="text-gray-500 italic">No attendance records found.</p>
            ) : (
              <ul className="divide-y divide-gray-200 mb-6">
                {paginatedAttendances.map((att) => (
                  <li key={att.id} className="py-3 text-gray-700 text-sm">
                    <strong className="text-blue-700">Date:</strong> {att.date}{" "}
                    <span className="mx-2">|</span>
                    <strong className="text-blue-700">Status:</strong> {att.attendance_status}
                  </li>
                ))}
              </ul>
            )}

            {totalPages(attendances) > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages(attendances) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 text-sm rounded-full ${
                      currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Add Attendance Form */}
            {selectedStudentId && (
              <form onSubmit={handleAddAttendance} className="mt-6 border-t pt-5 space-y-4">
                <h4 className="text-md font-semibold text-blue-800">Add Attendance</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    name="attendance_status"
                    value={formData.attendance_status}
                    onChange={handleFormChange}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Add Attendance
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceByStudent;
