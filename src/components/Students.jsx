import React, { useEffect, useState } from "react";
import { User, Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../api/api";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    course_id: "",
    tutor_id: "",
    class_id: "",
    mode: "",
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination + search
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchTutors();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("students/");
      setStudents(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
      toast.error("Failed to fetch students");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchTutors = async () => {
    try {
      const res = await API.get("tutors/");
      setTutors(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get("classes/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setClasses(data);
    } catch (err) {
      console.error("Failed to fetch classes", err);
      toast.error("Failed to fetch class list");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedCourse = courses.find(
      (c) => c.id === parseInt(formData.course_id)
    );
    const selectedClass = classes.find(
      (cls) => cls.id === parseInt(formData.class_id)
    );

    const payload = {
      name: formData.name,
      course_names: selectedCourse ? [selectedCourse.name] : [],
      class_name: selectedClass ? selectedClass.name : "",
      tutor: formData.tutor_id || null,
      mode: formData.mode,
      active: formData.active,
    };

    try {
      if (editingId) {
        await API.put(`students/${editingId}/`, payload);
        toast.success("Updated student successfully");
      } else {
        await API.post("students/", payload);
        toast.success("Added student successfully");
      }

      setFormData({
        name: "",
        course_id: "",
        tutor_id: "",
        class_id: "",
        mode: "",
        active: true,
      });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error("Failed to save student", err);
      toast.error("Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    const foundCourse =
      courses.find((c) => student.courses.includes(c.name)) || {};
    const foundClass =
      classes.find((cls) => student.myclass.includes(cls.name)) || {};

    setFormData({
      name: student.name,
      course_id: foundCourse.id || "",
      tutor_id: student.tutor || "",
      class_id: foundClass.id || "",
      mode: student.mode || "",
      active: student.active,
    });
    setEditingId(student.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      course_id: "",
      tutor_id: "",
      class_id: "",
      mode: "",
      active: true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await API.delete(`students/${id}/`);
      toast.success("Deleted student successfully");
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
      toast.error("Failed to delete student");
    }
  };

  // Pagination + filtering
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastStudent = currentPage * studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfLastStudent - studentsPerPage,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Student Management
          </h1>
          <p className="text-gray-600">Add, edit, and manage your students</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingId ? "Edit Student" : "Add New Student"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tutor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutor
                  </label>
                  <select
                    name="tutor_id"
                    value={formData.tutor_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a tutor</option>
                    {tutors.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    name="class_id"
                    value={formData.class_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode */}
                <div>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Mode of Learning</option>
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                {/* Active */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3D3DD4] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Saving..."
                  ) : editingId ? (
                    <>
                      <Edit2 className="w-4 h-4" /> Update Student
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add Student
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Right: Student list */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Student List
              </h2>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {currentStudents.length === 0 ? (
              <p className="text-gray-600 text-center py-6">
                No students found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Tutor</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4 text-center">Active</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4">
                          {student.myclass?.join(", ") || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {student.courses?.join(", ") || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {student.tutor_name || "-"}
                        </td>
                        <td className="py-3 px-4">{student.mode || "-"}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              const updated = !student.active;
                              API.patch(`students/${student.id}/`, {
                                active: updated,
                              })
                                .then(fetchStudents)
                                .then(() =>
                                  toast.success(
                                    `Marked as ${
                                      updated ? "Active" : "Inactive"
                                    }`
                                  )
                                )
                                .catch(() =>
                                  toast.error("Failed to update status")
                                );
                            }}
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              student.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
