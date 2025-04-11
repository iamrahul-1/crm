import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../services/api";
import { toast } from "react-toastify";

const ViewLeadModal = ({ lead, onClose, onRefresh }) => {
  // Ensure lead data has default values
  const defaultLead = {
    name: "",
    phone: "",
    purpose: "",
    remarks: "",
    potential: ["warm"],
    status: "open",
    requirement: "",
    budget: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    favourite: false,
  };

  const [formData, setFormData] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    purpose: lead.purpose || "",
    remarks: lead.remarks || "",
    potential: Array.isArray(lead.potential) ? lead.potential : ["warm"],
    status: lead.status || "open",
    requirement: lead.requirement || "",
    budget: lead.budget || "",
    source: lead.source || "",
    date: lead.date || defaultLead.date,
    time: lead.time || "",
    favourite: lead.favourite || false,
  });

  const [apiData, setApiData] = useState(null);
  const [dirtyFields, setDirtyFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [history, setHistory] = useState([]);

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "inprogress", label: "In Progress" },
    { value: "sitevisitscheduled", label: "Site Visit Scheduled" },
    { value: "sitevisited", label: "Site Visited" },
    { value: "closed", label: "Closed" },
    { value: "rejected", label: "Rejected" },
  ];

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const fetchLeadData = useCallback(async () => {
    try {
      const response = await api.get(`/leads/${lead._id}`);
      setApiData(response.data);
    } catch (error) {
      console.error("Failed to fetch lead data:", error);
      toast.error("Failed to load lead data");
    }
  }, [lead._id]);

  useEffect(() => {
    fetchLeadData();
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/leads/${lead._id}/remarks`);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    fetchHistory();
  }, [lead._id, fetchLeadData]);

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
        setFormData((prev) => ({ ...prev, phone: "" }));
      }
    } else if (name === "potential") {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const hasStatusChanges = formData.status !== lead.status;
    setHasChanges(hasStatusChanges || formData.remarks !== lead.remarks);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    console.log("Form data before submission:", formData);

    if (formData.phone && !validatePhone(formData.phone.toString())) {
      setFormData((prev) => ({ ...prev, phone: "" }));
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = { ...formData };

      // Remove empty fields except for time which should be sent as empty string if not set
      Object.keys(dataToSend).forEach((key) => {
        if (key !== "time" && (dataToSend[key] === "" || dataToSend[key] === null)) {
          delete dataToSend[key];
        }
      });

      // Remove status if it's empty or "new"
      if (!dataToSend.status || dataToSend.status === "new") {
        delete dataToSend.status;
      }

      // Ensure time is always sent, even if empty
      if (!dataToSend.time) {
        dataToSend.time = "";
      }

      console.log("Data being sent to API:", dataToSend);

      const response = await api.put(`/leads/${lead._id}`, dataToSend);
      console.log("API response:", response.data);

      if (response.data) {
        setFormData(response.data);
        toast.success("Lead updated successfully");
        onClose(); // Close the modal after successful save
        onRefresh(); // Refresh the leads list
        setHasChanges(false);
      }
    } catch (error) {
      toast.error("Failed to update lead");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Not set";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not set";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch {
      return "Not set";
    }
  };

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
          {/* Left side - Form */}
          <div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {/*    */}
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Potential
              </label>
              <select
                name="potential"
                value={formData.potential[0]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right side - API Data */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Lead Information
              </h3>
              {apiData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-sm text-gray-900">{apiData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm text-gray-900">{apiData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purpose</p>
                    <p className="text-sm text-gray-900">{apiData.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Source</p>
                    <p className="text-sm text-gray-900">{apiData.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requirement</p>
                    <p className="text-sm text-gray-900">
                      {apiData.requirement} BHK
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="text-sm text-gray-900">{apiData.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Source</p>
                    <p className="text-sm text-gray-900">{apiData.source}</p>
                  </div>
                  {apiData.source === "cp" && (
                    <div>
                      <p className="text-sm text-gray-600">Associated CP</p>
                      <p className="text-sm text-gray-900">
                        {apiData.associatedCp?.name || "Not assigned"}
                      </p>
                    </div>
                  )}
                  {apiData.source === "reference" && (
                    <div>
                      <p className="text-sm text-gray-600">Reference Name</p>
                      <p className="text-sm text-gray-900">
                        {apiData.referenceName || "Not specified"}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-sm text-gray-900">
                      {apiData.status || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Potential</p>
                    <p className="text-sm text-gray-900">
                      {Array.isArray(apiData.potential)
                        ? apiData.potential[0]
                        : apiData.potential || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(apiData.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-sm text-gray-900">
                      {formatTime(apiData.time)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Loading lead data...</p>
                </div>
              )}
            </div>

            {/* History */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                History
              </h3>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((remark, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg shadow-sm"
                    >
                      <p className="text-sm text-gray-900">{remark.remark}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(remark.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No history available</p>
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
    status: PropTypes.string,
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
  onRefresh: PropTypes.func.isRequired,
};

export default ViewLeadModal;
