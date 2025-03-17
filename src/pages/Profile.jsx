import React, { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const randomSeed = Math.random().toString(36).substring(7);
  const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${randomSeed}`;

  return (
    <div className="md:ml-52 pt-[60px] md:pt-[120px] flex flex-col h-full md:px-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-700">User Profile</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-md transition-colors ${
            isEditing
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
      <div className="p-4 w-full mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-gray-100 shadow-lg bg-gray-50">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Change Photo
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Example of one editable field, repeat for others */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full p-1 border rounded text-gray-800 font-medium"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">John Doe</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full p-1 border rounded text-gray-800 font-medium"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      john@example.com
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="text-gray-800 font-medium">Channel Partner</p>
                </div>
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="text-gray-800 font-medium">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </p>
                </div> */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-800 font-medium">+91 234 567 890</p>
                </div>
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-800 font-medium">New York, USA</p>
                </div> */}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">About</p>
                {isEditing ? (
                  <textarea
                    defaultValue="Experienced software engineer with a passion for creating elegant solutions to complex problems. Specialized in web development and user interface design."
                    className="w-full p-2 border rounded text-gray-800 min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-800">
                    Experienced software engineer with a passion for creating
                    elegant solutions to complex problems. Specialized in web
                    development and user interface design.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
