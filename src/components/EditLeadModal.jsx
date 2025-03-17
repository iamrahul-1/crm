import React, { useState } from "react";

const EditLeadModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone,
    purpose: lead.purpose,
    remarks: lead.remarks,
    status: lead.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-gray-200 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Edit Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
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
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full h-24"
              />
            </div>

            {/* Remark History Section */}
            {lead.remarkHistory && lead.remarkHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Remark History</h3>
                <div className="max-h-60 overflow-y-auto">
                  {lead.remarkHistory.map((history, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 mb-4 py-2"
                    >
                      <p className="text-gray-700">{history.remark}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(history.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default EditLeadModal;
