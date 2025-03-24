import React, { useState, useEffect } from "react";
import { FiX, FiClock } from "react-icons/fi";
import api from "../services/api";
import { toast } from "react-toastify";

const RemarksModal = ({ remarks, leadId, onClose }) => {
  const [remarkHistory, setRemarkHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemarkHistory = async () => {
      try {
        console.log("Fetching remarks for lead ID:", leadId);
        const response = await api.get(`/leads/${leadId}/remarks`);
        console.log("API Response:", response.data);

        // Just use the array that's returned directly
        setRemarkHistory(response.data || []);
      } catch (error) {
        console.error("Remarks fetch error:", error);
        toast.error("Failed to load remarks history");
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchRemarkHistory();
    }
  }, [leadId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Remarks</h2>
            <p className="text-sm text-gray-500">View remarks and history</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 pt-0 overflow-y-auto">
          <div className="space-y-6">
            {/* Current Remark */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Remark
              </label>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-700">
                  {remarks || "No remarks available"}
                </p>
              </div>
            </div>

            {/* Remark History */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-gray-400" />
                Remark History
              </h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : remarkHistory.length > 0 ? (
                  remarkHistory.map((history, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <p className="text-gray-700 text-sm">{history.remark}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                          <FiClock className="w-3.5 h-3.5" />
                          {formatDate(history.createdAt)}
                        </p>
                        {history.createdBy && (
                          <p className="text-xs text-gray-500">
                            By: {history.createdBy.name || "Unknown"}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No remark history available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemarksModal;
