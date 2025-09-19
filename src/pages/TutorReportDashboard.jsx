import React, { useState } from 'react';
import ReportsList from '../component/ReportsList';
import Header from '../component/Header';
import StatsCards from '../component/StatsCards';
import {Plus} from 'lucide-react'
import { Link } from 'react-router-dom';

const TutorReportDashboard = () => {
  // const [reports, setReports] = useState([
  //   {
  //     id: 1,
  //     studentName: "Alice Johnson",
  //     modeOfLearning: "online",
  //     course: "python",
  //     currentWeek: "week3",
  //     currentTopic: "Functions and Loops",
  //     weeklyExpectedClasses: 3,
  //     actualAttendance: 2,
  //     comments: "Great progress with functions. Missed one class due to illness but catching up well.",
  //     status: "in-progress",
  //     weekEnding: "2025-09-12"
  //   },
  //   {
  //     id: 2,
  //     studentName: "Bob Smith",
  //     modeOfLearning: "physical",
  //     course: "web-dev",
  //     currentWeek: "week1",
  //     currentTopic: "HTML Basics and Structure",
  //     weeklyExpectedClasses: 2,
  //     actualAttendance: 2,
  //     comments: "Excellent attendance and understanding. Very engaged during sessions.",
  //     status: "in-progress",
  //     weekEnding: "2025-09-12"
  //   }
  // ]);

  // const [isEditing, setIsEditing] = useState(null);
  // const [showAddForm, setShowAddForm] = useState(false);
  // const [newReport, setNewReport] = useState({
  //   studentName: '',
  //   modeOfLearning: 'online',
  //   course: 'python',
  //   currentWeek: 'week1',
  //   currentTopic: '',
  //   weeklyExpectedClasses: 3,
  //   actualAttendance: 0,
  //   comments: '',
  //   status: 'in-progress',
  //   weekEnding: new Date().toISOString().split('T')[0]
  // });

  // const courseOptions = [
  //   { value: 'python', label: 'Python Programming' },
  //   { value: 'web-dev', label: 'Web Development' },
  //   { value: 'javascript', label: 'JavaScript' },
  //   { value: 'react', label: 'React' },
  //   { value: 'data-science', label: 'Data Science' },
  //   { value: 'machine-learning', label: 'Machine Learning' },
  //   { value: 'mobile-dev', label: 'Mobile Development' },
  //   { value: 'database', label: 'Database Management' }
  // ];

  // const weekOptions = Array.from({ length: 12 }, (_, i) => `week${i + 1}`);

  // const handleAddReport = () => {
  //   if (newReport.studentName && newReport.currentTopic) {
  //     const report = {
  //       id: Date.now(),
  //       ...newReport,
  //       actualAttendance: parseInt(newReport.actualAttendance),
  //       weeklyExpectedClasses: parseInt(newReport.weeklyExpectedClasses)
  //     };
  //     setReports([...reports, report]);
  //     setNewReport({
  //       studentName: '',
  //       modeOfLearning: 'online',
  //       course: 'python',
  //       currentWeek: 'week1',
  //       currentTopic: '',
  //       weeklyExpectedClasses: 3,
  //       actualAttendance: 0,
  //       comments: '',
  //       status: 'in-progress',
  //       weekEnding: new Date().toISOString().split('T')[0]
  //     });
  //     setShowAddForm(false);
  //   }
  // };

  // const handleEdit = (id) => {
  //   setIsEditing(id);
  // };

  // const handleSave = (id, updatedReport) => {
  //   setReports(reports.map(report => 
  //     report.id === id ? { 
  //       ...report, 
  //       ...updatedReport,
  //       actualAttendance: parseInt(updatedReport.actualAttendance),
  //       weeklyExpectedClasses: parseInt(updatedReport.weeklyExpectedClasses)
  //     } : report
  //   ));
  //   setIsEditing(null);
  // };

  // const handleDelete = (id) => {
  //   setReports(reports.filter(report => report.id !== id));
  // };

  // const getStatusIcon = (status) => {
  //   switch (status) {
  //     case 'in-progress':
  //       return <CheckCircle className="text-green-600" size={16} />;
  //     case 'on-hold':
  //       return <Pause className="text-yellow-600" size={16} />;
  //     default:
  //       return <AlertCircle className="text-gray-600" size={16} />;
  //   }
  // };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'in-progress':
  //       return 'bg-green-100 text-green-800';
  //     case 'on-hold':
  //       return 'bg-yellow-100 text-yellow-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // const getAttendanceColor = (actual, expected) => {
  //   const percentage = (actual / expected) * 100;
  //   if (percentage >= 100) return 'bg-green-100 text-green-800';
  //   if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
  //   return 'bg-red-100 text-red-800';
  // };

  // const EditableReport = ({ report }) => {
  //   const [editData, setEditData] = useState({
  //     studentName: report.studentName,
  //     modeOfLearning: report.modeOfLearning,
  //     course: report.course,
  //     currentWeek: report.currentWeek,
  //     currentTopic: report.currentTopic,
  //     weeklyExpectedClasses: report.weeklyExpectedClasses,
  //     actualAttendance: report.actualAttendance,
  //     comments: report.comments,
  //     status: report.status,
  //     weekEnding: report.weekEnding
  //   });

  //   return (
  //     <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
  //       <h3 className="text-lg font-semibold mb-4">Edit Student Report</h3>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
  //           <input
  //             type="text"
  //             value={editData.studentName}
  //             onChange={(e) => setEditData({...editData, studentName: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Learning</label>
  //           <select
  //             value={editData.modeOfLearning}
  //             onChange={(e) => setEditData({...editData, modeOfLearning: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           >
  //             <option value="online">Online</option>
  //             <option value="physical">Physical</option>
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
  //           <select
  //             value={editData.course}
  //             onChange={(e) => setEditData({...editData, course: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           >
  //             {courseOptions.map(course => (
  //               <option key={course.value} value={course.value}>{course.label}</option>
  //             ))}
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Current Week</label>
  //           <select
  //             value={editData.currentWeek}
  //             onChange={(e) => setEditData({...editData, currentWeek: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           >
  //             {weekOptions.map(week => (
  //               <option key={week} value={week}>{week.charAt(0).toUpperCase() + week.slice(1)}</option>
  //             ))}
  //           </select>
  //         </div>
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Current Topic</label>
  //           <input
  //             type="text"
  //             value={editData.currentTopic}
  //             onChange={(e) => setEditData({...editData, currentTopic: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Expected Classes</label>
  //           <select
  //             value={editData.weeklyExpectedClasses}
  //             onChange={(e) => setEditData({...editData, weeklyExpectedClasses: parseInt(e.target.value)})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           >
  //             <option value={2}>2 times a week</option>
  //             <option value={3}>3 times a week</option>
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Actual Attendance</label>
  //           <input
  //             type="number"
  //             value={editData.actualAttendance}
  //             onChange={(e) => setEditData({...editData, actualAttendance: parseInt(e.target.value)})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             min="0"
  //             max={editData.weeklyExpectedClasses}
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
  //           <select
  //             value={editData.status}
  //             onChange={(e) => setEditData({...editData, status: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           >
  //             <option value="in-progress">In Progress</option>
  //             <option value="on-hold">On Hold</option>
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Week Ending</label>
  //           <input
  //             type="date"
  //             value={editData.weekEnding}
  //             onChange={(e) => setEditData({...editData, weekEnding: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
  //           <textarea
  //             value={editData.comments}
  //             onChange={(e) => setEditData({...editData, comments: e.target.value})}
  //             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
  //           />
  //         </div>
  //       </div>
  //       <div className="flex gap-2 mt-4">
  //         <button
  //           onClick={() => handleSave(report.id, editData)}
  //           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
  //         >
  //           <Save size={16} />
  //           Save
  //         </button>
  //         <button
  //           onClick={() => setIsEditing(null)}
  //           className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
  //         >
  //           Cancel
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  // const ReportCard = ({ report }) => (
  //   <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
  //     <div className="flex justify-between items-start mb-4">
  //       <div className="flex items-center gap-3">
  //         <User className="text-gray-600" size={20} />
  //         <div>
  //           <h3 className="text-xl font-semibold text-gray-800">{report.studentName}</h3>
  //           <div className="flex items-center gap-2 mt-1">
  //             {report.modeOfLearning === 'online' ? 
  //               <Monitor className="text-blue-600" size={14} /> : 
  //               <Users className="text-green-600" size={14} />
  //             }
  //             <span className="text-sm text-gray-600 capitalize">{report.modeOfLearning}</span>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex gap-2">
  //         <button
  //           onClick={() => handleEdit(report.id)}
  //           className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
  //         >
  //           <Edit2 size={16} />
  //         </button>
  //         <button
  //           onClick={() => handleDelete(report.id)}
  //           className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
  //         >
  //           <Trash2 size={16} />
  //         </button>
  //       </div>
  //     </div>
      
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  //       <div className="space-y-3">
  //         <div className="flex items-center gap-2">
  //           <BookOpen className="text-purple-600" size={16} />
  //           <span className="font-medium text-gray-700">Course:</span>
  //           <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
  //             {courseOptions.find(c => c.value === report.course)?.label}
  //           </span>
  //         </div>
          
  //         <div className="flex items-center gap-2">
  //           <Calendar className="text-blue-600" size={16} />
  //           <span className="font-medium text-gray-700">Week:</span>
  //           <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
  //             {report.currentWeek.charAt(0).toUpperCase() + report.currentWeek.slice(1)}
  //           </span>
  //         </div>
          
  //         <div className="flex items-center gap-2">
  //           <Clock className="text-orange-600" size={16} />
  //           <span className="font-medium text-gray-700">Attendance:</span>
  //           <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getAttendanceColor(report.actualAttendance, report.weeklyExpectedClasses)}`}>
  //             {report.actualAttendance}/{report.weeklyExpectedClasses} classes
  //           </span>
  //         </div>
  //       </div>
        
  //       <div className="space-y-3">
  //         <div className="flex items-center gap-2">
  //           <span className="font-medium text-gray-700">Status:</span>
  //           <div className="flex items-center gap-1">
  //             {getStatusIcon(report.status)}
  //             <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(report.status)}`}>
  //               {report.status === 'in-progress' ? 'In Progress' : 'On Hold'}
  //             </span>
  //           </div>
  //         </div>
          
  //         <div className="flex items-center gap-2 text-sm text-gray-500">
  //           <Calendar size={14} />
  //           <span>Week ending: {new Date(report.weekEnding).toLocaleDateString()}</span>
  //         </div>
  //       </div>
  //     </div>
      
  //     <div className="mb-4">
  //       <div className="flex items-start gap-2">
  //         <BookOpen className="text-indigo-600 mt-1" size={16} />
  //         <div>
  //           <span className="font-medium text-gray-700">Current Topic:</span>
  //           <p className="text-gray-800 mt-1 font-medium">{report.currentTopic}</p>
  //         </div>
  //       </div>
  //     </div>
      
  //     <div className="flex items-start gap-2">
  //       <MessageSquare className="text-green-600 mt-1" size={16} />
  //       <div>
  //         <span className="font-medium text-gray-700">Comments:</span>
  //         <p className="text-gray-600 mt-1">{report.comments}</p>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const totalStudents = reports.length;
  // const activeStudents = reports.filter(r => r.status === 'in-progress').length;
  // const onHoldStudents = reports.filter(r => r.status === 'on-hold').length;
  // const totalExpectedClasses = reports.reduce((sum, report) => sum + report.weeklyExpectedClasses, 0);
  // const totalActualAttendance = reports.reduce((sum, report) => sum + report.actualAttendance, 0);
  // const attendanceRate = totalExpectedClasses > 0 ? ((totalActualAttendance / totalExpectedClasses) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen shadow-sm bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header/>

        {/* Stats Cards */}
        <StatsCards/>

        {/* Add New Report Button */}
        <div className="mb-6">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            <Link to='/addreport'>Add New Student Report</Link>
          </button>
        </div>

        {/* Add New Report Form */}
        

        {/* Report lIST */}
        {/* <ReportsList/> */}
      </div>
    </div>
  );
};

export default TutorReportDashboard;