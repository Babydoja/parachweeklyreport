import React, { useEffect, useState } from "react";
import API from "../api/api";

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState(null);
  const [tutors, setTutors] = useState(null);
  const [topics, setTopics] = useState(null);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState(null);

  const [newClass, setNewClass] = useState({
    course_name: "",
    tutor_name: "",
    topic_name: "",
    date: "",
  });

  const [filterDate, setFilterDate] = useState("");
  const [filterTutor, setFilterTutor] = useState("");

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const res = await API.get("classes/");
      const data = res.data;
      const classList = Array.isArray(data) ? data : data.results || [];
      setClasses(classList);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch classes:", err.response?.data || err.message);
      setError("Failed to fetch class list");
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [coursesRes, tutorsRes, topicsRes] = await Promise.all([
        API.get("courses/"),
        API.get("tutors/"),
        API.get("topics/"),
      ]);

      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.results || []);
      setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : tutorsRes.data.results || []);
      setTopics(Array.isArray(topicsRes.data) ? topicsRes.data : topicsRes.data.results || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dropdown options:", err.response?.data || err.message);
      setError("Failed to load dropdown options");
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("classes/", newClass);
      console.log("Class created:", response.data);
      fetchClasses();
      setNewClass({ course_name: "", tutor_name: "", topic_name: "", date: "" });
    } catch (err) {
      console.error("Error creating class:", err.response?.data || err.message);
      alert("Error creating class. Check console for details.");
    }
  };

if (loadingOptions) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-4 text-blue-700">Loading Classes...</span>
    </div>
  );
}

if (error) {
  return (
    <p className="text-center text-red-600 py-4">
      {error}
    </p>
  );
}

const missingItems = [];
if (!courses?.length) missingItems.push("courses");
if (!tutors?.length) missingItems.push("tutors");
if (!topics?.length) missingItems.push("topics");

if (missingItems.length > 0) {
  return (
    <p className="text-center text-yellow-600 py-4">
      Failed to load: {missingItems.join(", ")}.
    </p>
  );
}


 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Class Manager</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
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
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic:</label>
            <select
              name="topic_name"
              value={newClass.topic_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select a topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <input
              type="date"
              name="date"
              value={newClass.date}
              onChange={handleChange}
              required
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

        {/* Filter + Class List Section */}
        <div>
          {/* Filter Section */}
          <div className="space-y-6 mb-10">
            <h3 className="text-2xl font-semibold text-gray-800">Filter Classes</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date:</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Tutor:</label>
              <select
                value={filterTutor}
                onChange={(e) => setFilterTutor(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">All Tutors</option>
                {tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.name}>
                    {tutor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class List Section */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Class List</h3>
            {loadingClasses ? (
              <p className="text-center text-gray-500">Loading classes...</p>
            ) : (
              <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {classes
                  .filter((cls) => {
                    const matchesDate = !filterDate || cls.date === filterDate;
                    const matchesTutor = !filterTutor || cls.tutor?.name === filterTutor;
                    return matchesDate && matchesTutor;
                  })
                  .map((cls) => (
                    <li
                      key={cls.id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all"
                    >
                      <p className="text-gray-900 font-medium">
                        <strong>{cls.topic?.title || "Untitled Topic"}</strong> — {cls.course?.name} —{" "}
                        {cls.tutor?.name} on {cls.date}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);


};

export default ClassManager;
