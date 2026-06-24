import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/target.png";


function Navbar() {
  const navigate = useNavigate();
  
  // 1. Initialize state directly from localStorage so it persists on page refreshes
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  // 2. Listen for storage changes (handles edge cases like logins in other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUserName(localStorage.getItem("userName") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 3. Complete backend disconnect on logout
  const handleLogout = () => {
    // Remove the credentials your backend issued
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    
    // Update local React state to instantly re-render the navbar
    setToken(null);
    setUserName("");

    // Optional: Redirect them to home page or login page after logout
    navigate("/login");
  };

  // Determine auth status based on the presence of your backend token
  const isLoggedIn = !!token;

  return (
    <nav className="bg-white shadow-md border-b-2 border-b-yellow-300">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        {/* Logo and Brand Section */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Placement Logo" className="h-10 w-10" />
          <span className="font-bold text-2xl">
            Placement<span className="text-blue-700">X</span>Target
          </span>
        </Link>

        {/* Dynamic Auth Actions Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="font-medium text-gray-700">
                Hello, <span className="text-blue-700 font-semibold">{userName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-red-500 cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-blue-50"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
