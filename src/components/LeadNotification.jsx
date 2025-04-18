import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../services/api";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load saved notifications from localStorage
    const savedNotifications = JSON.parse(
      localStorage.getItem("Notifications") || "[]"
    );
    setNotifications(savedNotifications);
  }, []);

  const handleClose = (notificationId) => {
    const now = new Date().getTime();
    const updatedNotifications = notifications.map((notification) =>
      notification._id === notificationId
        ? { ...notification, isMinimized: true, minimizedUntil: now + 30000 } // 30 seconds from now
        : notification
    );

    // Update state and localStorage
    setNotifications(updatedNotifications);
    localStorage.setItem("Notifications", JSON.stringify(updatedNotifications));

    // Send minimize request to backend
    api.put(`/notifications/${notificationId}/minimize`).catch((error) => {
      toast.error("Error minimizing notification");
      console.error("Error minimizing notification:", error);
    });
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Update backend
      await api.put(`/notifications/${notificationId}/read`);

      // Update state and localStorage
      const updatedNotifications = notifications.filter(
        (notification) => notification._id !== notificationId
      );
      setNotifications(updatedNotifications);
      localStorage.setItem(
        "Notifications",
        JSON.stringify(updatedNotifications)
      );
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Error marking notification as read");
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => {
        const now = new Date().getTime();
        const isHidden =
          notification.isMinimized && now <= notification.minimizedUntil;
        return (
          !isHidden && (
            <div
              key={notification._id}
              className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    Purpose: {notification.leadId?.purpose || "Not specified"}
                  </p>
                  <p className="text-gray-500">
                    Time: {notification.leadId?.time || "Not specified"}
                  </p>
                  {notification.leadId?.remarks && (
                    <p className="text-gray-500">
                      Remarks: {notification.leadId?.remarks}
                    </p>
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
        );
      })}
    </div>
  );
};

export default Notification;
