import React, { useState } from 'react';
import ReportsList from '../component/ReportsList';
import Header from '../component/Header';
import StatsCards from '../component/StatsCards';
import {Plus} from 'lucide-react'
import { Link } from 'react-router-dom';

const TutorReportDashboard = () => {
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