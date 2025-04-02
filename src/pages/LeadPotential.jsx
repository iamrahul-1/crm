import React from "react";
import LeadList from "../components/LeadList";

const LeadPotential = ({ potential }) => {
  const title = {
    Hot: "Hot Leads",
    Warm: "Warm Leads",
    Cold: "Cold Leads",
  }[potential];

  return <LeadList title={title} endpoint={`/leads/potential/${potential}`} />;
};

export default LeadPotential;
