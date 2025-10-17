import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    course_name: "",
    tutor_name: "",
    description: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const fetchClasses = async () => {
  setLoading(true);
  try {
    let allClasses = [];
    let nextUrl = "classes/";

    // Loop through all backend pages until 'next' is null
    while (nextUrl) {
      const res = await API.get(nextUrl);
      const data = res.data.results || res.data;

      allClasses = [...allClasses, ...data];
      nextUrl = res.data.next ? res.data.next.replace(API.defaults.baseURL, "") : null;
    }

    setClasses(allClasses);
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
      const [coursesRes, tutorsRes] = await Promise.all([
        API.get("courses/"),
        API.get("tutors/"),
      ]);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update existing class
        await API.put(`classes/${formData.id}/`, formData);
        toast.success("Class updated successfully!");
      } else {
        // Create new class
        await API.post("classes/", formData);
        toast.success("Class created successfully!");
      }
      fetchClasses();
      setFormData({ id: null, name: "", course_name: "", tutor_name: "", description: "" });
    } catch (err) {
      console.error("Error saving class:", err.response?.data || err.message);
      toast.error("Failed to save class. Check console for details.");
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

  const handleEdit = (cls) => {
    // Fill form inputs with selected class data for editing
    setFormData({
      id: cls.id,
      name: cls.name,
      course_name: cls.course?.name || "",
      tutor_name: cls.tutor?.name || "",
      description: cls.description || "",
    });
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClasses = classes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

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
                value={formData.name}
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
                value={formData.course_name}
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
                value={formData.tutor_name}
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter class description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3D3DD4] text-white py-3 rounded-lg font-medium hover:bg-[#2e2ec1] transition-colors"
            >
              {formData.id ? "Update Class" : "Create Class"}
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
                  <div className="flex gap-2 items-center">
                    <Pencil
                      size={15}
                      onClick={() => handleEdit(cls)}
                      className="text-blue-500 cursor-pointer"
                    />
                    <Trash2
                      size={15}
                      onClick={() => handleDelete(cls.id)}
                      className="text-red-500 cursor-pointer"
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Simple Next & Prev Pagination */}
            {classes.length > itemsPerPage && (
              <div className="flex justify-center mt-4 space-x-3">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Prev
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManager;
