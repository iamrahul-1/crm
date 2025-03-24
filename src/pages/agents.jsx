import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../services/api";
import EditLeadModal from "../components/EditLeadModal";
import DeleteLeadModal from "../components/DeleteLeadModal";
import RemarksModal from "../components/RemarksModal";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingAgent, setEditingAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingRemarks, setViewingRemarks] = useState(null);
  const limit = 10;

  useEffect(() => {
    const fetchChannelPartners = async () => {
      try {
        const response = await api.get(
          `/cp?page=${currentPage}&limit=${limit}`
        );
        setAgents(response.data.leads || []);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch channel partners");
        setLoading(false);
        toast.error(
          "Failed to fetch channel partners. Please try again later."
        );
        console.error(error);
      }
    };

    fetchChannelPartners();
  }, [currentPage]);

  const handleEdit = async (updatedData) => {
    try {
      const response = await api.put(`/leads/${editingAgent._id}`, updatedData);
      setAgents(
        agents.map((agent) =>
          agent._id === editingAgent._id ? response.data.lead : agent
        )
      );
      setEditingAgent(null);
      toast.success("Channel partner updated successfully");
    } catch (error) {
      toast.error("Failed to update channel partner");
      console.error(error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      setAgents(agents.filter((agent) => agent._id !== id));
      toast.success("Channel partner deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete channel partner");
      console.error(error);
    }
  };

  const handleViewRemarks = (row) => {
    setViewingRemarks(row);
  };

  const columns = [
    {
      header: "Company",
      accessor: "company",
    },
    {
      header: "Total Leads",
      accessor: "totalLeads",
    },
    {
      header: "Active Leads",
      accessor: "activeLeads",
    },
    {
      header: "Remarks",
      accessor: "remarks",
      render: (row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleViewRemarks(row)}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View
          </button>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setEditingAgent(row)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => setDeleteConfirm(row._id)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const filteredAgents = agents.filter((agent) => {
    return (
      agent.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(agent.totalLeads).includes(searchQuery) ||
      String(agent.activeLeads).includes(searchQuery) ||
      agent.remarks.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className="text-2xl font-semibold text-gray-900">
                Channel Partners
              </h1>
              <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg">
                <FiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="relative flex-1 sm:max-w-md">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search channel partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table columns={columns} data={filteredAgents} />
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && (
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Showing page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage >= totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingAgent && (
        <EditLeadModal
          lead={editingAgent}
          onClose={() => setEditingAgent(null)}
          onSave={handleEdit}
        />
      )}

      {deleteConfirm && (
        <DeleteLeadModal
          onClose={() => setDeleteConfirm(null)}
          onDelete={() => handleDelete(deleteConfirm)}
        />
      )}

      {viewingRemarks && (
        <RemarksModal
          remarks={viewingRemarks.remarks}
          leadId={viewingRemarks._id}
          onClose={() => setViewingRemarks(null)}
        />
      )}
    </div>
  );
};

export default Agents;
