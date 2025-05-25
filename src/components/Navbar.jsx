import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo or Dashboard Link */}
          <div className="flex-shrink-0">
            <Link
              to="/dashboard"
              className="text-2xl font-bold text-[#03C9D7] hover:text-[#028b99]"
            >
              Dashboard
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-8">
            <Link
              to="/category"
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#03C9D7] hover:bg-gray-100"
            >
              Category
            </Link>
            <Link
              to="/expense"
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#03C9D7] hover:bg-gray-100"
            >
              Expenses
            </Link>
          </div>

          {/* Right side - User info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
              {firstName} {lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-[#03C9D7] text-white text-sm rounded-md hover:bg-[#028b99] transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#03C9D7] hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          <Link
            to="/category"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#03C9D7] hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Category
          </Link>
          <Link
            to="/expense"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#03C9D7] hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Expenses
          </Link>
          <div className="border-t border-gray-200 mt-2 pt-2 flex items-center justify-between px-3">
            <span className="text-gray-700 font-medium">
              {firstName} {lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-[#03C9D7] text-white rounded-md hover:bg-[#028b99] transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
