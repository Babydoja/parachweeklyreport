import React, { useState } from "react";
import { Home, User, Settings, LogOut, Menu , X ,Calendar, LibraryBig ,Pen,School,} from "lucide-react"; 
import { Link } from "react-router-dom";
import parachlogo from '../assets/parachlogo.png'
import logo from '../assets/logo.png'
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
          <div className="">
            {isOpen ? null : <img src={logo} alt="logo" className="w-[30px]" /> }
          </div>
          {isOpen && <img src={parachlogo}/>}
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
            <Link  to='/globaltable' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
              <User size={20} />
              {isOpen && <p>Shedules</p>} 
            </Link>
          </li>
          {/* <li>
            <Link to='/reportlist' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Weekly Reports </span>} 
            </Link>
          </li> */}
          <li>
            <Link to='/courses' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>All Courses </span>} 
            </Link>
          </li>
          <li>
            <Link to='/attendance' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Student Attendance </span>} 
            </Link>
          </li>
          <li>
            <Link to='/class' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Class </span>} 
            </Link>
          </li>
          <li>
            <Link to='/topics' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Topics </span>} 
            </Link>
          </li>
          <li>
            <Link to='/globaltable' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Global Timetable </span>} 
            </Link>
          </li>
          <li>
            <Link to='/tutortable' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Tutor Timetable </span>} 
            </Link>
          </li>
          <li>
            <Link to='/students' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>All Students </span>} 
            </Link>
          </li>
          <li>
            <Link to='/tutorreport' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>Tutor Report </span>} 
            </Link>
          </li>
          <li>
            <Link to='/tutors' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">   
                <Calendar size={20} />
                {isOpen && <span>All Parach Tutors </span>} 
            </Link>
          </li>
          {/* <li >
            <Link to='/addreport' className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                <Plus size={20} />
                {isOpen && <span>Add New Student Report</span>}
            </Link>
          </li> */}
          <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </li>
        </ul>
      </div>
    </div>
  );
}
