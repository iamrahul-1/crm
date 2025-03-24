import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FiUser,
  FiPhone,
  FiTarget,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";

const AddLeads = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    purpose: "",
    remarks: "",
    status: "warm",
    scheduleTime: "today",
    customDate: "",
  });

  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mark field as dirty on first change
    if (!dirtyFields[name]) {
      setDirtyFields((prev) => ({
        ...prev,
        [name]: true,
      }));
    }

    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

      if (sanitizedValue.length !== 0 && !validatePhone(sanitizedValue)) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields and phone number
    const requiredFields = ["name", "phone", "purpose"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // Add phone validation
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.post("/leads", formData);
      toast.success("Lead added successfully!");
      navigate("/leads/new");
    } catch (error) {
      if (error.response?.data?.field === "phone") {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number already exists",
        }));
        // Removed duplicate toast.error here
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to add lead. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Add New Lead
          </h1>

          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full px-3 py-2.5 bg-white border ${
                      dirtyFields.name && errors.name
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-lg text-sm text-gray-800`}
                    required
                  />
                  {dirtyFields.name && errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10 digit number"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                        dirtyFields.phone && errors.phone
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-lg text-sm text-gray-800`}
                      required
                    />
                  </div>
                  {dirtyFields.phone && errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Purpose Input - Changed to Dropdown */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Purpose
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 bg-white border ${
                      dirtyFields.purpose && errors.purpose
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-lg text-sm text-gray-800 appearance-none`}
                    required
                  >
                    <option value="" disabled>
                      Select purpose
                    </option>
                    <option value="Investment">Investment</option>
                    <option value="User">User</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                  {dirtyFields.purpose && errors.purpose && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.purpose}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Classification */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-50 rounded-lg">
                  <FiTarget className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Lead Classification
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Lead Potential Radio Buttons */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Lead Potential
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["hot", "warm", "cold", "not relevant"].map(
                      (potential) => (
                        <label
                          key={potential}
                          className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            id={`potential-${potential}`}
                            name="status"
                            value={potential}
                            checked={formData.status === potential}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="capitalize text-sm text-gray-700">
                            {potential}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Schedule Lead Options */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Schedule Lead
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["today", "tomorrow", "weekend", "Custom"].map(
                      (scheduleOption) => (
                        <label
                          key={scheduleOption}
                          className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            id={`schedule-${scheduleOption}`}
                            name="scheduleTime"
                            value={scheduleOption}
                            checked={formData.scheduleTime === scheduleOption}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="capitalize text-sm text-gray-700">
                            {scheduleOption}
                          </span>
                        </label>
                      )
                    )}
                  </div>

                  {/* Calendar appears below when Custom is selected */}
                  {formData.scheduleTime === "Custom" && (
                    <div className="mt-4 bg-white p-5 border border-gray-200 rounded-lg shadow-sm w-full transition-all duration-300 animate-fadeIn">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FiCalendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                          Select Custom Date
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          name="customDate"
                          value={formData.customDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                          min={new Date().toISOString().split("T")[0]}
                          required={formData.scheduleTime === "Custom"}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Select a date when you want to follow up with this lead
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 rounded-lg">
                  <FiMessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Additional Information
                </h2>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Add any additional notes about this lead..."
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 min-h-[120px] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/leads/all")}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeads;
