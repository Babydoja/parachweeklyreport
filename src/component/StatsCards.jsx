import React, { useState } from "react";
import { User, Clock, CheckCircle, Pause } from "lucide-react";

export default function StatsCards() {
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
      comments:
        "Great progress with functions. Missed one class due to illness but catching up well.",
      status: "in-progress",
      weekEnding: "2025-09-12",
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
      comments:
        "Excellent attendance and understanding. Very engaged during sessions.",
      status: "in-progress",
      weekEnding: "2025-09-12",
    },
  ]);
  const totalStudents = reports.length;
  const activeStudents = reports.filter(
    (r) => r.status === "in-progress"
  ).length;
  const onHoldStudents = reports.filter((r) => r.status === "on-hold").length;
  const totalExpectedClasses = reports.reduce(
    (sum, report) => sum + report.weeklyExpectedClasses,
    0
  );
  const totalActualAttendance = reports.reduce(
    (sum, report) => sum + report.actualAttendance,
    0
  );
  const attendanceRate =
    totalExpectedClasses > 0
      ? ((totalActualAttendance / totalExpectedClasses) * 100).toFixed(1)
      : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
          </div>
          <User className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Students</p>
            <p className="text-2xl font-bold text-green-600">
              {activeStudents}
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">On Hold</p>
            <p className="text-2xl font-bold text-yellow-600">
              {onHoldStudents}
            </p>
          </div>
          <Pause className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {attendanceRate}%
            </p>
          </div>
          <Clock className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
}
