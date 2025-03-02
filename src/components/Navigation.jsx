// import React from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";

// // Define navigation links array
// const navLinks = [
//   { id: 1, path: "/", label: "Dashboard" },
//   { id: 2, path: "/clients", label: "Clients" },
//   { id: 3, path: "/agents", label: "Agents" },
//   { id: 4, path: "/profile", label: "Profile" },
//   { id: 5, path: "/settings", label: "Settings" },
//   { id: 6, path: "/logout", label: "Logout" },
// ];

// function Navigation({ isOpen, toggleMenu }) {
//   const darkMode = useSelector((state) => state.theme.darkMode);

//   return (
//     <div>
//       {/* Navigation Links */}
//       <nav
//         className={`fixed left-0 top-[60px] h-[calc(100vh-60px)] w-44 ${
//           darkMode ? "bg-gray-800" : "bg-gray-50"
//         } p-5 shadow-md transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <ul className="list-none m-0 p-0 h-full flex flex-col justify-between">
//           {navLinks.map((link) => (
//             <li key={link.id} className="my-3">
//               <Link
//                 to={link.path}
//                 className={`block p-3 rounded-lg text-gray-700 ${
//                   darkMode ? "dark:text-white" : "text-gray-700"
//                 } hover:text-gray-900 dark:hover:text-white text-base no-underline`}
//                 onClick={toggleMenu} // Close menu on link click
//               >
//                 {link.label}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default Navigation;
import React from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaUserFriends,
  FaUserTie,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";

const navLinks = [
  { id: 1, path: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
  {
    id: 2,
    path: "/clients",
    label: "Clients",
    icon: <HiOutlineClipboardList />,
  },
  { id: 3, path: "/agents", label: "Agents", icon: <FaUserFriends /> },
  { id: 4, path: "/profile", label: "Profile", icon: <FaUser /> },
  { id: 5, path: "/settings", label: "Settings", icon: <FaCog /> },
  { id: 6, path: "/logout", label: "Logout", icon: <FaSignOutAlt /> },
];

function Navigation({ isOpen, toggleMenu }) {
  return (
    <div>
      {/* Sidebar Navigation */}
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
          {navLinks.map((link) => (
            <li key={link.id}>
              <Link
                to={link.path}
                className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-lg font-medium hover:bg-gray-300 transition"
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
