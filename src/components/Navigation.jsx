import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaUserFriends,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";

const leadDropdownLinks = [
  { id: 1, path: "/leads/all", label: "All Leads" },
  { id: 2, path: "/leads/new", label: "New Leads" },
  { id: 3, path: "/leads/add", label: "Add Leads" },
  { id: 4, path: "/leads/rejected", label: "Rejected Leads" },
  {
    id: 5,
    path: "/leads/schedule",
    label: "Schedule Visits",
    subLinks: [
      { id: 6, path: "/leads/schedule/add", label: "Add Leads" },
      { id: 7, path: "/leads/schedule/delete", label: "Delete Leads" },
    ],
  },
];

const navLinks = [
  { id: 3, path: "/agents", label: "Channel Partner", icon: <FaUserFriends /> },
  { id: 4, path: "/profile", label: "Profile", icon: <FaUser /> },
  { id: 5, path: "/settings", label: "Settings", icon: <FaCog /> },
  { id: 6, path: "/logout", label: "Logout", icon: <FaSignOutAlt /> },
];

function Navigation({ isOpen, toggleMenu }) {
  const [isLeadsOpen, setLeadsOpen] = useState(false);
  const [isScheduleOpen, setScheduleOpen] = useState(false);

  return (
    <div>
      <nav
        className={`fixed left-0 top-0 h-screen w-52 bg-gray-100 text-gray-800 p-5 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 text-black md:hidden"
          onClick={toggleMenu}
        >
          <FaTimes size={20} />
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
              <Link
                to={link.path}
                className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                onClick={toggleMenu}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
