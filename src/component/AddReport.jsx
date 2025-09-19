import React, { useState } from 'react'

export default function AddReport() {
    const [isEditing, setIsEditing] = useState(null);
    const [reports, setReports] = useState([
        {
          id: 1,
          studentName: "Alice Johnson",
          modeOfLearning: "online",
          course: "python",
          currentWeek: "week3",
          currentTopic: "Functions and Loops",
          weeklyExpectedClasses: 3,
          actualAttendance: 2,
          comments: "Great progress with functions. Missed one class due to illness but catching up well.",
          status: "in-progress",
          weekEnding: "2025-09-12"
        },
        {
          id: 2,
          studentName: "Bob Smith",
          modeOfLearning: "physical",
          course: "web-dev",
          currentWeek: "week1",
          currentTopic: "HTML Basics and Structure",
          weeklyExpectedClasses: 2,
          actualAttendance: 2,
          comments: "Excellent attendance and understanding. Very engaged during sessions.",
          status: "in-progress",
          weekEnding: "2025-09-12"
        }
      ]);
    
      const [showAddForm, setShowAddForm] = useState(true);
      const [newReport, setNewReport] = useState({
        studentName: '',
        modeOfLearning: 'online',
        course: 'python',
        currentWeek: 'week1',
        currentTopic: '',
        weeklyExpectedClasses: 3,
        actualAttendance: 0,
        comments: '',
        status: 'in-progress',
        weekEnding: new Date().toISOString().split('T')[0]
      });
        const courseOptions = [
            { value: 'python', label: 'Python Programming' },
            { value: 'web-dev', label: 'Web Development' },
            { value: 'javascript', label: 'JavaScript' },
            { value: 'react', label: 'React' },
            { value: 'data-science', label: 'Data Science' },
            { value: 'machine-learning', label: 'Machine Learning' },
            { value: 'mobile-dev', label: 'Mobile Development' },
            { value: 'database', label: 'Database Management' }
        ];

  const weekOptions = Array.from({ length: 12 }, (_, i) => `week${i + 1}`);

  const handleAddReport = () => {
    if (newReport.studentName && newReport.currentTopic) {
      const report = {
        id: Date.now(),
        ...newReport,
        actualAttendance: parseInt(newReport.actualAttendance),
        weeklyExpectedClasses: parseInt(newReport.weeklyExpectedClasses)
      };
      setReports([...reports, report]);
      setNewReport({
        studentName: '',
        modeOfLearning: 'online',
        course: 'python',
        currentWeek: 'week1',
        currentTopic: '',
        weeklyExpectedClasses: 3,
        actualAttendance: 0,
        comments: '',
        status: 'in-progress',
        weekEnding: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
    }
  };

  
  return (
    <div>
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500 m-6">
            <h3 className="text-2xl font-semibold mb-4">Add New Student Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={newReport.studentName}
                  onChange={(e) => setNewReport({...newReport, studentName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Learning</label>
                <select
                  value={newReport.modeOfLearning}
                  onChange={(e) => setNewReport({...newReport, modeOfLearning: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="online">Online</option>
                  <option value="physical">Physical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={newReport.course}
                  onChange={(e) => setNewReport({...newReport, course: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {courseOptions.map(course => (
                    <option key={course.value} value={course.value}>{course.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Week</label>
                <select
                  value={newReport.currentWeek}
                  onChange={(e) => setNewReport({...newReport, currentWeek: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {weekOptions.map(week => (
                    <option key={week} value={week}>{week.charAt(0).toUpperCase() + week.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Topic</label>
                <input
                  type="text"
                  value={newReport.currentTopic}
                  onChange={(e) => setNewReport({...newReport, currentTopic: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current topic being taught"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Expected Classes</label>
                <select
                  value={newReport.weeklyExpectedClasses}
                  onChange={(e) => setNewReport({...newReport, weeklyExpectedClasses: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2}>2 times a week</option>
                  <option value={3}>3 times a week</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student's Class Attendance</label>
                <input
                  type="number"
                  value={newReport.actualAttendance}
                  onChange={(e) => setNewReport({...newReport, actualAttendance: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max={newReport.weeklyExpectedClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newReport.status}
                  onChange={(e) => setNewReport({...newReport, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Week Ending</label>
                <input
                  type="date"
                  value={newReport.weekEnding}
                  onChange={(e) => setNewReport({...newReport, weekEnding: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                <textarea
                  value={newReport.comments}
                  onChange={(e) => setNewReport({...newReport, comments: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                  placeholder="Add comments about student progress, behavior, areas of improvement, etc."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddReport}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Report
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
    </div>
  )
}
