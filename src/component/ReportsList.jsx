import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddReport from './AddReport'; 

export default function ReportsList() {
  const [isEditing, setIsEditing] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [submittedReports, setSubmittedReports] = useState([]);

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
      weekEnding: "2025-09-12",
      isActive: true
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
      weekEnding: "2025-09-12",
        isActive: false
    }
  ]);

  // Add report handler
  const handleAddReport = (newReport) => {
    setReports([...reports, { id: Date.now(), ...newReport }]);
    setShowAddForm(false);
  };
  
  const handleSubmitWeek = () => {
    if (!selectedDate || reports.length === 0) {
      alert("Please select a date and add at least one report.");
      return;
    }

    const submission = {
      weekEnding: selectedDate,
      reports: reports
    };

    setSubmittedReports([...submittedReports, submission]);
    setReports([]);
    setSelectedDate('');
  };

  return (
    <div className="font-[inter] max-w-full mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Weekly Reports</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showAddForm ? 'Close Form' : 'Add New Report'}
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <label htmlFor="weekEnding" className="text-gray-700 font-medium">Week Ending:</label>
        <input
          type="date"
          id="weekEnding"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        />
      </div>

      {showAddForm && (
        <AddReport
          onAddReport={handleAddReport}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-600">Start by adding your first student report</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y text-center divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Student Name</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Mode</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Course</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Week</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Topic</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Active</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reports.map((report) => (
                <tr key={report.id}
                  className={
                    `border-l-4 ${
                    report.isActive?'border-green-500': 'border-red-500'
                    }`}
                 >
                  <td className="px-4 py-2 text-sm text-gray-800">{report.studentName}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{report.modeOfLearning}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{report.course}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{report.currentWeek}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{report.currentTopic}</td>
                          <span
          className={`inline-block px-2 py-[2px] mt-[8px] text-xs font-semibold rounded ${
            report.isActive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}
        >
          {report.isActive ? 'Active' : 'Inactive'}
        </span>
                  <td
                    className="px-4 content-center justify-items-center py-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => setIsEditing(report.id)}
                  >
                    <MdOutlineModeEditOutline size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {/* Submit Button */}
      {reports.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleSubmitWeek}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Weekly Report
          </button>
        </div>
      )}

      
      {submittedReports.map((week, index) => (
        <div key={index} className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Submitted Reports – Week Ending: {week.weekEnding}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mode</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Course</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Week</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Topic</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Expected</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actual</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {week.reports.map((report) => (
                  <tr
                    key={report.id}
                    className={`border-l-4 ${report.isActive ? 'border-green-500' : 'border-red-500'}`}
                  >
                    <td className="px-4 py-2 text-sm text-gray-800">{report.studentName}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{report.modeOfLearning}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{report.course}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{report.currentWeek}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{report.currentTopic}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{report.weeklyExpectedClasses}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{report.actualAttendance}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{report.status}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${report.isActive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        {report.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
