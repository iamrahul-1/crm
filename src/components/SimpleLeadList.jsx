import React, { useState, useCallback, useEffect } from 'react';
import Table from "./Table";
import { toast } from "react-toastify";
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
      toast.success("Lead updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update lead");
      console.error(err);
    }
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
