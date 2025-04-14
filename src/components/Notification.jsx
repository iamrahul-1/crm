import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import { toast } from "react-toastify";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [reminderNotifications, setReminderNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Load saved reminder notifications from localStorage
    const savedNotifications = localStorage.getItem('leadNotifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      const now = new Date().getTime();
      const activeNotifications = parsedNotifications.filter(notification => {
        if (!notification.minimizedUntil) return true;
        return now > notification.minimizedUntil;
      });
      setReminderNotifications(activeNotifications);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/leads/tl");
      console.log("Raw API response:", response);
      
      if (!response.data || !response.data.leads || !Array.isArray(response.data.leads)) {
        console.error("Invalid response format. Expected leads array in response.");
        throw new Error("Invalid response format. Expected leads array in response.");
      }

      const notifications = response.data.leads.map(lead => ({
        id: lead.id,
        title: `New Lead: ${lead.name}`,
        message: `Phone: ${lead.phone}, Status: ${lead.status}`,
        time: new Date(lead.createdAt).toLocaleString(),
        read: false,
        leadData: lead
      }));

      console.log("Converted notifications:", notifications);
      setNotifications(notifications);
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const checkLeadReminders = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const response = await api.get(`/leads/schedule/custom/${formattedDate}`);
      const leads = response.data.leads;
      const now = new Date();

      const upcomingLead = leads.find((lead) => {
        if (!lead.time) return false;

        const [hours, minutes] = lead.time.split(":");
        const leadDate = new Date(lead.date);
        leadDate.setHours(parseInt(hours, 10));
        leadDate.setMinutes(parseInt(minutes, 10));
        
        const timeDiff = Math.abs(now.getTime() - leadDate.getTime()) / 1000;
        return timeDiff <= 20;
      });

      if (upcomingLead && !reminderNotifications.find(n => n._id === upcomingLead._id)) {
        const newNotification = { ...upcomingLead, isMinimized: false };
        const updatedNotifications = [...reminderNotifications, newNotification];
        setReminderNotifications(updatedNotifications);
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
        });
      }
    } catch (error) {
      console.error("Error checking lead reminders:", error);
    }
  };

  useEffect(() => {
    if (!isNotificationEnabled) return;

    checkLeadReminders();
    const interval = setInterval(checkLeadReminders, 20000);
    return () => clearInterval(interval);
  }, [isNotificationEnabled, reminderNotifications]);

  const markAsRead = async (id) => {
    try {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleCloseReminder = (notificationId) => {
    const minimizedUntil = new Date().getTime() + (30 * 1000); // 30 seconds
    const updatedNotifications = reminderNotifications.map(notification => 
      notification._id === notificationId 
        ? { ...notification, isMinimized: true, minimizedUntil }
        : notification
    );
    setReminderNotifications(updatedNotifications);
    localStorage.setItem('leadNotifications', JSON.stringify(updatedNotifications));
  };

  const handleMarkReminderAsRead = (notificationId) => {
    const updatedNotifications = reminderNotifications.filter(
      notification => notification._id !== notificationId
    );
    setReminderNotifications(updatedNotifications);
    localStorage.setItem('leadNotifications', JSON.stringify(updatedNotifications));
  };

  const totalUnreadCount = unreadCount + reminderNotifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {totalUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            
            {/* Reminder Notifications */}
            {reminderNotifications.map(notification => {
              const now = new Date().getTime();
              const isHidden = notification.isMinimized && (!notification.minimizedUntil || now <= notification.minimizedUntil);
              return !isHidden && (
                <div
                  key={notification._id}
                  className="flex items-start gap-3 p-3 border-b border-gray-200 bg-yellow-50"
                >
                  <div className="flex-shrink-0">
                    <ClockIcon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">Reminder: {notification.name}</p>
                    <p className="text-sm text-gray-500">Purpose: {notification.purpose || "Not specified"}</p>
                    <p className="text-sm text-gray-500">Time: {notification.time || "Not specified"}</p>
                    {notification.remarks && (
                      <p className="text-sm text-gray-500">Remarks: {notification.remarks}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleCloseReminder(notification._id)}
                      className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleMarkReminderAsRead(notification._id)}
                      className="text-xs px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
                    >
                      Mark as Read
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Regular Notifications */}
            {notifications.length === 0 && reminderNotifications.length === 0 ? (
              <p className="text-gray-500">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 border-b border-gray-200 ${
                    notification.read ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
