import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { FiUser, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const AddAgent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "",
    companyRole: "",
    ownerName: "",
    ownerContact: "",
    designation: "",
    firmName: "",
  });

  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDirtyFields((prev) => ({ ...prev, [name]: true }));

    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === "ownerContact") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields based on role and companyRole
    const newErrors = {};

    // Common required fields
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Company specific validations
    if (formData.role === "company") {
      if (!formData.companyRole) {
        newErrors.companyRole = "Company role is required";
      }
      if (formData.companyRole === "employee") {
        if (!formData.ownerName) {
          newErrors.ownerName = "Owner name is required";
        }
        if (!formData.ownerContact) {
          newErrors.ownerContact = "Owner contact is required";
        }
        if (!formData.designation) {
          newErrors.designation = "Designation is required";
        }
        if (!formData.firmName) {
          newErrors.firmName = "Firm name is required";
        }
      }
    }

    // Phone number validations
    if (newErrors.phone) {
      newErrors.phone = "Phone number is required";
    }
    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (formData.ownerContact && formData.ownerContact.length !== 10) {
      newErrors.ownerContact = "Owner contact must be 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/cp", formData);
      toast.success("Channel Partner added successfully");
      navigate("/cp");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add channel partner"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

    if (name === "ownerContact" && value) {
      if (value.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          ownerContact: "Owner contact must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          ownerContact: undefined,
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Add New Channel Partner
          </h1>

          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
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

                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
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

                {/* Role */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 bg-white border ${
                      dirtyFields.role && errors.role
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-lg text-sm text-gray-800`}
                    required
                  >
                    <option value="">Select role</option>
                    <option value="company">Company</option>
                    <option value="individual">Individual</option>
                  </select>
                  {dirtyFields.role && errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Company Information - Conditional */}
            {formData.role === "company" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <FiEdit2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-base font-medium text-gray-800">
                    Company Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Company Role */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Company Role
                    </label>
                    <select
                      name="companyRole"
                      value={formData.companyRole}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 bg-white border ${
                        dirtyFields.companyRole && errors.companyRole
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-lg text-sm text-gray-800`}
                      required
                    >
                      <option value="">Select company role</option>
                      <option value="owner">Owner</option>
                      <option value="employee">Employee</option>
                    </select>
                    {dirtyFields.companyRole && errors.companyRole && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.companyRole}
                      </p>
                    )}
                  </div>

                  {/* Employee Specific Information - Conditional */}
                  {formData.companyRole === "employee" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Owner Name */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Owner Name
                        </label>
                        <input
                          type="text"
                          name="ownerName"
                          value={formData.ownerName}
                          onChange={handleChange}
                          placeholder="Enter owner's name"
                          className={`w-full px-3 py-2.5 bg-white border ${
                            dirtyFields.ownerName && errors.ownerName
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-lg text-sm text-gray-800`}
                          required
                        />
                        {dirtyFields.ownerName && errors.ownerName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.ownerName}
                          </p>
                        )}
                      </div>

                      {/* Owner Contact */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Owner Contact
                        </label>
                        <input
                          type="tel"
                          name="ownerContact"
                          value={formData.ownerContact}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter owner's contact"
                          className={`w-full px-3 py-2.5 bg-white border ${
                            dirtyFields.ownerContact && errors.ownerContact
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-lg text-sm text-gray-800`}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength="10"
                          required
                        />
                        {dirtyFields.ownerContact && errors.ownerContact && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.ownerContact}
                          </p>
                        )}
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Designation
                        </label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          placeholder="Enter designation"
                          className={`w-full px-3 py-2.5 bg-white border ${
                            dirtyFields.designation && errors.designation
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-lg text-sm text-gray-800`}
                          required
                        />
                        {dirtyFields.designation && errors.designation && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.designation}
                          </p>
                        )}
                      </div>

                      {/* Firm Name */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Firm Name
                        </label>
                        <input
                          type="text"
                          name="firmName"
                          value={formData.firmName}
                          onChange={handleChange}
                          placeholder="Enter firm name"
                          className={`w-full px-3 py-2.5 bg-white border ${
                            dirtyFields.firmName && errors.firmName
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-lg text-sm text-gray-800`}
                          required
                        />
                        {dirtyFields.firmName && errors.firmName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.firmName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate("/cp")}
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
                  "Save Channel Partner"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAgent;
