import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('token'); // Adjust based on your auth state
  };

  // Fetch only notifications
  const fetchNotifications = async () => {
    try {
      if (!isLoggedIn()) {
        // If not logged in, clear notifications and unread count
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const response = await api.get("/notifications/");
      const notifications = response.data.map(notification => ({
        id: notification._id,
        message: notification.message,
        leadData: notification.leadId,
        isRead: notification.isRead,
        isMinimized: notification.isMinimized,
        minimizedUntil: notification.minimizedUntil,
        createdAt: notification.createdAt
      }));

      // Sort by creation date
      const sortedNotifications = notifications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response?.status === 401) {
        // If unauthorized, clear notifications and navigate to login
        setNotifications([]);
        setUnreadCount(0);
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error("Failed to fetch notifications", {
          description: error.response?.data?.message || "Please try again"
        });
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      // Initial fetch
      fetchNotifications();
      
      // Poll for new notifications every minute only if logged in
      const interval = setInterval(fetchNotifications, 60000);
      
      // Trigger cron job to update notifications on backend
      const triggerCron = async () => {
        try {
          const response = await fetch('/api/notifications/cron');
          if (!response.ok) {
            console.error('Failed to trigger cron job');
          }
        } catch (error) {
          console.error('Error triggering cron job:', error);
        }
      };
      
      // Trigger cron job every 5 minutes
      const cronInterval = setInterval(triggerCron, 300000);
      
      return () => {
        clearInterval(interval);
        clearInterval(cronInterval);
      };
    }
  }, [isLoggedIn]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount(prev => prev - 1);
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read", {
        description: error.response?.data?.message || "Please try again"
      });
    }
  };

  const handleClose = async (id) => {
    try {
      const now = new Date().getTime();
      await api.put(`/notifications/${id}/minimize`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isMinimized: true, minimizedUntil: now + 30000 }
            : notification
        )
      );
    } catch (error) {
      toast.error("Failed to minimize notification", {
        description: error.response?.data?.message || "Please try again"
      });
    }
  };

  const handleClear = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      setUnreadCount(prev => prev - 1);
      toast.success("Notification cleared");
    } catch (error) {
      toast.error("Failed to clear notification", {
        description: error.response?.data?.message || "Please try again"
      });
    }
  };

  const renderNotification = (notification) => {
    const now = new Date().getTime();
    const isHidden = notification.isMinimized && 
                    notification.minimizedUntil && 
                    now <= notification.minimizedUntil;

    if (isHidden) return null;

    const bgColor = notification.isRead ? "bg-gray-50" : "bg-white";
    const borderColor = notification.isRead ? "border-gray-200" : "border-blue-200";

    // Get formatted date and time
    const notificationDate = new Date(notification.createdAt);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formattedDate = notificationDate.toLocaleDateString('en-IN', options);
    const timeAgo = calculateTimeAgo(notificationDate);

    return (
      <div key={notification.id} className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor} ${borderColor}`}>
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            notification.isRead ? "bg-blue-100" : "bg-blue-200"
          }`}>
            <CheckCircleIcon className={`w-5 h-5 ${notification.isRead ? "text-blue-500" : "text-blue-600"}`} />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">
              {notification.leadData?.name || "Unknown Lead"}
            </h3>
            <div className="flex flex-col items-end">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                notification.isRead ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"
              }`}>
                {notification.isRead ? "Read" : "New"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {timeAgo}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">Date:</span>
                <span className="text-lg font-semibold text-gray-900">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">Time:</span>
                <span className="text-lg font-semibold text-gray-900">
                  {notificationDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {notification.leadData?.status && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Status: {notification.leadData.status}
                </span>
              )}
              {notification.leadData?.purpose && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  Purpose: {notification.leadData.purpose}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleClose(notification.id)}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 flex items-center gap-1"
            title="Minimize"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 10a7 7 0 110-14 7 7 0 010 14z" />
            </svg>
            Minimize
          </button>
          {!notification.isRead && (
            <button
              onClick={() => handleMarkAsRead(notification.id)}
              className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800 flex items-center gap-1"
              title="Mark as read"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Read
            </button>
          )}
          <button
            onClick={() => handleClear(notification.id)}
            className="text-xs px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-800 flex items-center gap-1"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    );
  };

  // Helper function to calculate time ago
  const calculateTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3v2.25M21 6a9 9 0 11-18 0 9 9 0 0118 0zM12 18.75h.007v.008H12v-.008z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">You have no new notifications.</p>
              </div>
            ) : (
              notifications.map(renderNotification)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
