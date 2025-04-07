import React, { useState, useEffect } from "react";
import LeadList from "../components/LeadList";
import api from "../services/api";
import PropTypes from "prop-types";

const LeadStatus = ({ status }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [status]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/leads/status/${status}`);
      setLeads(response.data.leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const title = {
    open: "Opened Leads",
    inprogress: "In Progress Leads",
    sitevisitscheduled: "Site Visit Scheduled",
    sitevisited: "Site Visited Leads",
    closed: "Closed Leads",
    rejected: "Rejected Leads",
  }[status];

  return <LeadList title={title} leads={leads} loading={loading} />;
};

LeadStatus.propTypes = {
  status: PropTypes.oneOf([
    "open",
    "inprogress",
    "sitevisitscheduled",
    "sitevisited",
    "closed",
    "rejected",
  ]).isRequired,
};

export default LeadStatus;
