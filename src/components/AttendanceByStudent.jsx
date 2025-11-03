import { useEffect, useState } from "react";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";






import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ITEMS_PER_PAGE = 10;
const COLORS = ["#4ade80", "#f87171"]; // green for present, red for absent

const AttendanceByStudent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [attendances, setAttendances] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    attendance_status: "Present",
    date: "",
  });
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendances, setLoadingAttendances] = useState(false);
  const [studentPage, setStudentPage] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const [chartData, setChartData] = useState([]);

  const notify = (msg, type = "success") =>
    toast[type](msg, { position: "top-right", autoClose: 3000 });

  // ✅ Fetch students and classes
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
      } finally {
        setLoadingStudents(false);
      }
    };

    const fetchClasses = async () => {
      try {
        let allClasses = [];
        let nextUrl = "classes/";
        while (nextUrl) {
          const res = await API.get(nextUrl);
          const data = res.data.results || res.data;
          allClasses = [...allClasses, ...data];
          nextUrl = res.data.next || null;
        }
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

  // ✅ Fetch attendances for selected student
  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchAttendances = async () => {
      setLoadingAttendances(true);
      try {
        const res = await API.get(`attendances/?student_id=${selectedStudentId}`);
        const data = res.data.results || res.data || [];
        setAttendances(data);

        const presentCount = data.filter((a) => a.attendance_status === "Present").length;
        const absentCount = data.filter((a) => a.attendance_status === "Absent").length;

        setChartData([
          { name: "Present", value: presentCount },
          { name: "Absent", value: absentCount },
        ]);
      } catch {
        notify("Failed to fetch attendances", "error");
      } finally {
        setLoadingAttendances(false);
      }
    };

    fetchAttendances();
  }, [selectedStudentId]);

  // ✅ Filter by class and name
  useEffect(() => {
    let filtered = students;

    if (selectedClass) {
      filtered = filtered.filter((s) =>
        Array.isArray(s.myclass)
          ? s.myclass.includes(selectedClass)
          : s.myclass === selectedClass
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
    setStudentPage(1);
    setSelectedStudentId(null);
  }, [selectedClass, searchQuery, students]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add new attendance
 const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return notify("Please select a student", "warning");
    const selectedClassObj = classes.find((cls) => cls.name === selectedClass);
    if (!selectedClassObj) return notify("Please select a class", "warning");

    // ✅ FIXED PART: Ensure date is always properly handled
    const attendanceDate = formData.date
      ? formData.date
      : new Date().toISOString().split("T")[0];

    try {
      await API.post("attendances/", {
        student_id: selectedStudentId,
        class_instance_id: selectedClassObj.id,
        attendance_status: formData.attendance_status,
        date: attendanceDate, // use exact date picked (or today if blank)
      });

      setFormData({ attendance_status: "Present", date: "" });

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


  // ✅ CSV Export (Enhanced)
 // ✅ Generate PDF Report
const handleDownloadPDF = () => {
  if (attendances.length === 0)
    return notify("No attendance records to download", "info");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(33, 76, 158);
  doc.text("Attendance Report", pageWidth / 2, 15, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Student Name: ${selectedStudentName}`, 14, 30);
  const studentClass =
    selectedClass ||
    (Array.isArray(students.find((s) => s.id === selectedStudentId)?.myclass)
      ? students.find((s) => s.id === selectedStudentId)?.myclass.join(", ")
      : students.find((s) => s.id === selectedStudentId)?.myclass || "N/A");

  const presentCount = chartData.find((d) => d.name === "Present")?.value || 0;
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const percentage = total ? Math.round((presentCount / total) * 100) : 0;

  doc.text(`Class: ${studentClass}`, 14, 38);
  doc.text(`Attendance Percentage: ${percentage}%`, 14, 46);

  // Table
    const tableData = attendances.map((a) => [
      a.date,
      a.attendance_status,
      a.class_instance_name || studentClass || "",
    ]);
  
    autoTable(doc, {
      startY: 55,
      head: [["Date", "Status", "Class"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [25, 118, 210] },
      bodyStyles: { textColor: 0 },
      styles: { fontSize: 10, cellPadding: 3 },
    });

  // Footer
  const generatedDate = new Date().toLocaleDateString();
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    // replace the existing "Date" block in the form with this
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleFormChange}
          // no max here so future dates are selectable
          min="1900-01-01"
          className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Quick set buttons for convenience */}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // tomorrow
            }))
          }
          className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
        >
          Tomorrow
        </button>

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              date: new Date().toISOString().split("T")[0], // today
            }))
          }
          className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, date: "" }))}
          className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>
    </div>
  }

  // Save
  doc.save(`${selectedStudentName}_Attendance_Report.pdf`);
  notify("PDF Report downloaded 📄");
};


  // Pagination
  const paginatedStudents = filteredStudents.slice(
    (studentPage - 1) * ITEMS_PER_PAGE,
    studentPage * ITEMS_PER_PAGE
  );
  const paginatedAttendances = attendances.slice(
    (attendancePage - 1) * ITEMS_PER_PAGE,
    attendancePage * ITEMS_PER_PAGE
  );
  const totalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

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
          {/* Students Section */}
          <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Students</h3>

            {/* Filter by class */}
            <div className="mb-3">
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

            {/* Filter by name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Enter student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Students list */}
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
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setSelectedStudentName(student.name);
                        setAttendancePage(1);
                      }}
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        selectedStudentId === student.id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-50"
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
                        onClick={() => setStudentPage(i + 1)}
                        className={`w-8 h-8 text-sm rounded-full ${
                          studentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700">
                Attendance Records {selectedStudentName && `for ${selectedStudentName}`}
              </h3>

           {selectedStudentId && attendances.length > 0 && (
  <button
    onClick={handleDownloadPDF}
    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold"
  >
    📄 Download Report (PDF)
  </button>
)}

            </div>

            {/* Chart */}
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
                      {chartData.map((_, index) => (
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

            {/* Attendance list */}
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
                    onClick={() => setAttendancePage(i + 1)}
                    className={`w-8 h-8 text-sm rounded-full ${
                      attendancePage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Add Attendance */}
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
