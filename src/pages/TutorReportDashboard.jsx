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

       
      </div>
    </div>
  );
};

export default TutorReportDashboard;