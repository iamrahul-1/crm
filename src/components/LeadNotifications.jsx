import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const LeadNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  useEffect(() => {
    // Load saved notifications from localStorage
    const savedNotifications = localStorage.getItem('leadNotifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      // Filter out notifications that are still in minimized cooldown
      const now = new Date().getTime();
      const activeNotifications = parsedNotifications.filter(notification => {
        if (!notification.minimizedUntil) return true;
        return now > notification.minimizedUntil;
      });
      setNotifications(activeNotifications);
    }
  }, []);

  useEffect(() => {
    // Load saved notifications from localStorage
    const savedNotifications = localStorage.getItem('leadNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const checkLeadReminders = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      console.log("Checking leads for date:", formattedDate);
      const response = await api.get(`/leads/schedule/custom/${formattedDate}`);
      const leads = response.data.leads;
      console.log("Fetched leads:", leads);

      const now = new Date();
      const currentTime = now.toLocaleTimeString();
      console.log("Current time:", currentTime);

      // Find leads that are scheduled within the next 20 seconds
      const upcomingLead = leads.find((lead) => {
        if (!lead.time) {
          console.log("Lead has no time:", lead);
          return false;
        }

        const [hours, minutes] = lead.time.split(":");
        const leadDate = new Date(lead.date);
        leadDate.setHours(parseInt(hours, 10));
        leadDate.setMinutes(parseInt(minutes, 10));
        const leadTime = leadDate.toLocaleTimeString();

        console.log("Checking lead:", {
          leadId: lead._id,
          leadName: lead.name,
          scheduledTime: leadTime,
          currentTime: currentTime
        });

        const timeDiff = Math.abs(now.getTime() - leadDate.getTime()) / 1000;
        console.log("Time difference in seconds:", timeDiff);
        
        const isUpcoming = timeDiff <= 20;
        if (isUpcoming) {
          console.log("Found upcoming lead within 20 seconds:", lead);
        }
        return isUpcoming;
      });

      if (upcomingLead && !notifications.find(n => n._id === upcomingLead._id)) {
        console.log("Adding new notification:", upcomingLead);
        const newNotification = { ...upcomingLead, isMinimized: false };
        const updatedNotifications = [...notifications, newNotification];
        setNotifications(updatedNotifications);
        localStorage.setItem('leadNotifications', JSON.stringify(updatedNotifications));

        const formattedTime = upcomingLead.time || "No time specified";
        const leadName = upcomingLead.name || "Unknown Lead";
        const leadPurpose = upcomingLead.purpose || "No purpose specified";

        toast.info(
          `Reminder: ${leadName} - ${leadPurpose} at ${formattedTime}`, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error checking lead reminders:", error);
    }
  };

  useEffect(() => {
    if (!isNotificationEnabled) return;

    console.log("Starting lead reminder checks...");
    checkLeadReminders();

    const interval = setInterval(() => {
      console.log("Running periodic lead check (20s interval)...");
      checkLeadReminders();
    }, 20000);

    return () => {
      console.log("Cleaning up lead reminder interval");
      clearInterval(interval);
    };
  }, [isNotificationEnabled, notifications]);

  const handleClose = (notificationId) => {
    console.log("Minimizing notification:", notificationId);
    const minimizedUntil = new Date().getTime() + (30 * 1000); // 30 seconds from now
    const updatedNotifications = notifications.map(notification => 
      notification._id === notificationId 
        ? { ...notification, isMinimized: true, minimizedUntil }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('leadNotifications', JSON.stringify(updatedNotifications));
  };

  const handleMarkAsRead = (notificationId) => {
    console.log("Marking notification as read:", notificationId);
    const updatedNotifications = notifications.filter(
      notification => notification._id !== notificationId
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('leadNotifications', JSON.stringify(updatedNotifications));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      {notifications.map(notification => {
        const now = new Date().getTime();
        const isHidden = notification.isMinimized && (!notification.minimizedUntil || now <= notification.minimizedUntil);
        return !isHidden && (
          <div key={notification._id} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Reminder!</h3>
                <p className="text-gray-700">Lead: {notification.name || "Unknown"}</p>
                <p className="text-gray-600">Purpose: {notification.purpose || "Not specified"}</p>
                <p className="text-gray-500">Time: {notification.time || "Not specified"}</p>
                {notification.remarks && (
                  <p className="text-gray-500">Remarks: {notification.remarks}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleClose(notification._id)}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Close
                </button>
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded"
                >
                  Mark as Read
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default LeadNotification;