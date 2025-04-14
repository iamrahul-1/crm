import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { toast } from "react-toastify";
import api from "../services/api";
import EditLeadModal from "../components/EditLeadModal";
import DeleteLeadModal from "../components/DeleteLeadModal";
import ViewLeadModal from "../components/ViewLeadModal";
import { getLeadTableColumns } from "../components/TableDefinitions";

const WeekendScheduled = () => {
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
      // Get weekend dates in YYYY-MM-DD format
      const today = new Date();
      const day = today.getDay();

      // Calculate Saturday and Sunday dates
      let saturday, sunday;
      if (day === 6) {
        // Today is Saturday
        saturday = new Date(today);
        sunday = new Date(today);
        sunday.setDate(sunday.getDate() + 1);
      } else if (day === 0) {
        // Today is Sunday
        saturday = new Date(today);
        saturday.setDate(saturday.getDate() - 1);
        sunday = new Date(today);
      } else {
        // Any other day
        const daysUntilSaturday = 6 - day;
        saturday = new Date(today);
        saturday.setDate(saturday.getDate() + daysUntilSaturday);
        sunday = new Date(saturday);
        sunday.setDate(sunday.getDate() + 1);
      }

      // Format dates
      const formatWeekendDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const saturdayDate = formatWeekendDate(saturday);
      const sundayDate = formatWeekendDate(sunday);

      // Get leads for both days
      const saturdayResponse = await api.get(
        `/leads/schedule/custom/${saturdayDate}?populate=createdBy`
      );
      const sundayResponse = await api.get(
        `/leads/schedule/custom/${sundayDate}?populate=createdBy`
      );

      // Combine leads from both days
      const allLeads = [
        ...saturdayResponse.data.leads,
        ...sundayResponse.data.leads,
      ];

      // Sort by date and time
      allLeads.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return 0;
      });

      console.log("Weekend leads:", allLeads);
      const updatedLeads = allLeads.map((lead) => ({
        ...lead,
        // Use createdBy name if available, otherwise fallback to current user's name
        createdBy: lead.createdBy?.name || currentUser?.name || "Unknown",
      }));

      // Calculate total pages based on combined leads
      const totalItems = allLeads.length;
      const totalPages = Math.ceil(totalItems / limit);

      // Get current page leads
      const start = (currentPage - 1) * limit;
      const end = start + limit;
      const pageLeads = updatedLeads.slice(start, end);

      setLeads(pageLeads);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leads");
      setLoading(false);
      toast.error(
        err.response?.data?.message ||
          "Failed to fetch leads. Please try again later."
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
            createdBy: lead.createdBy?.name || currentUser?.name || "Unknown",
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

  const toggleFavorite = (id, lead) => {
    const isFavorite = !lead.favourite;

    const updatedLeads = leads.map((l) => {
      if (l._id === id) {
        return {
          ...l,
          favourite: isFavorite,
        };
      }
      return l;
    });
    setLeads(updatedLeads);

    toast(isFavorite ? "Added to favorites" : "Removed from favorites", {
      type: isFavorite ? "success" : "info",
      toastId: `favorite-${id}`,
    });
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
      (lead.name?.toLowerCase() || "").includes(searchLower) ||
      String(lead.phone || "").includes(searchQuery) ||
      (lead.purpose?.toLowerCase() || "").includes(searchLower) ||
      (lead.remarks?.toLowerCase() || "").includes(searchLower)
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
                Weekend Scheduled Leads
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

export default WeekendScheduled;
