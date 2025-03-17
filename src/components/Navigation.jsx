import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaUserFriends,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBars,
} from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";

const leadDropdownLinks = [
  { id: 1, path: "/leads/all", label: "All Leads" },
  { id: 2, path: "/leads/new", label: "New Leads" },
  { id: 3, path: "/leads/add", label: "Add Lead" },
  { id: 4, path: "/leads/rejected", label: "Rejected Leads" },
  {
    id: 5,
    path: "/leads/schedule",
    label: "Schedule Visits",
    subLinks: [
      { id: 6, path: "/leads/schedule/today", label: "Today" },
      { id: 7, path: "/leads/schedule/weekend", label: "Weekend" },
      { id: 8, path: "/leads/schedule/tomorrow", label: "Tomorrow" },
    ],
  },
];

const navLinks = [
  { id: 3, path: "/cp", label: "Channel Partner", icon: <FaUserFriends /> },
  { id: 4, path: "/profile", label: "Profile", icon: <FaUser /> },
  { id: 5, path: "/settings", label: "Settings", icon: <FaCog /> },
  { id: 6, path: "/logout", label: "Logout", icon: <FaSignOutAlt /> },
];

function Navigation({ isOpen, toggleMenu }) {
  const navigate = useNavigate();
  const [isLeadsOpen, setLeadsOpen] = useState(false);
  const [isScheduleOpen, setScheduleOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setShowLogoutModal(false);
  };

  const LogoutModal = () => (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const navLinks = [
    { id: 3, path: "/cp", label: "Channel Partner", icon: <FaUserFriends /> },
    { id: 4, path: "/profile", label: "Profile", icon: <FaUser /> },
    { id: 5, path: "/settings", label: "Settings", icon: <FaCog /> },
    {
      id: 6,
      path: "#",
      label: "Logout",
      icon: <FaSignOutAlt />,
      onClick: () => setShowLogoutModal(true),
    },
  ];

  return (
    <div>
      {showLogoutModal && <LogoutModal />}
      <nav
        className={`fixed left-0 top-0 h-screen w-56 bg-gray-100 text-gray-800 p-5 shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 text-black md:hidden"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <ul className="mt-8 space-y-4">
          {/* Dashboard */}
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              onClick={toggleMenu}
            >
              <span className="text-xl">
                <FaTachometerAlt />
              </span>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Leads Dropdown Below Dashboard */}
          <li>
            <button
              className="flex items-center justify-between w-full py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              onClick={() => setLeadsOpen(!isLeadsOpen)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  <HiOutlineClipboardList />
                </span>
                <span>Leads</span>
              </div>
              <span>{isLeadsOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>

            {isLeadsOpen && (
              <ul className="mt-2 ml-6 space-y-2">
                {leadDropdownLinks.map((subLink) => (
                  <li key={subLink.id}>
                    {subLink.subLinks ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                          onClick={() => setScheduleOpen(!isScheduleOpen)}
                        >
                          <span>{subLink.label}</span>
                          <span>
                            {isScheduleOpen ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </span>
                        </button>
                        {isScheduleOpen && (
                          <ul className="mt-2 ml-6 space-y-2">
                            {subLink.subLinks.map((nestedLink) => (
                              <li key={nestedLink.id}>
                                <Link
                                  to={nestedLink.path}
                                  className="block py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                                  onClick={toggleMenu}
                                >
                                  {nestedLink.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        to={subLink.path}
                        className="block py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                        onClick={toggleMenu}
                      >
                        {subLink.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Other Navigation Links */}
          {navLinks.map((link) => (
            <li key={link.id}>
              {link.onClick ? (
                <button
                  onClick={() => {
                    link.onClick();
                    toggleMenu();
                  }}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition w-full text-left"
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ) : (
                <Link
                  to={link.path}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  onClick={toggleMenu}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
