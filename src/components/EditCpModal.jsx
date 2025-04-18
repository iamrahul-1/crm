import { useState } from "react";
import PropTypes from "prop-types";
import { FiX, FiUser, FiBriefcase } from "react-icons/fi";
import { toast } from "sonner"; // Updated import

const EditCpModal = ({ cp, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: cp.name || "",
    phone: cp.phone || "",
    role: cp.role || "individual",
    companyRole: cp.companyRole || "",
    ownerName: cp.ownerName || "",
    ownerContact: cp.ownerContact || "",
    designation: cp.designation || "",
    firmName: cp.firmName || "",
    date: cp.date
      ? new Date(cp.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDirtyFields((prev) => ({ ...prev, [name]: true }));

    if (name === "phone" || name === "ownerContact") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "phone", "role"];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = { ...formData };

      // Convert phone numbers to numbers
      if (dataToSend.phone) {
        dataToSend.phone = parseInt(dataToSend.phone);
      }
      if (dataToSend.ownerContact) {
        dataToSend.ownerContact = parseInt(dataToSend.ownerContact);
      }

      await onSave(dataToSend);
      onClose();
      toast.success("Channel Partner updated successfully", {
        description: "Changes have been saved",
      });
    } catch (error) {
      toast.error("Failed to update channel partner", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Edit Channel Partner
            </h2>
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
                    value={formData.phone}
                    onChange={handleChange}
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
              </div>
            </div>

            {/* Company Information */}
            {formData.role === "company" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <FiBriefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-base font-medium text-gray-800">
                    Company Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Role */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Company Role
                    </label>
                    <select
                      name="companyRole"
                      value={formData.companyRole}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                      required
                    >
                      <option value="employee">Employee</option>
                    </select>
                  </div>

                  {/* Employee Specific Fields */}
                  {formData.companyRole === "employee" && (
                    <>
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
                          placeholder="Enter owner name"
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
                          placeholder="Enter owner contact"
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
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Date Input */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">Additional Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                    required
                  />
                </div>
              </div>
            </div> */}

            <div className="flex gap-4 justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
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
                  "Save Changes"
                )}
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
    ownerName: PropTypes.string,
    ownerContact: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    designation: PropTypes.string,
    firmName: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditCpModal;
