import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  FiUser,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPhone,
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
    potential: ["Warm"],
    status: "", // Empty string by default
    requirement: "",
    budget: "",
    source: "",
    date: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      return date.toISOString().split("T")[0];
    })(),
    favourite: false,
    autostatus: "new", // Set to new by default
    schedule: "", // Empty string for schedule
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
      // Allow only numbers and limit to 10 digits
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === "date") {
      if (validateDate(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "potential") {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else if (name === "status") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data before submission:", formData);

    // Validate required fields and phone number
    const requiredFields = ["name", "phone", "purpose"];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (newErrors.phone) {
      newErrors.phone = "Phone number is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true); // Set loading state to true before API call
    try {
      // Create a copy of formData
      const dataToSend = { ...formData };

      // Remove status if it's empty or "new"
      if (!dataToSend.status || dataToSend.status === "new") {
        delete dataToSend.status;
      }

      console.log("Data being sent to API:", dataToSend);
      const response = await api.post("/leads", dataToSend);
      console.log("API response:", response.data);
      toast.success("Lead added successfully!");
      navigate("/leads/new");
    } catch (error) {
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.data?.field === "phone") {
        setErrors((prev) => ({
          ...prev,
          phone: error.response?.data?.message,
        }));
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to add lead. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "inprogress", label: "In Progress" },
    { value: "sitevisitscheduled", label: "Site Visit Scheduled" },
    { value: "sitevisited", label: "Site Visited" },
    { value: "closed", label: "Closed" },
    { value: "rejected", label: "Rejected" },
  ];

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
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
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
                {/* Requirement Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Requirement
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="requirement"
                      value={formData.requirement || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                    >
                      <option value="" disabled>
                        Select requirement
                      </option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
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
                  <FiEdit2 className="w-5 h-5 text-green-600" />
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
                    {["Hot", "Warm", "Cold"].map((potential) => (
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
                    value={formData.status}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, status: value }));
                    }}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 rounded-lg">
                  <FiTrash2 className="w-5 h-5 text-purple-600" />
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
