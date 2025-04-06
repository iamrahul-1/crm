import React, { useState, useEffect } from "react";
import { FiX, FiUser, FiPhone, FiCalendar, FiSearch } from "react-icons/fi";
import PropTypes from "prop-types";
import LoadingButton from "./LoadingButton";
import { toast } from "react-toastify";
import api from "../services/api";

const EditLeadModal = ({ lead, onClose, onSave }) => {
  // Add these state variables at the top with other states
  const [cpOptions, setCpOptions] = useState([]);
  const [loadingCps, setLoadingCps] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Add this useEffect after other state declarations
  useEffect(() => {
    const fetchCps = async () => {
      setLoadingCps(true);
      try {
        const response = await api.get("/cp");
        const cpData = response.data.cps;
        const options = cpData.map((cp) => ({
          value: cp._id,
          label: `${cp.name} - ${cp.phone}`,
        }));
        setCpOptions(options);
      } catch (error) {
        console.error("Error fetching CPs:", error);
        toast.error("Failed to fetch channel partners");
      } finally {
        setLoadingCps(false);
      }
    };

    fetchCps();
  }, []);

  // Update formData initialization
  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone,
    purpose: lead.purpose,
    requirement: lead.requirement,
    budget: lead.budget,
    source: lead.source,
    date:
      lead.date ||
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toISOString().split("T")[0];
      })(),
    favourite: lead.favourite || false,
    autostatus: lead.autostatus || "new",
    schedule: lead.schedule,
    associatedCp: lead.associatedCp || "",
    referenceName: lead.referenceName || "",
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

              {/* Reference Name - Conditional */}
              {formData.source === "reference" && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Reference Name
                  </label>
                  <input
                    type="text"
                    name="referenceName"
                    value={formData.referenceName}
                    onChange={handleChange}
                    placeholder="Enter reference name"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                  />
                </div>
              )}

              {/* Associated CP - Conditional */}
              {formData.source === "cp" && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Associated Channel Partner
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={
                        formData.associatedCp && !searchQuery
                          ? cpOptions
                              .find((cp) => cp.value === formData.associatedCp)
                              ?.label.split(" - ")[0]
                          : searchQuery
                      }
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (formData.associatedCp) {
                          setFormData((prev) => ({
                            ...prev,
                            associatedCp: "",
                          }));
                        }
                      }}
                      placeholder="Search channel partner..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                    />
                    {searchQuery && (
                      <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {loadingCps ? (
                          <div className="p-3 text-center text-gray-500">
                            Loading...
                          </div>
                        ) : (
                          cpOptions
                            .filter((cp) =>
                              cp.label
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )
                            .map((cp) => (
                              <div
                                key={cp.value}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    associatedCp: cp.value,
                                  }));
                                  setSearchQuery(cp.label.split(" - ")[0]);
                                  setSearchQuery("");
                                }}
                              >
                                {cp.label.split(" - ")[0]}
                              </div>
                            ))
                        )}
                      </div>
                    )}
                  </div>
                  {formData.associatedCp && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <span>Selected:</span>
                      <span className="font-medium">
                        {
                          cpOptions
                            .find((cp) => cp.value === formData.associatedCp)
                            ?.label.split(" - ")[0]
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            associatedCp: "",
                          }));
                          setSearchQuery("");
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
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
    referenceName: PropTypes.string,
    associatedCp: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLeadModal;
