import React, { useState } from "react";
import { CiLogout, CiUser, CiSettings, CiMail } from "react-icons/ci";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("googleToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="w-10 h-10"
            src="https://cdn-icons-png.flaticon.com/128/1309/1309475.png"
            alt="Logo"
          />
          <h1 className="text-2xl font-bold text-white capitalize sm:text-3xl">
            ReplyAI
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-white hover:text-pink-200 transition duration-300">
            <CiMail className="text-2xl" />
          </button>
          <button className="text-white hover:text-pink-200 transition duration-300">
            <CiSettings className="text-2xl" />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-white hover:text-pink-200 transition duration-300"
            >
              <CiUser className="text-2xl" />
              <span className="hidden md:inline">John Doe</span>
              {isDropdownOpen ? (
                <FiChevronUp className="text-xl" />
              ) : (
                <FiChevronDown className="text-xl" />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white w-full text-left transition duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <CiLogout className="text-xl" />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
