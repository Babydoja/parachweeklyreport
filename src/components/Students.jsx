import React, { useEffect, useState } from "react";
import { User, Edit2, Trash2, Plus, X, User2 } from "lucide-react";
import API from "../api/api";
import { toast } from "react-toastify";


const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    course_ids: [],
    tutor_id: "",
    mode: "",
    active:true
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 👉 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // 👉 Search filter
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchTutors();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("students/");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
      toast.error("Failed to fetch students");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchTutors = async () => {
    try {
      const res = await API.get("tutors/");
      setTutors(res.data);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    }
  };

const handleChange = (e) => {
  const { name, value ,type,checked} = e.target;
  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedCourseNames = courses
      .filter((course) => formData.course_ids.includes(course.id))
      .map((course) => course.name);

    const payload = {
      name: formData.name,
      course_names: selectedCourseNames,
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

      setFormData({ name: "", course_ids: [], tutor_id: "", mode: "" });
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
    const selectedCourseIds = courses
      .filter((course) => student.courses.includes(course.name))
      .map((course) => course.id);

    setFormData({
      name: student.name,
      course_ids: selectedCourseIds,
      tutor_id: student.tutor || "",
      mode: student.mode || "",
      active: student.active, 
    });

    setEditingId(student.id);
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

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", course_ids: [], tutor_id: "", mode: "" });
  };

  // 👉 Apply search filter
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 👉 Pagination logic on filtered students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

    // Toggle active status (works for both list and edit form)
  const toggleActive = async (student) => {
    const updatedStatus = !student.active;
    try {
      await API.patch(`students/${student.id}/`, { active: updatedStatus });
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, active: updatedStatus } : s
        )
      );
      toast.success(`Student is now ${updatedStatus ? "Active" : "Inactive"}`);
    } catch (err) {
      console.error("Failed to toggle student status", err);
      toast.error("Failed to update student status");
    }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Management</h1>
          <p className="text-gray-600">Add, edit, and manage your students</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Add/Edit Student Form */}
          <div className="w-full lg:w-[550px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Student" : "Add New Student"}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter student name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Courses
  </label>
  <select
    name="course_ids"
    value={formData.course_ids}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
  >
    <option value="">Select a course</option>
    {courses.map((course) => (
      <option key={course.id} value={course.id}>
        {course.name}
      </option>
    ))}
  </select>
</div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutor
                  </label>
                  <select
                    name="tutor_id"
                    value={formData.tutor_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">-- Select Tutor --</option>
                    {tutors.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Mode of Learning</option>
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3D3DD4] text-white py-3 rounded-lg font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Saving..."
                  ) : editingId ? (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Update Student
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Student
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Students ({filteredStudents.length})
                </h2>
                <div>
                  <input
                    type="text"
                    placeholder="Search Student by Name"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // reset to first page on search
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No students found.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Add your first student to get started!
                  </p>
                </div>
              ) : (
                <>
                  {/* Students Display */}
                  <div className="space-y-4">
                    {currentStudents.map((student) => (
                      <div
                        key={student.id}
                        className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                              {student.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Course: {student.courses?.join(", ") || "None"}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              <User2 size={10} /> Tutor: {student.tutor_name || "No tutor"}
                            </p>

                             <p
                              onClick={() => toggleActive(student)}
                              title="Click to toggle status"
                              className={`font-semibold cursor-pointer select-none mt-2 inline-block ${
                                student.active ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {student.active ? "Active" : "Inactive"}
                          </p>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(student)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit student"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 rounded-md border text-sm ${
                          currentPage === i + 1
                            ? "bg-indigo-500 text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
