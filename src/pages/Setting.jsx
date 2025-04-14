import React, { useState } from "react";
import {
  FiSearch,
  FiUsers,
  FiLock,
  FiCheck,
  FiUpload,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../services/api";
import Excel from "../components/Excel";

const Setting = () => {
  const [userList, setUserList] = useState([
    {
      id: 1,
      name: "Nilesh Tiwari",
      email: "nilesh@example.com",
      role: "Admin",
    },
    {
      id: 2,
      name: "Naishal",
      email: "naishal@example.com",
      role: "Channel Partner",
    },
    { id: 3, name: "Fenil Shah", email: "fenil@example.com", role: "Manager" },
  ]);
  const [filterText, setFilterText] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const handleRoleChange = (userId, newRole) => {
    setUserList((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleExcelDataLoaded = (data) => {
    // Handle the uploaded data here
    console.log('Excel data loaded:', data);
    // You can update the user list or show a success message
  };

  const filteredUsers = userList.filter((user) => {
    const matchesText =
      user.name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesText && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            System Settings
          </h1>

          <div className="grid gap-6">
            <Excel onDataLoaded={handleExcelDataLoaded} />

            {/* Role Management */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Role Management
                </h2>
              </div>

              {/* Filter Section */}
              <div className="space-y-3 mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>
                <select
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="channel partner">Channel Partner</option>
                  <option value="read only">Read Only</option>
                </select>
              </div>

              <div className="overflow-x-auto -mx-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Name
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Email
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 px-6">
                          <span className="text-sm text-gray-800">
                            {user.name}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <span className="text-sm text-gray-600">
                            {user.email}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <select
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Channel Partner">
                              Channel Partner
                            </option>
                            <option value="Read Only">Read Only</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No users found matching your filters
                  </div>
                )}
              </div>
            </div>

            {/* Permission Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 rounded-lg">
                  <FiLock className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Permission Settings
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Manager Access
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">
                        View all leads
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">Edit leads</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">Export data</span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6 md:border-t-0 md:pt-0">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Channel Partner Access
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">
                        View assigned leads
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Edit assigned leads
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Export data</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex mt-6">
              <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <FiCheck className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
