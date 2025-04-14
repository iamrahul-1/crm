import React from "react";
import { useState, useEffect } from "react";
import LeadList from "../components/LeadList";
import api from "../services/api";
import PropTypes from "prop-types";

const LeadPotential = ({ potential }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/leads/potential/${potential}`);
        setLeads(response.data.leads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [potential]);

  const handleLeadUpdate = (updatedLead) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead._id === updatedLead._id ? updatedLead : lead
      )
    );
  };

  const title = {
    Hot: "Hot Leads",
    Warm: "Warm Leads",
    Cold: "Cold Leads",
  }[potential];

  return <LeadList title={title} leads={leads} loading={loading} />;
};

LeadPotential.propTypes = {
  potential: PropTypes.oneOf(["Hot", "Warm", "Cold"]).isRequired,
};

export default LeadPotential;
