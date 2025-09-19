import React, { useState } from "react";
import { Save } from "lucide-react";

export const EditableReport = ({ report }) => {
  
  const courseOptions = [
    { value: "python", label: "Python Programming" },
    { value: "web-dev", label: "Web Development" },
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "data-science", label: "Data Science" },
    { value: "machine-learning", label: "Machine Learning" },
    { value: "mobile-dev", label: "Mobile Development" },
    { value: "database", label: "Database Management" },
  ];
  // const [isEditing, setIsEditing] = useState(null);

  const [editData, setEditData] = useState({
    studentName: report.studentName,
    modeOfLearning: report.modeOfLearning,
    course: report.course,
    currentWeek: report.currentWeek,
    currentTopic: report.currentTopic,
    weeklyExpectedClasses: report.weeklyExpectedClasses,
    actualAttendance: report.actualAttendance,
    comments: report.comments,
    status: report.status,
    weekEnding: report.weekEnding,
  });
  const weekOptions = Array.from({ length: 12 }, (_, i) => `week${i + 1}`);
  // const handleSave = (id, updatedReport) => {
  //   setReports(
  //     reports.map((report) =>
  //       report.id === id
  //         ? {
  //             ...report,
  //             ...updatedReport,
  //             actualAttendance: parseInt(updatedReport.actualAttendance),
  //             weeklyExpectedClasses: parseInt(
  //               updatedReport.weeklyExpectedClasses
  //             ),
  //           }
  //         : report
  //     )
  //   );
  //   setIsEditing(null);
  // };

 

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold mb-4">Edit Student Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Name
          </label>
          <input
            type="text"
            value={editData.studentName}
            onChange={(e) =>
              setEditData({ ...editData, studentName: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mode of Learning
          </label>
          <select
            value={editData.modeOfLearning}
            onChange={(e) =>
              setEditData({ ...editData, modeOfLearning: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <select
            value={editData.course}
            onChange={(e) =>
              setEditData({ ...editData, course: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {courseOptions.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Week
          </label>
          <select
            value={editData.currentWeek}
            onChange={(e) =>
              setEditData({ ...editData, currentWeek: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {weekOptions.map((week) => (
              <option key={week} value={week}>
                {week.charAt(0).toUpperCase() + week.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Topic
          </label>
          <input
            type="text"
            value={editData.currentTopic}
            onChange={(e) =>
              setEditData({ ...editData, currentTopic: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weekly Expected Classes
          </label>
          <select
            value={editData.weeklyExpectedClasses}
            onChange={(e) =>
              setEditData({
                ...editData,
                weeklyExpectedClasses: parseInt(e.target.value),
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={2}>2 times a week</option>
            <option value={3}>3 times a week</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actual Attendance
          </label>
          <input
            type="number"
            value={editData.actualAttendance}
            onChange={(e) =>
              setEditData({
                ...editData,
                actualAttendance: parseInt(e.target.value),
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max={editData.weeklyExpectedClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={editData.status}
            onChange={(e) =>
              setEditData({ ...editData, status: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Week Ending
          </label>
          <input
            type="date"
            value={editData.weekEnding}
            onChange={(e) =>
              setEditData({ ...editData, weekEnding: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments
          </label>
          <textarea
            value={editData.comments}
            onChange={(e) =>
              setEditData({ ...editData, comments: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleSave(report.id, editData)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Save size={16} />
          Save
        </button>
        <button
          onClick={() => setIsEditing(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
