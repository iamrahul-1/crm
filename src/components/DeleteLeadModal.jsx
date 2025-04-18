import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import { toast } from "sonner";

const DeleteLeadModal = ({ onClose, onDelete, leadName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      toast.success("Lead deleted successfully", {
        description: `${leadName || 'The lead'} has been permanently removed`
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error("Failed to delete lead", {
        description: error.response?.data?.message || "Please try again"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl transform transition-all">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <FiAlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Delete Lead
        </h3>
        <p className="text-gray-500 text-center mb-6">
          Are you sure you want to delete {leadName ? <strong>{leadName}</strong> : 'this lead'}? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium transition-colors ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
            }`}
          >
            {isDeleting ? (
              <span className="flex items-center justify-center">
                <FiLoader className="animate-spin mr-2" /> Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteLeadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  leadName: PropTypes.string,
};

export default DeleteLeadModal;
