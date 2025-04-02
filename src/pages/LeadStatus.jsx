import React from "react";
import LeadList from "../components/LeadList";

const LeadStatus = ({ status }) => {
  const title = {
    open: "Opened Leads",
    inprogress: "In Progress Leads",
    sitevisitscheduled: "Site Visit Scheduled",
    sitevisited: "Site Visited Leads",
    closed: "Closed Leads",
    rejected: "Rejected Leads",
  }[status];

  return <LeadList title={title} endpoint={`/leads/status/${status}`} />;
};

export default LeadStatus;
