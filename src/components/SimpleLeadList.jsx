import React, { useState, useCallback, useEffect } from "react";
import Table from "./Table";
import { toast } from "sonner"; // Updated import
import api from "../services/api";
import EditLeadModal from "./EditLeadModal";
import DeleteLeadModal from "./DeleteLeadModal";
import ViewLeadModal from "./ViewLeadModal";
import { getLeadTableColumns } from "./TableDefinitions";

const SimpleLeadList = ({ leads, loading }) => {
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
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
      toast.success("Lead updated successfully", {
        description: "Changes have been saved",
      });
    } catch (err) {
      toast.error("Failed to update lead", {
        description: err.response?.data?.message || "Please try again",
      });
      console.error(err);
    }
  };

  const handleViewLead = (row) => {
    setViewingLead(row);
  };

  const toggleFavorite = async (id, lead) => {
    try {
      const isFavorite = !lead.favourite;
      await api.put(`/leads/${id}`, { favourite: isFavorite });

      if (isFavorite) {
        toast.success("Added to favorites");
      } else {
        toast.info("Removed from favorites");
      }
    } catch (err) {
      toast.error("Failed to update favorite status", {
        description: err.response?.data?.message || "Please try again",
      });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      setDeleteConfirm(null);
      toast.success("Lead deleted successfully", {
        description: "The lead has been permanently removed",
      });
    } catch (err) {
      toast.error("Failed to delete lead", {
        description: err.response?.data?.message || "Please try again",
      });
    }
  };

  const columns = getLeadTableColumns({
    handleViewLead,
    setEditingLead,
    setDeleteConfirm,
    toggleFavorite,
  });

  return (
    <>
      <div className="overflow-x-auto">
        <Table columns={columns} data={leads} />
      </div>

      {/* Modals */}
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
          lead={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default SimpleLeadList;
