import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FiX,
  FiUser,
  FiPhone,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";

const EditCpModal = ({ cp, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: cp.name || "",
    phone: cp.phone || "",
    role: cp.role || "individual",
    companyRole: cp.companyRole || "",
    date: cp.date
      ? new Date(cp.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
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
      // Convert to number for the backend
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
    const requiredFields = ["name", "phone", "role"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
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

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Edit Channel Partner</h2>
            <p className="text-sm text-gray-500">
              Update channel partner information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 pt-0 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
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
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-50 rounded-lg">
                  <FiBriefcase className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Role Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                    required
                  >
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                  </select>
                </div>

                {/* Company Role - Conditional */}
                {formData.role === "company" && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Company Role
                    </label>
                    <input
                      type="text"
                      name="companyRole"
                      value={formData.companyRole}
                      onChange={handleChange}
                      placeholder="Enter company role"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                      required
                    />
                  </div>
                )}

                {/* Date Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

EditCpModal.propTypes = {
  cp: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    role: PropTypes.string,
    companyRole: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditCpModal;
