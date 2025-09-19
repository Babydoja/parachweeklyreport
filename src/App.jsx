import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./component/SideBar";
import TutorReportDashboard from "./pages/TutorReportDashboard";
import ReportsList from "./component/ReportsList";
import AddReport from "./component/AddReport";
import { EditableReport } from "./component/EditableReport";
import Scheduler from "./component/Scheduler";


export default function App() {
  return (
    <BrowserRouter>
      {/* Parent Flex Container */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 ">
          <Routes>
            <Route path="/" element={<TutorReportDashboard />} />
            <Route path="/reportlist" element={<ReportsList/>} />
            <Route path="/addreport" element={<AddReport/>} />
             <Route path="/scheduler" element={<Scheduler/>} />
            <Route path="/editreport/:id" element={<EditableReport/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
