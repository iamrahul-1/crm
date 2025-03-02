import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import React from "react";

// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

const Agents = () => {
  const [searchText, setSearchText] = useState("");
  const [leads, setLeads] = useState([]);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [isViewLeadModalOpen, setIsViewLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch Leads from API
  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leads/");
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.name && lead.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [leads, searchText]);

  // Column Definitions
  const columnDefs = useMemo(
    () => [
      { headerName: "Name", field: "name", width: 200, filter: true },
      { headerName: "Email", field: "email", width: 250, filter: true },
      {
        headerName: "Occupation",
        field: "occupation",
        width: 150,
        filter: true,
      },
      { headerName: "Status", field: "status", width: 140, filter: true },
      { headerName: "Remarks", field: "remarks", width: 300, filter: true },
      {
        headerName: "Actions",
        cellRenderer: (params) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(params.data)}
              className="bg-gray-400 text-black px-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(params.data._id)}
              className="bg-red-400 text-white px-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => handleView(params.data)}
              className="bg-blue-400 text-white px-2 rounded"
            >
              View
            </button>
          </div>
        ),
        filter: false,
      },
    ],
    []
  );

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setIsEditLeadModalOpen(true);
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
    setIsViewLeadModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  return (
    <div
      className={`md:ml-52 mt-[60px] md:mt-[100px] px-4 md:px-6 bg-white text-black
      min-h-screen`}
    >
      <div className="flex justify-between md:flex-row flex-col items-center mb-6 pt-4">
        <h2 className="text-2xl md:text-2xl pb-3 font-semibold">Agents</h2>
        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="bg-black text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:scale-105"
        >
          Add New Lead
        </button>
      </div>

      <input
        type="text"
        placeholder="Search leads..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border rounded-lg px-2 py-1 w-full text-sm md:text-base mb-4"
      />

      <div
        className={`ag-theme-alpine`}
        style={{ height: "70vh", width: "100%" }}
      >
        {filteredLeads.length > 0 ? (
          <AgGridReact
            rowData={filteredLeads}
            columnDefs={columnDefs}
            defaultColDef={{ filter: true, resizable: true }}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            rowHeight={40}
          />
        ) : (
          <div className="text-center py-4">No leads available.</div>
        )}
      </div>

      {isNewLeadModalOpen && (
        <LeadModal
          title="New Lead"
          closeModal={() => setIsNewLeadModalOpen(false)}
          refreshLeads={fetchLeads}
        />
      )}
      {isEditLeadModalOpen && (
        <LeadModal
          title="Edit Lead"
          lead={selectedLead}
          closeModal={() => setIsEditLeadModalOpen(false)}
          isEditable
          refreshLeads={fetchLeads}
        />
      )}
      {isViewLeadModalOpen && (
        <LeadModal
          title="View Lead"
          lead={selectedLead}
          closeModal={() => setIsViewLeadModalOpen(false)}
          isReadOnly
        />
      )}
    </div>
  );
};

// Reusable Lead Modal Component
const LeadModal = ({
  title,
  closeModal,
  lead,
  isEditable,
  isReadOnly,
  refreshLeads,
}) => {
  const [formData, setFormData] = useState(
    lead || { name: "", email: "", occupation: "", remarks: "", status: "New" }
  );

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditable) {
        await axios.put(
          `http://localhost:5000/api/leads/${formData._id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/leads/", formData);
      }
      refreshLeads();
      closeModal();
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
            disabled={isReadOnly}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
            disabled={isReadOnly}
          />
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
            disabled={isReadOnly}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
            disabled={isReadOnly}
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <textarea
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
            disabled={isReadOnly}
          />
          {!isReadOnly && (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              {isEditable ? "Update" : "Submit"}
            </button>
          )}
          <button
            onClick={closeModal}
            className="bg-gray-400 text-black px-4 py-1 rounded"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default Agents;
