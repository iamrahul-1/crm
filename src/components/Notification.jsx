import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import api from "../services/api";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/leads/tl");
      console.log("Raw API response:", response);

      if (
        !response.data ||
        !response.data.leads ||
        !Array.isArray(response.data.leads)
      ) {
        console.error(
          "Invalid response format. Expected leads array in response."
        );
        throw new Error(
          "Invalid response format. Expected leads array in response."
        );
      }

      // Convert leads to notification format
      const notifications = response.data.leads.map((lead) => ({
        id: lead.id,
        title: `New Lead: ${lead.name}`,
        message: `Phone: ${lead.phone}, Status: ${lead.status}`,
        time: new Date(lead.createdAt).toLocaleString(),
        read: false,
        leadData: lead, // Store the original lead data
      }));

      console.log("Converted notifications:", notifications);
      setNotifications(notifications);
      setUnreadCount(notifications.length); // All new leads are unread
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Update the notification state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 border-b border-gray-200 ${
                    notification.read ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-500">
                      {notification.message}
                    </p>
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
