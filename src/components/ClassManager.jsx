import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newClass, setNewClass] = useState({
    name: "",
    course_name: "",
    tutor_name: "",
    description: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await API.get("classes/");
      setClasses(Array.isArray(res.data) ? res.data : res.data.results || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch classes:", err.response?.data || err.message);
      setError("Failed to fetch class list");
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [coursesRes, tutorsRes] = await Promise.all([API.get("courses/"), API.get("tutors/")]);
      setCourses(coursesRes.data);
      setTutors(tutorsRes.data);
    } catch (err) {
      console.error("Failed to fetch dropdown options:", err);
      setError("Failed to load dropdown options");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("classes/", newClass);
      toast.success("Class created!");
      fetchClasses();
      setNewClass({ name: "", course_name: "", tutor_name: "", description: "" });
    } catch (err) {
      console.error("Error creating class:", err.response?.data || err.message);
      toast.error("Error creating class. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      await API.delete(`classes/${id}/`);
      toast.success("Class deleted!");
      fetchClasses();
    } catch (err) {
      console.error("Error deleting class:", err.response?.data || err.message);
      toast.error("Failed to delete class.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClasses = classes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Class Manager</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name:</label>
              <input
                type="text"
                name="name"
                value={newClass.name}
                onChange={handleChange}
                required
                placeholder="Enter class name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course:</label>
              <select
                name="course_name"
                value={newClass.course_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tutor:</label>
              <select
                name="tutor_name"
                value={newClass.tutor_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select a tutor</option>
                {tutors.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <textarea
                name="description"
                value={newClass.description}
                onChange={handleChange}
                placeholder="Enter class description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3D3DD4] text-white py-3 rounded-lg font-medium hover:bg-[#2e2ec1] transition-colors"
            >
              Create Class
            </button>
          </form>

          {/* Class List Section */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Class List</h3>
            <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {currentClasses.map((cls) => (
                <li
                  key={cls.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all flex justify-between items-start"
                >
                  <div>
                    <p className="text-gray-900 font-medium">
                      <strong>{cls.name}</strong> — {cls.course?.name} — {cls.tutor?.name}
                    </p>
                    {cls.description && (
                      <p className="text-sm text-gray-600 mt-1">{cls.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {classes.length > itemsPerPage && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      page === currentPage ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManager;
