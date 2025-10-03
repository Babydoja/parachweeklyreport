import React, { useEffect, useState } from "react";
import { User, Clock, CheckCircle, Pause } from "lucide-react";
import axios from "axios";
import API from "../api/api";

export default function StatsCards() {
  const [stats, setStats] = useState({
    total_students: 0,
    active_students: 0,
    on_hold_students: 0,
    attendance_rate: 0,
  });
  const [courses, setCourses] = useState([])
// /dashboard-stats/

  const getAllStudent = async() =>{
    try {
        const res = await API.get('/dashboard-stats/')
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error); 
      }
  }
  useEffect(() => {
      getAllStudent()
  }, []);

   

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

   useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.total_students}
            </p>
          </div>
          <User className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Students</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.active_students}
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
              {stats.on_hold_students}
            </p>
          </div>
          <Pause className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      {/* <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.attendance_rate}%
            </p>
          </div>
          <Clock className="h-8 w-8 text-purple-600" />
        </div>
      </div> */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">All Courses</p>
            <p className="text-2xl font-bold text-purple-600">
              {courses.length}
            </p>
          </div>
          <Clock className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
}
