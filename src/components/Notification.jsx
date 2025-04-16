import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";
import getEnvConfig from "../config/env";

const { apiUrl } = getEnvConfig();
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request failed to send");
    return Promise.reject(error);
  }
);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [reminderNotifications, setReminderNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchReminders();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/");
      console.log("Raw API response:", response);

      if (!response.data || !Array.isArray(response.data)) {
        console.error(
          "Invalid response format. Expected notifications array in response."
        );
        throw new Error(
          "Invalid response format. Expected notifications array in response."
        );
      }

      const notifications = response.data.map((notification) => ({
        id: notification._id,
        message: notification.message,
        leadData: notification.leadId,
        isRead: notification.isRead,
        isMinimized: notification.isMinimized,
        minimizedUntil: notification.minimizedUntil,
        createdAt: notification.createdAt,
      }));

      console.log("Converted notifications:", notifications);
      setNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await api.get("/notifications/reminders");
      console.log("Reminder response:", response.data);
      setReminderNotifications(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch reminders");
    }
  };

  useEffect(() => {
    if (!isNotificationEnabled) return;

    fetchReminders();
    const interval = setInterval(fetchReminders, 20000);
    return () => clearInterval(interval);
  }, [isNotificationEnabled]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleClearNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error clearing notification:", error);
    }
  };

  const handleMarkReminderAsRead = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      const updatedNotifications = reminderNotifications.filter(
        (notification) => notification._id !== notificationId
      );
      setReminderNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking reminder as read:", error);
    }
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
            {reminderNotifications.map((notification) => {
              const now = new Date().getTime();
              const isHidden =
                notification.isMinimized &&
                (!notification.minimizedUntil ||
                  now <= notification.minimizedUntil);
              return (
                !isHidden && (
                  <div
                    key={notification._id}
                    className="flex items-start gap-3 p-3 border-b border-gray-200 bg-yellow-50"
                  >
                    <div className="flex-shrink-0">
                      <ClockIcon className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">
                        Reminder: {notification.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Purpose: {notification.purpose || "Not specified"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Time: {notification.time || "Not specified"}
                      </p>
                      {notification.remarks && (
                        <p className="text-sm text-gray-500">
                          Remarks: {notification.remarks}
                        </p>
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
                        onClick={() =>
                          handleMarkReminderAsRead(notification._id)
                        }
                        className="text-xs px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                )
              );
            })}

            {/* Lead Notifications */}
            {notifications.length === 0 &&
            reminderNotifications.length === 0 ? (
              <p className="text-gray-500">No lead notifications</p>
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
                    <p className="text-sm text-gray-500">
                      Status: {notification.leadData?.status || "Not specified"}
                    </p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleClearNotification(notification.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
                    >
                      Clear
                    </button>
                  </div>
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
