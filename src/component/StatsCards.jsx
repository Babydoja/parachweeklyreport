import React, { useEffect, useState } from "react";
import { User, Clock, CheckCircle, Pause } from "lucide-react";
import API from "../api/api";
import Chart from "react-apexcharts";

export default function StatsCards() {
  const [stats, setStats] = useState({
    total_students: 0,
    active_students: 0,
    on_hold_students: 0,
    attendance_rate: 0,
  });

  const [courses, setCourses] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);

  // Mocked attendance trend data for the line chart
  const [attendanceTrend, setAttendanceTrend] = useState([
    { date: "2025-09-25", rate: 75 },
    { date: "2025-09-26", rate: 80 },
    { date: "2025-09-27", rate: 78 },
    { date: "2025-09-28", rate: 85 },
    { date: "2025-09-29", rate: 82 },
    { date: "2025-09-30", rate: 88 },
    { date: "2025-10-01", rate: 91 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard-stats/");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await API.get("courses/");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };

    fetchStats();
    fetchCourses();
  }, []);

  useEffect(() => {
    const present = stats.active_students;
    const absent = stats.total_students - stats.active_students;

    if (stats.total_students > 0) {
      setStatusBreakdown([
        { status: "Present", count: present },
        { status: "Absent", count: absent },
      ]);
    }
  }, [stats]);

  const donutOptions = {
    chart: { type: "donut" },
    labels: statusBreakdown.map((s) => s.status),
    colors: ["#10B981", "#F59E0B"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };

  const donutSeries = statusBreakdown.map((s) => s.count);

  const lineOptions = {
    chart: { id: "attendance-trend" },
    xaxis: {
      categories: attendanceTrend.map((d) => d.date),
      title: { text: "Date" },
    },
    yaxis: {
      title: { text: "Attendance Rate (%)" },
      min: 0,
      max: 100,
    },
    stroke: {
      curve: "smooth",
    },
    colors: ["#3B82F6"],
  };

  const lineSeries = [
    {
      name: "Attendance Rate",
      data: attendanceTrend.map((d) => d.rate),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
      {/* Stat Cards */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total_students}</p>
          </div>
          <User className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Students</p>
            <p className="text-2xl font-bold text-green-600">{stats.active_students}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">On Hold</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.on_hold_students}</p>
          </div>
          <Pause className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">All Courses</p>
            <p className="text-2xl font-bold text-purple-600">{courses.length}</p>
          </div>
          <Clock className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      {/* Donut Chart */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Breakdown</h3>
        {donutSeries.length > 0 ? (
          <Chart options={donutOptions} series={donutSeries} type="donut" height={300} />
        ) : (
          <div className="text-center text-gray-500 py-10">No breakdown data available.</div>
        )}
      </div>

      {/* Line Chart */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trend</h3>
        <Chart options={lineOptions} series={lineSeries} type="line" height={300} />
      </div>
    </div>
  );
}
