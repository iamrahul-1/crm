import React, { useState } from "react";

const Setting = () => {
  const [userList] = useState([
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
    <div className="md:ml-52 pt-[60px] md:pt-[120px] flex flex-col h-full md:px-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-700">System Settings</h3>
      <div className="p-4 w-full mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8 space-y-8">
          {/* Export Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Export Data</h4>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Export Leads</p>
                <select className="w-full p-2 border rounded text-gray-800 font-medium bg-white">
                  <option value="all">All Leads</option>
                  <option value="monthly">Favorite Leads</option>
                  <option value="weekly">Hot Leads</option>
                  <option value="custom">Warm Leads</option>
                  <option value="custom">Cold Leads</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Export
              </button>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Role Management</h4>

            {/* Filter Section */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full p-2 border rounded text-gray-800 bg-white"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <div className="w-48">
                <select
                  className="w-full p-2 border rounded text-gray-800 bg-white"
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
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 font-medium text-gray-600 pb-2 border-b">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                {/* <div>Actions</div> */}
              </div>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <div>{user.name}</div>
                  <div className="text-gray-600">{user.email}</div>
                  <div>
                    <select className="w-full p-2 border rounded text-gray-800 bg-white">
                      <option value="admin">Admin</option>
                      <option
                        value="manager"
                        selected={user.role === "Manager"}
                      >
                        Manager
                      </option>
                      <option
                        value="cp"
                        selected={user.role === "Channel Partner"}
                      >
                        Channel Partner
                      </option>
                      <option
                        value="readonly"
                        selected={user.role === "Read Only"}
                      >
                        Read Only
                      </option>
                    </select>
                  </div>
                  <div>
                    {/* <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                      Block
                    </button> */}
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No users found matching your filters
                </div>
              )}
            </div>
          </div>

          {/* Permission Settings */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Permission Settings</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Manager Access</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>View all leads</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Edit leads</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Export data</span>
                  </label>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Channel Partner Access
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>View assigned leads</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Edit assigned leads</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Export data</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
