import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { Plus, Edit2, Trash2, X } from "feather-icons-react";

const Tutors = () => {
const [confirmDeleteId, setConfirmDeleteId] = useState(null);
const [deleting, setDeleting] = useState(false);
const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    active: true,
  });
  const [editingTutorId, setEditingTutorId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    active: true,
  });

  const fetchTutors = async () => {
    try {
      const res = await API.get("tutors/");
      setTutors(res.data);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  // Handle input changes for add form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle input changes for edit form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add new tutor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("tutors/", formData);
      setFormData({ name: "", email: "", specialization: "", active: true });
      toast.success('Tutor Added Successfully')
      fetchTutors();
    } catch (err) {
      console.error("Failed to add tutor", err.response?.data || err.message);
      toast.error("Failed to add tutor", err.response?.data || err.message);
    }
    setLoading(false);
  };

  // Start editing a tutor
  const startEditing = (tutor) => {
    setEditingTutorId(tutor.id);
    setEditFormData({
      name: tutor.name,
      email: tutor.email,
      specialization: tutor.specialization || "",
      active: tutor.active,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTutorId(null);
    setEditFormData({ name: "", email: "", specialization: "", active: true });
  };

  // Save edited tutor
  const saveEdit = async (id) => {
    setLoading(true);
    try {
      await API.patch(`tutors/${id}/`, editFormData);
      setEditingTutorId(null);
      fetchTutors();
    } catch (err) {
      console.error("Failed to update tutor", err.response?.data || err.message);
    }
    setLoading(false);
  };

  // Delete tutor
const deleteTutor = async (id) => {
  setDeleting(true);
  try {
    await API.delete(`tutors/${id}/`);
    fetchTutors();
    toast.success("Tutor deleted successfully");
  } catch (err) {
    console.error("Failed to delete tutor", err);
    toast.error("Failed to delete tutor");
  } finally {
    setDeleting(false);
    setConfirmDeleteId(null); // close modal
  }
};

  // Toggle active status (works for both list and edit form)
  const toggleActive = async (tutor) => {
    const updatedStatus = !tutor.active;
    try {
      await API.patch(`tutors/${tutor.id}/`, { active: updatedStatus });
      setTutors((prev) =>
        prev.map((t) => (t.id === tutor.id ? { ...t, active: updatedStatus } : t))
      );
    } catch (err) {
      console.error("Failed to toggle tutor status", err);
    }
  }; 

 return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {confirmDeleteId !== null && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
      <p className="text-gray-800 mb-6">Are you sure you want to delete this tutor?</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setConfirmDeleteId(null)}
          className="px-4 py-2 rounded-lg bg-gray-100/70 hover:bg-gray-200 text-gray-800 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => deleteTutor(confirmDeleteId)}
          className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition ${
            deleting ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tutor Management</h1>
          <p className="text-gray-600">Add and manage your tutors</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Add/Edit Tutor Form */}
          <div className="w-full lg:w-[550px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTutorId ? "Edit Tutor" : "Add New Tutor"}
                </h2>
                {editingTutorId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Cancel editing"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <form
                onSubmit={editingTutorId ? (e) => { e.preventDefault(); saveEdit(editingTutorId); } : handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tutor Name"
                    value={editingTutorId ? editFormData.name : formData.name}
                    onChange={editingTutorId ? handleEditChange : handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tutor@example.com"
                    value={editingTutorId ? editFormData.email : formData.email}
                    onChange={editingTutorId ? handleEditChange : handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    placeholder=""
                    value={editingTutorId ? editFormData.specialization : formData.specialization}
                    onChange={editingTutorId ? handleEditChange : handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    id="active"
                    name="active"
                    type="checkbox"
                    checked={editingTutorId ? editFormData.active : formData.active}
                    onChange={editingTutorId ? handleEditChange : handleChange}
                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="active" className="text-gray-700 font-medium cursor-pointer">
                    Active
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2 transition ${
                    loading ? "bg-indigo-400" : "hover:bg-indigo-700"
                  }`}
                >
                  {loading ? (
                    "Saving..."
                  ) : editingTutorId ? (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Update Tutor
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Tutor
                    </>
                  )}
                </button>

                {editingTutorId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Tutor List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                All Tutors ({tutors.length})
              </h2>

              {tutors.length === 0 ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center max-w-md mx-auto shadow-sm">
    <p className="text-indigo-700 text-xl font-semibold mb-2">No Tutors Found</p>
    <p className="text-indigo-600">Start by adding a new tutor to manage them here.</p>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mt-6 w-20 h-20 text-indigo-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>
  </div>
              ) : (
                <div className="space-y-4">
                  {tutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {tutor.name}
                            <span className="text-gray-600 text-base font-normal ml-2">
                              ({tutor.email})
                            </span>
                          </h3>
                          <p className="text-gray-700 text-sm">
                            {tutor.specialization || "No specialization"}
                          </p>
                          <p
                            onClick={() => toggleActive(tutor)}
                            title="Click to toggle status"
                            className={`font-semibold cursor-pointer select-none mt-2 inline-block ${
                              tutor.active ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {tutor.active ? "Active" : "Inactive"}
                          </p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEditing(tutor)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit tutor"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                           onClick={() => setConfirmDeleteId(tutor.id)}

                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete tutor"
                          >
                            <Trash2 className="w-5 h-5" />
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

export default Tutors;



