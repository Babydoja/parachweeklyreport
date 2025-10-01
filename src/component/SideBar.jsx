import React, { useState } from "react";
import { Home, User, Settings, LogOut, Menu , X ,Calendar, Plus} from "lucide-react"; 
import { Link } from "react-router-dom";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
    
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white h-screen p-4 duration-300 relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 bg-gray-900 border border-gray-700 rounded-full p-1"
        >
        {isOpen ?<Menu  size={20}/> : <X size={20} /> }
          
          
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-500 p-2 rounded-md">
            <Home size={24} />
          </div>
          {isOpen && <h1 className="text-xl font-bold">PARACH</h1>}
        </div>

        {/* Menu Items */}
        <ul className="space-y-6">
          <li className="">
            <Link to='/' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                <Home size={20} />
                {isOpen && <p>Dashboard</p>}
            </Link>
          </li>
          <li >
            <Link  to='/Timetable' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
              <User size={20} />
              {isOpen && <p>Shedules</p>} 
            </Link>
          </li>
          <li >
            <Link to='/reportlist' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Weekly Reports </span>} 
            </Link>
            <Link to='/courses' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>All Courses </span>} 
            </Link>
            <Link to='/attendance' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Student Attendance </span>} 
            </Link>
            <Link to='/class' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Class </span>} 
            </Link>
            <Link to='/topics' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Topics </span>} 
            </Link>
            <Link to='/globaltable' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Global Timetable </span>} 
            </Link>
            <Link to='/tutortable' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Tutor Timetable </span>} 
            </Link>
            <Link to='/students' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>All Students </span>} 
            </Link>
            <Link to='/tutorreport' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Tutor Report </span>} 
            </Link>
            <Link to='/tutors' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>All Parach Tutors </span>} 
            </Link>
          </li>
          <li >
            <Link to='/addreport' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                <Plus size={20} />
                {isOpen && <span>Add New Student Report</span>}
            </Link>
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      {/* <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
        <p className="text-gray-600 mt-2">Your main content goes here.</p>
      </div> */}
    </div>
  );
}
