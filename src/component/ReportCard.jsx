import React, { useState } from 'react';
import { Calendar, User, BookOpen, MessageSquare,CheckCircle ,Edit2, Trash2, Monitor, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'on-hold':
        return <Pause className="text-yellow-600" size={16} />;
      default:
        return <AlertCircle className="text-gray-600" size={16} />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

const getAttendanceColor = (actual, expected) => {
    const percentage = (actual / expected) * 100;
    if (percentage >= 100) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

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
const handleEdit = (id) => {
    setIsEditing(id);
};

const handleDelete = (id) => {
    setReports(reports.filter((report) => report.id !== id));
};
export const ReportCard = ({ report }) => (
    <>
    <div>
        <table className=' font-[inter] bg-white rounded-lg shadow-md border-collapse p-6 border border-[#e5e7ed] m-7'>
            <tr className=''>
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>ID</th>
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>Student Name</th>
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>Course</th>
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>Mode Of Learning</th>
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>Attendance</th>
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>Week</th>
                {/* <th className='borderborder-[#e5e7ed]  p-3 text-2xl'>Status</th> */}
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>Current Topics</th>
                <th className='border border-[#e5e7ed]  p-3 text-2xl'>Comments</th>
                {/* <th className='borderborder-[#e5e7ed]  p-3 text-2xl'>Week Ending</th> */}
            </tr>
            <tr>
                <td className='  px-2 py-2 font-medium text-center text-[14px]'>Py123</td>
                <td className='  px-2 py-2 font-medium text-center text-[14px]'>{report.studentName}</td>
                <td className='  px-2 py-2 font-medium text-center text-[14px]'>{courseOptions.find(c => c.value === report.course)?.label}</td>
                <td className='  px-2 py-2 font-medium text-center text-[14px] content-center justify-items-center'>
                    {report.modeOfLearning === 'online' ? 
                        <Monitor className="text-blue-600 flex" size={14} /> : 
                        <Users className="text-green-600" size={14} />
                     }{report.modeOfLearning}</td>
                <td className={`borderborder-[#e5e7ed]  px-2 py-2 font-medium text-center text-[14px] ${getAttendanceColor(report.actualAttendance, report.weeklyExpectedClasses)}`}>{report.actualAttendance}/{report.weeklyExpectedClasses} classes</td>
                <td className='borderborder-[#e5e7ed]  px-2 py-2 font-medium text-center text-[14px]'>{report.currentWeek.charAt(0).toUpperCase() + report.currentWeek.slice(1)}</td>
                {/* <td className={`borderborder-[#e5e7ed]  px-2 py-2 font-medium text-center text-[14px] ${getStatusColor(report.status)}`}>{report.status === 'in-progress' ? 'In Progress' : 'On Hold'}</td> */}
                <td className='px-2 py-2 font-medium text-center text-[14px]'>{report.currentTopic}</td>
                <td className='px-2 py-2 font-medium text-center text-[14px]'>{report.comments}</td>
                {/* <td className='borderborder-[#e5e7ed]  px-2 py-2 font-medium text-center text-[14px]'>{new Date(report.weekEnding).toLocaleDateString()}</td> */}
                
            </tr>
        </table>
    </div>
    
    {/* <div className="bg-white rounded-lg shadow-md p-6 border-l-4border-[#e5e7ed]  m-7">
     
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <User className="text-gray-600" size={20} />
          <div>
           
            <h3 className= font-medium text-center"text-[14px] font-semibold text-gray-800">{report.studentName}</h3>
            <div className="flex items-center gap-2 mt-1">
              {report.modeOfLearning === 'online' ? 
                <Monitor className="text-blue-600" size={14} /> : 
                <Users className="text-green-600" size={14} />
              }
              <span className="text-sm text-gray-600 capitalize">{report.modeOfLearning}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(report.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Link to={`/editreport/${report.id}`}><Edit2 size={16} /></Link>
          </button>
          <button
            onClick={() => handleDelete(report.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="text-purple-600" size={16} />
            <span className="font-medium text-gray-700">Course:</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {courseOptions.find(c => c.value === report.course)?.label}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={16} />
            <span className="font-medium text-gray-700">Week:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {report.currentWeek.charAt(0).toUpperCase() + report.currentWeek.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="text-orange-600" size={16} />
            <span className="font-medium text-gray-700">Attendance:</span>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getAttendanceColor(report.actualAttendance, report.weeklyExpectedClasses)}`}>
              {report.actualAttendance}/{report.weeklyExpectedClasses} classes
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="flex items-center gap-1">
              {getStatusIcon(report.status)}
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(report.status)}`}>
                {report.status === 'in-progress' ? 'In Progress' : 'On Hold'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>Week ending: {new Date(report.weekEnding).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <BookOpen className="text-indigo-600 mt-1" size={16} />
          <div>
            <span className="font-medium text-gray-700">Current Topic:</span>
            <p className="text-gray-800 mt-1 font-medium">{report.currentTopic}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        <MessageSquare className="text-green-600 mt-1" size={16} />
        <div>
          <span className="font-medium text-gray-700">Comments:</span>
          <p className="text-gray-600 mt-1">{report.comments}</p>
        </div>
      </div>
    </div> */}
    </>
);