import React, { useEffect, useState } from "react";
import { BookOpen, Edit2, Trash2, Plus, X } from 'lucide-react';
import API from "../api/api";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
      toast.error("Error fetching courses");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await API.put(`courses/${editingId}/`, formData);
        toast.success('Edited the course successfully');
      } else {
        await API.post("courses/", formData);
        toast.success('Added the course successfully');
      }

      setFormData({ name: "", description: "" });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course", err);
      toast.error(editingId ? "Error editing the course" : "Error adding the course");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name,
      description: course.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`courses/${id}/`);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course", err);
      toast.error("Error deleting the course");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Create and manage your courses</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Add/Edit Course Form */}
          <div className="w-full lg:w-[550px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Course" : "Add New Course"}
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

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Python Programming"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe what students will learn..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.name || !formData.description}
                  className="w-full  bg-[#3D3DD4]  text-white py-3 rounded-lg font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Saving..."
                  ) : editingId ? (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Update Course
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Course
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                All Courses ({courses.length})
              </h2>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No courses found.</p>
                  <p className="text-gray-400 text-sm mt-2">Create your first course to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            {course.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(course)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;