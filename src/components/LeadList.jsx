import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import { toast } from "sonner";
import api from "../services/api";
import EditLeadModal from "./EditLeadModal";
import DeleteLeadModal from "./DeleteLeadModal";
import ViewLeadModal from "./ViewLeadModal";
import { getLeadTableColumns } from "./TableDefinitions";
import PropTypes from "prop-types";

const LeadList = ({
  title,
  leads: initialLeads = [],
  loading = false,
  filterFn = (lead) => true,
}) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState(initialLeads);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      toast.error("Failed to fetch user details", {
        description: "Some features may be limited"
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleEdit = async (updatedData) => {
    try {
      await api.put(`/leads/${editingLead._id}`, updatedData);
      setEditingLead(null);
      toast.success("Lead updated successfully", {
        description: `${updatedData.name}'s information has been updated`
      });
    } catch (err) {
      toast.error("Failed to update lead", {
        description: err.response?.data?.message || "Please try again"
      });
      console.error(err);
    }
  };

  const handleDelete = async (lead) => {
    try {
      await api.delete(`/leads/${lead._id}`);
      setLeads((prevLeads) => prevLeads.filter((l) => l._id !== lead._id));
      setDeleteConfirm(null);
      toast.success("Lead deleted successfully", {
        description: `${lead.name}'s record has been removed`
      });
    } catch (err) {
      toast.error("Failed to delete lead", {
        description: err.response?.data?.message || "Please try again"
      });
      console.error(err);
    }
  };

  const handleToggleFavorite = async (lead) => {
    const newFavoriteStatus = !lead.favourite;
    try {
      await api.put(`/leads/${lead._id}/favorite`, {
        favourite: newFavoriteStatus,
      });
      setLeads((prevLeads) =>
        prevLeads.map((l) =>
          l._id === lead._id ? { ...l, favourite: newFavoriteStatus } : l
        )
      );
      toast(newFavoriteStatus ? "Added to favorites" : "Removed from favorites", {
        type: newFavoriteStatus ? "success" : "info",
        description: `${lead.name} has been ${newFavoriteStatus ? 'added to' : 'removed from'} your favorites`
      });
    } catch (err) {
      // Revert on error
      setLeads((prevLeads) =>
        prevLeads.map((l) =>
          l._id === lead._id ? { ...l, favourite: !newFavoriteStatus } : l
        )
      );
      toast.error("Failed to update favorite status", {
        description: err.response?.data?.message || "Please try again"
      });
      console.error(err);
    }
  };

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      if (!query) {
        setLeads(initialLeads);
        return;
      }

      const searchResults = initialLeads.filter((lead) => {
        const searchStr = `${lead.name} ${lead.phone} ${lead.purpose} ${lead.requirement} ${lead.source}`.toLowerCase();
        return searchStr.includes(query.toLowerCase());
      });

      setLeads(searchResults);
    },
    [initialLeads]
  );

  const handleViewLead = (row) => {
    setViewingLead(row);
  };

  const columns = getLeadTableColumns({
    handleViewLead,
    setEditingLead,
    setDeleteConfirm,
    handleToggleFavorite,
    userRole: currentUser?.role,
  });

  const filteredLeads = leads.filter((lead) => {
    return (
      (lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(lead.phone).includes(searchQuery) ||
        lead.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.remarks?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      filterFn(lead)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="w-full mx-auto">
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
                  onChange={(e) => handleSearch(e.target.value)}
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

          {editingLead && (
            <EditLeadModal
              lead={editingLead}
              onClose={() => setEditingLead(null)}
              onSave={handleEdit}
            />
          )}

          {viewingLead && (
            <ViewLeadModal
              lead={viewingLead}
              onClose={() => setViewingLead(null)}
            />
          )}

          {deleteConfirm && (
            <DeleteLeadModal
              onClose={() => setDeleteConfirm(null)}
              onDelete={() => handleDelete(deleteConfirm)}
              leadName={deleteConfirm.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

LeadList.propTypes = {
  title: PropTypes.string.isRequired,
  leads: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  filterFn: PropTypes.func,
};

export default LeadList;
