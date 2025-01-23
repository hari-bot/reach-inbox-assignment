import React, { useState, useEffect, useRef } from "react";
import { CiLogout } from "react-icons/ci";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Navbar = ({ userInfo }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("googleToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          {userInfo ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-white hover:text-pink-200 transition duration-300"
              >
                <img
                  src={userInfo.picture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:inline">{userInfo.name}</span>
                {isDropdownOpen ? (
                  <FiChevronUp className="text-xl" />
                ) : (
                  <FiChevronDown className="text-xl" />
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white w-full text-left transition duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <CiLogout className="text-xl" />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-white">Loading...</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
