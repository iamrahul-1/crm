import React, { useState, useEffect } from "react";
import { FiUser, FiTarget, FiMessageSquare } from "react-icons/fi";
import PropTypes from "prop-types";
import api from "../services/api";
import { toast } from "react-toastify";

const ViewLeadModal = ({ lead, onClose }) => {
  // Ensure lead data has default values
  const defaultLead = {
    name: "",
    phone: "",
    purpose: "",
    remarks: "",
    potential: ["warm"],
    status: ["open"],
    requirement: "",
    budget: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    favourite: false,
  };

  const [formData, setFormData] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    purpose: lead.purpose || "",
    remarks: lead.remarks || "",
    potential: Array.isArray(lead.potential) ? lead.potential : ["warm"],
    status: Array.isArray(lead.status) ? lead.status : ["open"],
    requirement: lead.requirement || "",
    budget: lead.budget || "",
    source: lead.source || "",
    date: lead.date || defaultLead.date,
    time: lead.time || defaultLead.time,
    favourite: lead.favourite || false,
  });

  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [history, setHistory] = useState([]);

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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
    } else if (name === "potential" || name === "status") {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    const hasStatusChanges =
      JSON.stringify(formData.potential) !== JSON.stringify(lead.potential) ||
      JSON.stringify(formData.status) !== JSON.stringify(lead.status);
    setHasChanges(hasStatusChanges || formData.remarks !== lead.remarks);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.phone && !validatePhone(formData.phone.toString())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedLead = {
        ...lead,
        ...formData,
      };

      const response = await api.put(`/leads/${lead._id}`, updatedLead);
      if (response.data) {
        setFormData(response.data);
        toast.success("Lead updated successfully");
        onClose(); // Close the modal after successful save
        setHasChanges(false);
      }
    } catch (error) {
      toast.error("Failed to update lead");
      console.error(error);
    } finally {
      setIsSubmitting(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Not set";
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/leads/${lead._id}/remarks`);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    fetchHistory();
  }, [lead._id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-normal text-gray-800">Lead Details</h2>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSave}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
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
        </div>

        <div className="grid grid-cols-2 gap-8 p-6">
          {/* Left Side - Edit Section */}
          <div className="space-y-6">
            {/* Lead Classification */}
            <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-green-50 rounded-lg">
                  <FiTarget className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Lead Classification
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
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
                          checked={formData.potential?.[0] === potential}
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
                    value={formData.status?.[0] || "open"}
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

            {/* Additional Information */}
            <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
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

            {/* Remarks History - Full Width */}
          </div>

          {/* Right Side - View Section */}
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Lead Profile
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Name
                  </label>
                  <p className="text-gray-800 font-medium px-1">{lead.name}</p>
                </div>

                {/* Phone */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-800 font-medium px-1">
                    {lead.phone ? lead.phone.toString() : ""}
                  </p>
                </div>

                {/* Purpose */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Purpose
                  </label>
                  <p className="text-gray-800 font-medium px-1">
                    {lead.purpose}
                  </p>
                </div>

                {/* Requirement */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Requirement
                  </label>
                  <p className="text-gray-800 font-medium px-1">
                    {lead.requirement}
                  </p>
                </div>

                {/* Budget */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Budget (in Cr)
                  </label>
                  <p className="text-gray-800 font-medium px-1">
                    {lead.budget}
                  </p>
                </div>

                {/* Source */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Source
                  </label>
                  <p className="text-gray-800 font-medium px-1">
                    {lead.source}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 rounded-lg">
                  <FiTarget className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-base font-medium text-gray-800">
                  Current Status
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lead Potential */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Lead Potential
                  </label>
                  <p className="text-gray-800 font-medium px-1">
                    {formData.potential?.[0] || "warm"}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Status
                  </label>
                  <p className="text-gray-800 font-medium px-1">
                    {statusDisplayMap[formData.status?.[0]] || "Open"}
                  </p>
                </div>

                <div className="col-span-2 bg-gray-50 p-4 rounded-xl transition-all duration-200 hover:bg-gray-100/80">
                  <label className="block text-sm text-gray-600 mb-2">
                    Remarks
                  </label>
                  <p className="text-gray-800 px-1">
                    {formData.remarks || "No remarks added yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Remark History
            </label>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              {history.length === 0 ? (
                <p className="text-gray-700">No remarks history available</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-lg border border-gray-100 w-full"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-600">
                          {formatDate(entry.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {entry.createdBy?.name || "System"}
                        </p>
                      </div>
                      <p className="text-gray-800">{entry.remark}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewLeadModal.propTypes = {
  lead: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    purpose: PropTypes.string.isRequired,
    remarks: PropTypes.string,
    potential: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.arrayOf(PropTypes.string),
    requirement: PropTypes.string,
    budget: PropTypes.string,
    source: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    favourite: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewLeadModal;
