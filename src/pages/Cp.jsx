import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../services/api";
import EditCpModal from "../components/EditCpModal";
import DeleteLeadModal from "../components/DeleteLeadModal";

const Agents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingAgent, setEditingAgent] = useState(null);
  const [viewingAgent, setViewingAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewingLeadList, setViewingLeadList] = useState(null);
  const [leadListData, setLeadListData] = useState([]);
  const [leadListLoading, setLeadListLoading] = useState(false);
  const limit = 10;

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response.data);
      return true;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return false;
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/cp?page=${currentPage}&limit=${limit}&search=${searchQuery}`
      );
      console.log("CP Response:", response.data); // Debug log

      // Check if response has the expected structure
      if (!response.data?.success || !response.data?.data) {
        throw new Error("Invalid response format from server");
      }

      setAgents(response.data.data);
      setTotalPages(response.data.pagination.pages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch channel partners"
      );
      toast.error(
        err.response?.data?.message ||
          "Failed to fetch channel partners. Please try again later."
      );
      console.error("Error fetching CPs:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchQuery]);

  const fetchLeadList = useCallback(async (cpId) => {
    try {
      setLeadListLoading(true);
      const response = await api.get(`/cp/${cpId}/leads`);
      console.log('Lead list response:', response.data);
      setLeadListData(response.data.leads || []);
    } catch (error) {
      console.error("Error fetching lead list:", error);
      toast.error("Failed to fetch lead list");
    } finally {
      setLeadListLoading(false);
    }
  }, []);

  const handleViewLeadList = (cpId) => {
    console.log('Fetching leads for CP:', cpId);
    fetchLeadList(cpId);
    setViewingLeadList(cpId);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userFetched = await fetchUser();
      if (userFetched) {
        fetchAgents();
      }
    };
    fetchData();
  }, [fetchAgents, fetchUser]);

  const handleEditAgent = async (updatedData) => {
    try {
      const response = await api.put(`/cp/${editingAgent._id}`, updatedData);
      console.log("Update Response:", response.data); // Debug log

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to update channel partner"
        );
      }

      // Update the local state with the new data
      setAgents(
        agents.map((agent) =>
          agent._id === editingAgent._id ? response.data.data : agent
        )
      );
      setEditingAgent(null);
      toast.success("Channel Partner updated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update channel partner"
      );
      console.error("Error updating CP:", err);
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await api.delete(`/cp/${id}`);
      setAgents(agents.filter((agent) => agent._id !== id));
      toast.success("Channel Partner deleted successfully");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete channel partner"
      );
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => <span>{row.name}</span>,
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => <span>{row.phone}</span>,
    },
    {
      header: "Role",
      accessor: "role",
      render: (row) => (
        <span className="capitalize">
          {row.role} {row.companyRole ? `(${row.companyRole})` : ""}
        </span>
      ),
    },
    {
      header: "Lead List",
      accessor: "leadListName",
      render: (row) => (
        <div className="flex items-center justify-center">
          <span className="text-center">{row.leadListName}</span>
          <button
            onClick={() => handleViewLeadList(row._id)}
            className="px-3 py-1.5 text-sm rounded-lg text-blue-600 hover:bg-blue-50 transition-colors ml-2"
            title="View Leads"
          >
            View
          </button>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex justify-center items-center gap-2">
          {/* <button
            onClick={() => setViewingAgent(row)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="View"
          >
            <FiEye className="w-4 h-4" />
          </button> */}
          <button
            onClick={() => setEditingAgent(row)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <FiEdit2 size={18} />
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setDeleteConfirm(row._id)}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const filteredAgents = agents.filter((agent) => {
    return (
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.phone.includes(searchQuery) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
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
            </div>
            <div className="flex items-center gap-4">
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
              <button
                onClick={() => navigate("/cp/add")}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Add Channel Partner
              </button>
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
                      onClick={() => setCurrentPage(currentPage - 1)}
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
                      onClick={() => setCurrentPage(currentPage + 1)}
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
        <EditCpModal
          cp={editingAgent}
          onClose={() => setEditingAgent(null)}
          onSave={handleEditAgent}
        />
      )}

      {deleteConfirm && (
        <DeleteLeadModal
          onClose={() => setDeleteConfirm(null)}
          onDelete={() => handleDeleteAgent(deleteConfirm)}
        />
      )}

      {viewingLeadList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-normal text-gray-800">Lead List</h2>
              <button
                onClick={() => {
                  setViewingLeadList(null);
                  setLeadListData([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {leadListLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : leadListData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    No leads found for this CP
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">Total leads: {leadListData.length}</p>
                  <div className="space-y-4">
                    {leadListData.map((lead, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-4 flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            <span className="text-lg font-semibold text-gray-800">
                              {lead.name?.[0]?.toUpperCase() || 'L'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {lead.name}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                lead.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                                lead.status === 'closed' ? 'bg-green-100 text-green-800' :
                                lead.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lead.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{lead.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{lead.purpose || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{lead.budget || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
