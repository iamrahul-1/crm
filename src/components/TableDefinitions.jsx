import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";

export const getLeadTableColumns = ({
  handleViewLead,
  setEditingLead,
  setDeleteConfirm,
  toggleFavorite,
  userRole,
}) => [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Phone",
    accessor: "phone",
  },

  {
    header: "Purpose",
    accessor: "purpose",
  },
  {
    header: "Remarks",
    accessor: "remarks",
    render: (row) => (
      <div className="flex justify-center">
        <button
          onClick={() => handleViewLead(row)}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          View
        </button>
      </div>
    ),
  },
  {
    header: "Created By",
    accessor: "createdBy",
    render: (row) => <div className="text-center">{row.createdBy}</div>,
  },
  {
    header: "Action",
    accessor: "action",
    render: (row) => (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setEditingLead(row)}
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <FiEdit2 size={18} />
        </button>
        {userRole === "admin" && (
          <button
            onClick={() => setDeleteConfirm(row._id)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        )}
        <button
          onClick={() => toggleFavorite(row._id, row)}
          className="p-1.5 rounded-lg transition-colors"
          title={row.favourite ? "Remove from favorites" : "Add to favorites"}
        >
          <AiFillHeart
            size={20}
            className={row.favourite ? "text-red-500" : "text-gray-300"}
          />
        </button>
      </div>
    ),
  },
];
