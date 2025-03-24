import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import PropTypes from "prop-types";

const EditLeadModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone,
    purpose: lead.purpose,
    remarks: lead.remarks,
    status: lead.status,
  });
  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Only allow digits and limit to 10 characters
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

      // Set error if phone is not exactly 10 digits
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be 10 digits",
      }));
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Edit Lead</h2>
            <p className="text-sm text-gray-500">
              Update lead information and status
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="Enter 10 digit number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="open">Opened</option>
                  <option value="inprogress">In Progress</option>
                  <option value="sitevisitscheduled">
                    Site Visit Scheduled
                  </option>
                  <option value="sitevisited">Site Visited</option>
                  <option value="closed">Closed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-y"
                placeholder="Add your remarks here..."
              />
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

EditLeadModal.propTypes = {
  lead: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    remarks: PropTypes.string,
    status: PropTypes.string.isRequired,
    remarkHistory: PropTypes.arrayOf(
      PropTypes.shape({
        remark: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLeadModal;
