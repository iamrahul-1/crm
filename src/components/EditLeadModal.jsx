import React, { useState } from "react";
import { FiX, FiUser, FiPhone, FiCalendar } from "react-icons/fi";
import PropTypes from "prop-types";
import LoadingButton from "./LoadingButton";

const EditLeadModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone,
    purpose: lead.purpose,
    requirement: lead.requirement,
    budget: lead.budget,
    source: lead.source,
    date: lead.date || (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      return date.toISOString().split("T")[0];
    })(),
    favourite: lead.favourite || false,
    autostatus: lead.autostatus || "new",
    schedule: lead.schedule,
  });

  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDirtyFields((prev) => ({ ...prev, [name]: true }));

    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    try {
      const dataToSend = { ...formData };

      await onSave(dataToSend);
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
                    value={formData.phone || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                      dirtyFields.phone && errors.phone
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-lg text-sm text-gray-800`}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength="10"
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
    potential: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    date: PropTypes.string,
    favourite: PropTypes.bool,
    autostatus: PropTypes.string,
    schedule: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLeadModal;
