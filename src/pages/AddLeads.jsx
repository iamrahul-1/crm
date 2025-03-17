import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const AddLeads = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    purpose: "", // Added to match Leads columns
    remarks: "", // Changed from 'remark' to 'remarks' to match
    status: "new",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leads", formData);
      toast.success("Lead added successfully!");
      navigate("/leads/new"); // Changed from "/leads/all" to "/leads/new"
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to add lead. Please try again.");
    }
  };

  return (
    <div className="md:ml-52 pt-[60px] md:pt-[120px] flex flex-col h-full md:px-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Add New Lead</h3>
      <div className="p-4 w-full mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md text-lg rounded-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-800">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full bg-white text-gray-800"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-800">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full bg-white text-gray-800"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-800">
                Purpose
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full bg-white text-gray-800"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-800">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full bg-white text-gray-800"
              >
                <option value="new">New</option>
                <option value="favourite">Favourite</option>
                <option value="missed">Missed</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-800">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full bg-white text-gray-800 min-h-[120px] resize-none"
            />
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate("/leads/all")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md hover:bg-blue-600"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeads;
