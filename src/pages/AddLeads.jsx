import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { FiUser, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const AddLeads = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    purpose: "",
    remarks: "",
    potential: [], // Changed from ["Warm"] to empty array
    status: "",
    requirement: "",
    budget: "",
    source: "",
    date: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      return date.toISOString().split("T")[0];
    })(),
    favourite: false,
    autostatus: "new",
    schedule: "",
  });

  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDirtyFields((prev) => ({ ...prev, [name]: true }));

    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === "potential") {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields and phone number
    const requiredFields = ["name", "phone"];
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

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && value) {
      if (value.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone: undefined,
        }));
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
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    className={`w-full px-3 py-2.5 bg-white border ${
                      dirtyFields.phone && errors.phone
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-lg text-sm text-gray-800`}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength="10"
                    required
                  />
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
                    className={`w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 appearance-none`}
                  >
                    <option value="" disabled>
                      Select purpose
                    </option>
                    <option value="Investment">Investment</option>
                    <option value="User">User</option>
                  </select>
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
                    Budget
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget || ""}
                    onChange={handleChange}
                    placeholder="Enter budget"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  />
                </div>

                {/* Source Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Source
                  </label>
                  <select
                    name="source"
                    value={formData.source || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  >
                    <option value="" disabled>
                      Select source
                    </option>
                    <option value="walkin">Walk-In</option>
                    <option value="portals">Portals</option>
                    <option value="meta_ads">Meta Ads</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="cp">CP</option>
                    <option value="newspaper_ads">Newspaper Ads</option>
                    <option value="hoardings">Hoardings/Banner</option>
                    <option value="reference">Reference</option>
                  </select>
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
                    <option value="" disabled>
                      Select status
                    </option>
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
