import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FiUser,
  FiPhone,
  FiTarget,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";

const AddLeads = () => {
  const navigate = useNavigate();
  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    purpose: "",
    remarks: "",
    potential: ["warm"],
    status: ["open"],
    requirement: "",
    budget: "",
    source: "",
    date: new Date().toISOString().split("T")[0], // Add current date
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }), // Add current time
    favourite: false, // Add favourite field
  });

  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});
  const [dateError, setDateError] = useState("");

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

    if (selectedDate < today) {
      setDateError("Please select today or a future date");
      return false;
    }
    setDateError("");
    return true;
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
      const phoneNumber = sanitizedValue ? parseInt(sanitizedValue, 10) : "";
      setFormData((prev) => ({ ...prev, [name]: phoneNumber }));

      if (sanitizedValue.length !== 0 && !validatePhone(sanitizedValue)) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    } else if (name === "date") {
      if (validateDate(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "potential" || name === "status") {
      // Handle array fields
      setFormData((prev) => ({ ...prev, [name]: [value] }));
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
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // Add phone validation
    if (!validatePhone(formData.phone.toString())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true); // Set loading state to true before API call
    try {
      await api.post("/leads", formData);
      toast.success("Lead added successfully!");
      navigate("/leads/new");
    } catch (error) {
      if (error.response?.data?.field === "phone") {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number already exists",
        }));
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to add lead. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const statusDisplayMap = {
    open: "Open",
    inprogress: "In Progress",
    sitevisitscheduled: "Site Visit Scheduled",
    sitevisited: "Site Visited",
    closed: "Closed",
    rejected: "Rejected",
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
                      value={formData.phone ? formData.phone.toString() : ""}
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

                {/* Purpose Input */}
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
                  {dirtyFields.purpose && errors.purpose && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.purpose}
                    </p>
                  )}
                </div>

                {/* Date Input */}
                {/* Requirement Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Requirement
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="requirement"
                      value={formData.requirement || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                    >
                      <option value="" disabled>
                        Select requirement
                      </option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                    </select>
                  </div>
                </div>

                {/* Budget Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Budget (in Cr)
                  </label>
                  <select
                    name="budget"
                    value={formData.budget || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  >
                    <option value="" disabled>
                      Select budget
                    </option>
                    <option value="50 L">50 Lakhs</option>
                    <option value="1 Cr">1 Cr</option>
                    <option value="2 Cr">2 Cr</option>
                    <option value="3 Cr">3 Cr</option>
                  </select>
                </div>

                {/* Source Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Source
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source || ""}
                    onChange={handleChange}
                    placeholder="Enter source"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  />
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

              <div className="grid grid-cols-1 gap-6">
                {/* Lead Potential */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Lead Potential
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["hot", "warm", "cold"].map((potential) => (
                      <label
                        key={potential}
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="potential"
                          value={potential}
                          checked={formData.potential[0] === potential}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="capitalize text-sm text-gray-700">
                          {potential}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status[0]}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  >
                    {Object.entries(statusDisplayMap).map(
                      ([value, display]) => (
                        <option key={value} value={value}>
                          {display}
                        </option>
                      )
                    )}
                  </select>
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

            <div className="flex gap-4 justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate("/leads/all")}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Lead"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeads;
