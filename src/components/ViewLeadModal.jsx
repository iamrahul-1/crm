import React from "react";
import {
  FiX,
  FiUser,
  FiPhone,
  FiCalendar,
  FiTarget,
  FiMessageSquare,
} from "react-icons/fi";
import PropTypes from "prop-types";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="p-2 bg-blue-50 rounded-lg">
      <Icon className="w-5 h-5 text-blue-500" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-gray-900 font-medium">
        {value || "Not specified"}
      </p>
    </div>
  </div>
);

InfoRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const ViewLeadModal = ({ lead, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-1">
            <InfoRow icon={FiUser} label="Name" value={lead.name} />
            <InfoRow icon={FiPhone} label="Phone Number" value={lead.phone} />
            <InfoRow icon={FiTarget} label="Purpose" value={lead.purpose} />
            <InfoRow
              icon={FiMessageSquare}
              label="Remarks"
              value={lead.remarks}
            />
            <InfoRow
              icon={FiTarget}
              label="Potential"
              value={lead.potential?.join(", ")}
            />
            <InfoRow
              icon={FiTarget}
              label="Status"
              value={lead.status?.join(", ")}
            />
            <InfoRow
              icon={FiCalendar}
              label="Date"
              value={formatDate(lead.date)}
            />
            <InfoRow
              icon={FiCalendar}
              label="Created At"
              value={formatDate(lead.createdAt)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewLeadModal.propTypes = {
  lead: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.number,
    purpose: PropTypes.string,
    remarks: PropTypes.string,
    potential: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewLeadModal;
