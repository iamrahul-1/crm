import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { toast } from "react-toastify";
import api from "../services/api";
import EditLeadModal from "../components/EditLeadModal";
import DeleteLeadModal from "../components/DeleteLeadModal";
import ViewLeadModal from "../components/ViewLeadModal";
import { getLeadTableColumns } from "../components/TableDefinitions";

const TomorrowScheduled = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const limit = 10;

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      // Get tomorrow's date in YYYY-MM-DD format
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const response = await api.get(
        `/leads/schedule/custom/${formattedDate}?page=${currentPage}&limit=${limit}&search=${searchQuery}&populate=createdBy`
      );
      console.log("Tomorrow's leads:", response.data);
      const updatedLeads = response.data.leads.map((lead) => ({
        ...lead,
        createdBy: lead.createdBy ? lead.createdBy.name : 'Unknown'
      }));
      setLeads(updatedLeads);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leads");
      setLoading(false);
      toast.error(
        err.response?.data?.message || "Failed to fetch leads. Please try again later."
      );
    }
  }, [currentPage, limit, searchQuery]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (currentUser) {
      fetchLeads();
    }
  }, [fetchLeads, currentUser]);

  const refreshLeads = () => {
    fetchLeads();
  };

  const handleEdit = async (updatedData) => {
    try {
      const response = await api.put(`/leads/${editingLead._id}`, updatedData);
      
      const updatedLeads = leads.map((lead) => {
        if (lead._id === editingLead._id) {
          return {
            ...lead,
            ...response.data.lead,
            createdBy: lead.createdBy
          };
        }
        return lead;
      });

      setLeads(updatedLeads);
      setEditingLead(null);
      toast.success("Lead updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update lead");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewLead = (row) => {
    setViewingLead(row);
  };

  const toggleFavorite = async (id, lead) => {
    try {
      const isFavorite = !lead.favourite;
      const response = await api.put(`/leads/${id}`, { favourite: isFavorite });

      // Find the lead in the current state and update it
      const updatedLeads = leads.map((l) => {
        if (l._id === id) {
          return {
            ...l,
            ...response.data.lead,
            createdBy: l.createdBy, // Preserve the createdBy field
          };
        }
        return l;
      });

      setLeads(updatedLeads);

      toast(isFavorite ? "Added to favorites" : "Removed from favorites", {
        type: isFavorite ? "success" : "info",
        toastId: `favorite-${id}`,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update favorite status"
      );
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter((lead) => lead._id !== id));
      toast.success("Lead deleted successfully");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete lead");
    }
  };

  const columns = getLeadTableColumns({
    handleViewLead,
    setEditingLead,
    setDeleteConfirm,
    toggleFavorite,
  });

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (lead.name?.toLowerCase() || '').includes(searchLower) ||
      String(lead.phone || '').includes(searchQuery) ||
      (lead.purpose?.toLowerCase() || '').includes(searchLower) ||
      (lead.remarks?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="w-full mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className="text-2xl font-semibold text-gray-900">
                Tomorrow's Scheduled Leads
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 sm:max-w-md">
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={() => navigate("/leads/add")}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Add Lead
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
                <Table columns={columns} data={filteredLeads} />
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

      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSave={handleEdit}
        />
      )}

      {deleteConfirm && (
        <DeleteLeadModal
          onClose={() => setDeleteConfirm(null)}
          onDelete={() => handleDelete(deleteConfirm)}
        />
      )}

      {viewingLead && (
        <ViewLeadModal
          lead={viewingLead}
          onClose={() => {
            setViewingLead(null);
          }}
          onRefresh={refreshLeads}
        />
      )}
    </div>
  );
};

export default TomorrowScheduled;