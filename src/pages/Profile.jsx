import React, { useState, useEffect } from "react";
import { FiEdit3, FiSave, FiEye, FiEyeOff, FiKey } from "react-icons/fi";
import api from "../services/api";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");
        
        if (response.data) {
          console.log("User Data:", response.data);
          const data = {
            fullName: response.data.name || "",
            email: response.data.email || "",
            role: response.data.role || "",
          };
          setUserData(data);
          setFormData(prev => ({
            ...prev,
            fullName: data.fullName,
            email: data.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate passwords as user types
    if (name === 'newPassword' || name === 'confirmPassword') {
      validatePasswords(name === 'newPassword' ? value : formData.newPassword, 
                       name === 'confirmPassword' ? value : formData.confirmPassword);
    }
  };

  const validatePasswords = (newPass, confirmPass) => {
    const errors = { ...passwordErrors };
    
    if (newPass && newPass.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    } else {
      errors.newPassword = "";
    }

    if (confirmPass && newPass !== confirmPass) {
      errors.confirmPassword = "Passwords don't match";
    } else {
      errors.confirmPassword = "";
    }

    setPasswordErrors(errors);
  };

  const isPasswordValid = () => {
    return formData.currentPassword && 
           formData.newPassword && 
           formData.newPassword === formData.confirmPassword &&
           formData.newPassword.length >= 6 &&
           !passwordErrors.newPassword &&
           !passwordErrors.confirmPassword;
  };

  const handlePasswordChange = async () => {
    try {
      const response = await api.put("/auth/update-profile", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setIsChangingPassword(false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordErrors(prev => ({
        ...prev,
        currentPassword: "Current password is incorrect"
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        name: formData.fullName,
        email: formData.email,
      };

      const response = await api.put("/auth/update-profile", dataToSend);
      if (response.data) {
        setUserData({
          fullName: formData.fullName,
          email: formData.email,
          role: userData.role,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isChangingPassword
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                <FiKey className="w-4 h-4 mr-2" />
                {isChangingPassword ? "Cancel Password" : "Change Password"}
              </button>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSubmit();
                  } else {
                    setIsEditing(true);
                  }
                }}
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
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-1">{userData.fullName}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium px-1">{userData.email}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Role
                    </label>
                    <p className="text-gray-800 font-medium px-1">{userData.role}</p>
                  </div>
                </div>

                {isChangingPassword && (
                  <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-500">
                        Change Password
                      </label>
                      {isPasswordValid() && (
                        <button
                          onClick={handlePasswordChange}
                          className="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200"
                        >
                          <FiKey className="w-4 h-4 mr-2" />
                          Update Password
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type={showPassword.current ? "text" : "password"}
                          name="currentPassword"
                          placeholder="Current Password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            passwordErrors.currentPassword 
                              ? "border-red-300 focus:border-red-500" 
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.current ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword}</p>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword.new ? "text" : "password"}
                          name="newPassword"
                          placeholder="New Password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            passwordErrors.newPassword 
                              ? "border-red-300 focus:border-red-500" 
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.new ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword}</p>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm New Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            passwordErrors.confirmPassword 
                              ? "border-red-300 focus:border-red-500" 
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.confirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>
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
