import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import { toast } from "react-toastify";
import api from "../services/api";
import EditLeadModal from "./EditLeadModal";
import DeleteLeadModal from "./DeleteLeadModal";
import ViewLeadModal from "./ViewLeadModal";
import { getLeadTableColumns } from "./TableDefinitions";
import PropTypes from "prop-types";

const LeadList = ({
  title,
  leads = [],
  loading = false,
  params = {},
  filterFn = (lead) => true,
}) => {
  const navigate = useNavigate();
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleEdit = async (updatedData) => {
    try {
      const response = await api.put(`/leads/${editingLead._id}`, updatedData);
      setEditingLead(null);
      toast.success("Lead updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update lead");
      console.error(err);
    }
  };

  const handlePageChange = (newPage) => {
    // No-op since pagination is handled by parent
  };

  const handleViewLead = (row) => {
    setViewingLead(row);
  };

  const toggleFavorite = async (id, lead) => {
    try {
      const isFavorite = !lead.favourite;
      const response = await api.put(`/leads/${id}`, { favourite: isFavorite });

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
      setDeleteConfirm(null);
      toast.success("Lead deleted successfully");
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
    return (
      (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(lead.phone).includes(searchQuery) ||
        lead.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.remarks.toLowerCase().includes(searchQuery.toLowerCase())) &&
      filterFn(lead)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 sm:max-w-md">
                <input
                  type="text"
                  placeholder={`Search ${title.toLowerCase()}...`}
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
            ) : (
              <div className="overflow-x-auto">
                <Table columns={columns} data={filteredLeads} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

LeadList.propTypes = {
  title: PropTypes.string.isRequired,
  leads: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  params: PropTypes.object,
  filterFn: PropTypes.func,
};

export default LeadList;
