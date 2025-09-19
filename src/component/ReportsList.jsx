import React, { useState } from 'react';
import { ReportCard } from './ReportCard'
import { EditableReport } from './EditableReport'
import { FileText} from 'lucide-react';
export default function ReportsList() {
    const [isEditing, setIsEditing] = useState(null);
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
              weekEnding: "2025-09-12"
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
              weekEnding: "2025-09-12"
            }
    ]);
  return (
    <div>
        {/* Reports List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 m-10">Weekly Reports</h2>
          {reports.map((report) => (
            <div key={report.id}>
              {isEditing === report.id ? (
                <EditableReport report={report} />
              ) : (
                <ReportCard report={report} />
              )}
            </div>
          ))}
          
          {reports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-600">Start by adding your first student report</p>
            </div>
          )}
        </div>
    </div>
  )
}
