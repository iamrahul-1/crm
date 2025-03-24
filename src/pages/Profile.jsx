import React, { useState, useRef } from "react";
import { FiEdit3, FiSave, FiCamera } from "react-icons/fi";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const randomSeed = Math.random().toString(36).substring(7);
  const avatarUrl = profileImage || `https://api.dicebear.com/6.x/adventurer/svg?seed=${randomSeed}`;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-52 pt-24 md:pt-28 px-3 sm:px-6 md:px-8 pb-8">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Profile Settings
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isEditing
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isEditing ? (
                <>
                  <FiSave className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start space-y-4 pb-6 lg:pb-0 border-b lg:border-b-0 border-gray-100">
                  <div className="relative group">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg bg-gray-50">
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      onClick={handleImageClick}
                      className="absolute bottom-2 right-2 p-2.5 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiCamera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center lg:text-left">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">John Doe</h2>
                    <p className="text-sm text-gray-500">Channel Partner</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue="John Doe"
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium px-1">John Doe</p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          defaultValue="john@example.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium px-1">john@example.com</p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Role
                      </label>
                      <p className="text-gray-800 font-medium px-1">Channel Partner</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          defaultValue="+91 234 567 890"
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium px-1">+91 234 567 890</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      About
                    </label>
                    {isEditing ? (
                      <textarea
                        defaultValue="Experienced software engineer with a passion for creating elegant solutions to complex problems. Specialized in web development and user interface design."
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[120px] resize-y"
                      />
                    ) : (
                      <p className="text-gray-800 px-1">
                        Experienced software engineer with a passion for creating elegant
                        solutions to complex problems. Specialized in web development and
                        user interface design.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
