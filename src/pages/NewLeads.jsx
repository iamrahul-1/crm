import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";
import api from "../services/api";
import EditLeadModal from "../components/EditLeadModal";

const NewLeads = () => {
  const [favorites, setFavorites] = useState({});
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingLead, setEditingLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;

  useEffect(() => {
    const fetchNewLeads = async () => {
      try {
        const response = await api.get(
          `/leads/new?page=${currentPage}&limit=${limit}`
        );
        setLeads(response.data.leads || []); // Assuming the API returns { leads: [], totalPages: number }
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch new leads");
        setLoading(false);
        toast.error("Failed to fetch new leads. Please try again later.");
      }
    };

    fetchNewLeads();
  }, [currentPage]);

  const handleEdit = async (updatedData) => {
    try {
      const response = await api.put(`/leads/${editingLead._id}`, updatedData);
      setLeads(
        leads.map((lead) =>
          lead._id === editingLead._id ? response.data.lead : lead
        )
      );
      setEditingLead(null);
      toast.success("Lead updated successfully");
    } catch (err) {
      toast.error("Failed to update lead");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter((lead) => lead._id !== id));
      toast.success("Lead deleted successfully");
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Phone Number",
      accessor: "phone",
    },
    {
      header: "Purpose",
      accessor: "purpose",
    },
    {
      header: "Remark",
      accessor: "remarks",
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => setEditingLead(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
          <button
            onClick={() => toggleFavorite(row._id)}
            className="transition-colors"
          >
            {favorites[row._id] ? (
              <AiFillHeart size={20} className="text-red-500" />
            ) : (
              <AiOutlineHeart
                size={20}
                className="text-gray-600 hover:text-red-500"
              />
            )}
          </button>
        </div>
      ),
    },
  ];

  const filteredLeads = leads.filter((lead) => {
    return (
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(lead.phone).includes(searchQuery) ||
      lead.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.remarks.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="md:ml-52 pt-[60px] md:pt-[120px] flex flex-col h-full md:px-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">New Leads</h3>
      <div className="p-4 w-full mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search leads by name, phone, purpose, or remarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <>
              <Table columns={columns} data={filteredLeads} />
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage >= totalPages
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
};

export default NewLeads;
