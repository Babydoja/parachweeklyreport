import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./component/SideBar";
import ReportsList from "./component/ReportsList";
import AddReport from "./component/AddReport";
import { EditableReport } from "./component/EditableReport";
import TutorReportDashboard from "./pages/TutorReportDashboard";
import Courses from "./components/Courses";
import Attendance from "./components/AttendanceByStudent";
import Class from "./components/ClassManager";
import Topics from "./components/CourseTopicManager";
import Global from "./components/GlobalTimetable";
import Table from "./components/TimetableManager";
import Student from "./components/Students";
import Report from "./components/TutorReports";
import Tutors from "./components/Tutors";
import { ToastContainer } from "react-toastify";
// import ProtectedPage from "./component/ProtectedPage";
import AccessGate from "./components/AccessGate";

export default function App() {
  return (
    <AccessGate> 
      <BrowserRouter>
        <ToastContainer />
        {/* Parent Flex Container */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 ">
            <Routes>
              <Route path="/" element={<TutorReportDashboard />} />
              <Route path="/reportlist" element={<ReportsList />} />
              <Route path="/addreport" element={<AddReport />} />
              <Route path="/editreport/:id" element={<EditableReport />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/class" element={<Class />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/globaltable" element={<Global />} />
              <Route path="/tutortable" element={<Table />} />
              <Route path="/students" element={<Student />} />
              <Route path="/tutorreport" element={<Report />} />
              <Route path="/tutors" element={<Tutors />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AccessGate>
  );
}

