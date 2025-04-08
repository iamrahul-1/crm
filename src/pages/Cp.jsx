import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { FiEdit2, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
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
    // {
    //   header: "Date",
    //   accessor: "date",
    //   render: (row) => <span>{new Date(row.date).toLocaleDateString()}</span>,
    // },
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
          {/* Uncomment the delete button */}
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

      {viewingAgent && (
        <ViewLeadModal
          lead={viewingAgent}
          onClose={() => setViewingAgent(null)}
          onRefresh={fetchAgents}
        />
      )}
    </div>
  );
};

export default Agents;
