import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  { id: 3, path: "/leads/missed", label: "Missed Leads" },
  { id: 4, path: "/leads/favourite", label: "Favourite Leads" },
  {
    id: 5,
    path: "/leads/potential",
    label: "Lead Potential",
    subLinks: [
      { id: "pot1", path: "/leads/potential/hot", label: "Hot" },
      { id: "pot2", path: "/leads/potential/warm", label: "Warm" },
      { id: "pot3", path: "/leads/potential/cold", label: "Cold" },
    ],
  },
  {
    id: 6,
    path: "/leads/status",
    label: "Lead Status",
    subLinks: [
      { id: "stat1", path: "/leads/status/opened", label: "Opened" },
      { id: "stat2", path: "/leads/status/in-progress", label: "In Progress" },
      {
        id: "stat3",
        path: "/leads/status/visit-scheduled",
        label: "Site Visit Scheduled",
      },
      { id: "stat4", path: "/leads/status/visited", label: "Site Visited" },
      { id: "stat5", path: "/leads/status/closed", label: "Closed" },
    ],
  },
  {
    id: 7,
    path: "/leads/schedule",
    label: "Schedule Visits",
    subLinks: [
      { id: "sch1", path: "/leads/schedule/today", label: "Today" },
      { id: "sch2", path: "/leads/schedule/tomorrow", label: "Tomorrow" },
      { id: "sch3", path: "/leads/schedule/weekend", label: "Weekend" },
    ],
  },
  { id: 8, path: "/leads/rejected", label: "Rejected Leads" },
];

function Navigation({ isOpen, toggleMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLeadsOpen, setLeadsOpen] = useState(false);
  const [isPotentialOpen, setPotentialOpen] = useState(false);
  const [isStatusOpen, setStatusOpen] = useState(false);
  const [isScheduleOpen, setScheduleOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isActiveNestedPath = (path) => {
    return location.pathname.startsWith(path);
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setShowLogoutModal(false);
  };

  const LogoutModal = () => (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl transform transition-all">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Logout
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout from your account?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const toggleLeadsDropdown = () => {
    setLeadsOpen(!isLeadsOpen);
    // Close other dropdowns when opening leads
    setPotentialOpen(false);
    setStatusOpen(false);
    setScheduleOpen(false);
  };

  const toggleSubDropdown = (setter) => {
    // Close other sub-dropdowns when opening one
    if (setter !== setPotentialOpen) setPotentialOpen(false);
    if (setter !== setStatusOpen) setStatusOpen(false);
    if (setter !== setScheduleOpen) setScheduleOpen(false);
    setter((prev) => !prev);
  };

  const handleNavigation = (path) => {
    navigate(path);
    toggleMenu(); // Close navbar on mobile after navigation
  };

  return (
    <div>
      {showLogoutModal && <LogoutModal />}
      <nav
        className={`fixed left-0 top-0 h-screen w-64 sm:w-56 bg-white text-gray-800 shadow-xl transition-all duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        {/* Logo Area */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-100">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800"></h1>
        </div>

        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 md:hidden transition-all"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>

        <ul className="px-2 sm:px-3 py-2 sm:py-4 space-y-0.5 sm:space-y-1">
          {/* Dashboard */}
          <li>
            <Link
              to="/"
              className={`flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all group text-sm sm:text-base ${
                isActivePath("/") ? "bg-blue-200 text-blue-700" : ""
              }`}
              onClick={toggleMenu}
            >
              <span
                className={`text-base sm:text-lg ${
                  isActivePath("/")
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                <FaTachometerAlt />
              </span>
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>

          {/* Leads Dropdown */}
          <li>
            <button
              className={`flex items-center justify-between w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all group text-sm sm:text-base ${
                isLeadsOpen ? "bg-gray-50 text-gray-900" : ""
              }`}
              onClick={toggleLeadsDropdown}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`text-base sm:text-lg ${
                    isActiveNestedPath("/leads")
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  <HiOutlineClipboardList />
                </span>
                <span className="font-medium">Leads</span>
              </div>
              <span className="text-gray-400 group-hover:text-gray-600">
                {isLeadsOpen ? (
                  <FaChevronUp size={12} />
                ) : (
                  <FaChevronDown size={12} />
                )}
              </span>
            </button>

            {isLeadsOpen && (
              <ul className="mt-0.5 sm:mt-1 ml-3 sm:ml-4 space-y-0.5 sm:space-y-1">
                {leadDropdownLinks.map((subLink) => (
                  <li key={subLink.id}>
                    {subLink.subLinks ? (
                      <>
                        <button
                          className={`flex items-center justify-between w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm ${
                            (subLink.path === "/leads/potential" &&
                              isPotentialOpen) ||
                            (subLink.path === "/leads/status" &&
                              isStatusOpen) ||
                            (subLink.path === "/leads/schedule" &&
                              isScheduleOpen)
                              ? "bg-gray-50 text-gray-900"
                              : ""
                          } ${
                            isActiveNestedPath(subLink.path)
                              ? "bg-blue-200 text-blue-700"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSubDropdown(
                              subLink.path === "/leads/potential"
                                ? setPotentialOpen
                                : subLink.path === "/leads/status"
                                ? setStatusOpen
                                : setScheduleOpen
                            )
                          }
                        >
                          <span className="font-medium">{subLink.label}</span>
                          <span
                            className={`${
                              isActiveNestedPath(subLink.path)
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          >
                            {(subLink.path === "/leads/potential" &&
                              isPotentialOpen) ||
                            (subLink.path === "/leads/status" &&
                              isStatusOpen) ||
                            (subLink.path === "/leads/schedule" &&
                              isScheduleOpen) ? (
                              <FaChevronUp size={10} />
                            ) : (
                              <FaChevronDown size={10} />
                            )}
                          </span>
                        </button>
                        {(subLink.path === "/leads/potential" &&
                          isPotentialOpen) ||
                        (subLink.path === "/leads/status" && isStatusOpen) ||
                        (subLink.path === "/leads/schedule" &&
                          isScheduleOpen) ? (
                          <ul className="mt-0.5 sm:mt-1 ml-3 sm:ml-4 space-y-0.5 sm:space-y-1">
                            {subLink.subLinks.map((nestedLink) => (
                              <li key={nestedLink.id}>
                                <Link
                                  to={nestedLink.path}
                                  className={`block py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm ${
                                    isActivePath(nestedLink.path)
                                      ? "bg-blue-200 text-blue-700"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleNavigation(nestedLink.path);
                                    toggleMenu(); // Close navbar on mobile
                                  }}
                                >
                                  {nestedLink.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </>
                    ) : (
                      <Link
                        to={subLink.path}
                        className={`block py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm ${
                          isActivePath(subLink.path)
                            ? "bg-blue-200 text-blue-700"
                            : ""
                        }`}
                        onClick={() => {
                          handleNavigation(subLink.path);
                          toggleMenu(); // Close navbar on mobile
                        }}
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
                  className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all group w-full text-left text-sm sm:text-base"
                >
                  <span className="text-base sm:text-lg text-gray-400 group-hover:text-gray-600">
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                </button>
              ) : (
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all group text-sm sm:text-base ${
                    isActivePath(link.path) ? "bg-blue-200 text-blue-700" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  <span
                    className={`text-base sm:text-lg ${
                      isActivePath(link.path)
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
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
