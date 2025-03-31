import React, { useState } from "react";
import { FiX, FiUser, FiPhone, FiCalendar } from "react-icons/fi";
import PropTypes from "prop-types";
import LoadingButton from "./LoadingButton";

const EditLeadModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone,
    purpose: lead.purpose,
    budget: lead.budget || "",
    source: lead.source || "",
    requirement: lead.requirement || "",
    remarks: lead.remarks || "", // Add remarks back to formData but don't display it
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

  const validateForm = () => {
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
    if (formData.phone && !validatePhone(formData.phone.toString())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-normal text-gray-800">Update Lead</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
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
                <label className="block text-sm text-gray-600 mb-2">Name</label>
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
                  <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
                )}
              </div>

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

          <div className="flex gap-4 justify-end mt-2 sticky bottom-0 bg-white py-4 border-t border-gray-100">
            <LoadingButton
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              isLoading={isSubmitting}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              isLoading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

EditLeadModal.propTypes = {
  lead: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    purpose: PropTypes.string.isRequired,
    budget: PropTypes.string,
    source: PropTypes.string,
    requirement: PropTypes.string,
    remarks: PropTypes.string, // Add this back
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLeadModal;
