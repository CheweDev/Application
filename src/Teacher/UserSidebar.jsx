import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { FiGrid, FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaBook, FaUsersCog } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const sessionClear = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const openModal = () => {
    const modal = document.getElementById("logout_modal");
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("logout_modal");
    if (modal) modal.close();
  };

  return (
    <aside className="flex flex-col md:flex-row max-h-screen lg:fixed lg:h-screen overflow-y-auto">
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#171e29] text-white z-40 border-b border-[#2a3441]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-[#2a3441]"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="text-xl font-bold">MCES</div>
          <img
            src="logo.png"
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-gray-600"
          />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden mt-14"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static flex flex-col h-screen bg-[#1e2530] text-gray-300 w-full md:w-64 shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-y-14 md:translate-y-0"
            : "-translate-y-full md:translate-y-0"
        } top-0 left-0 overflow-y-auto max-h-[calc(100vh-56px)] md:max-h-screen`}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-3">
          <img
            src="logo.png"
            alt="Brand Logo"
            className="h-20 w-20 object-contain"
          />
          <h1 className="text-xl font-bold text-white">
            MCES SF10 Learners
            <span className="block text-sm font-normal">
              Permanent Academic Records
            </span>
          </h1>
        </div>
        <div className="border-t mt-5 border-[#3c4a5c]"></div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1 text-sm">
            <li>
              <NavLink
                to="/user-dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 ${
                    isActive ? "bg-green-400 text-white" : "hover:bg-[#2a3441]"
                  }`
                }
              >
                <FiGrid className="mr-3" size={16} />
                User Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/student"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 ${
                    isActive ? "bg-green-400 text-white" : "hover:bg-[#2a3441]"
                  }`
                }
              >
                <FaBook className="mr-3" size={16} />
                Academic Grades
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/request"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 ${
                    isActive ? "bg-green-400 text-white" : "hover:bg-[#2a3441]"
                  }`
                }
              >
                <FaUsersCog className="mr-3" size={16} />
                SF10 Request
              </NavLink>
            </li>
            <li>
              <div
                className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-[#2a3441]"
                onClick={openModal}
              >
                <RiLogoutCircleLine className="mr-3" size={16} />
                Sign out
              </div>
            </li>
          </ul>
        </nav>

        <div className="px-4 py-2 text-xs text-gray-500 border-t border-[#3c4a5c]">
          <p>©2025 Developed by BSIT 2025</p>
        </div>
      </div>

      {/* Logout Modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-base">Confirm Action</h3>
          <p className="py-4">Are you sure you want to sign out?</p>
          <div className="flex justify-end">
            <button
              className="btn btn-error text-white flex items-center"
              onClick={sessionClear}
            >
              <RiLogoutCircleLine className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </dialog>
    </aside>
  );
};

export default UserSidebar;
