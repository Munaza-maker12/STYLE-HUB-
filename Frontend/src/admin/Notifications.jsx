
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBell } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import "./Notifications.css";

const Notifications = ({ isAdmin = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const fetchNotifications = async () => {
    try {
      if (isAdmin) {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:4000/api/notifications/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.notifications.filter(n => !n.read).length);
        }
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) return;

        // const token = localStorage.getItem("token");
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `http://localhost:4000/api/notifications/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.notifications.filter(n => !n.read).length);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case "order": return "📦";
      case "return": return "🔄";
      case "stock": return "📊";
      default: return "🔔";
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="notifications-container">
      <div 
        className="notification-bell" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button onClick={() => setShowDropdown(false)}>
              <MdClose size={20} />
            </button>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => !notif.read && markAsRead(notif._id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                  
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">
                      {getTimeAgo(notif.createdAt)}
                    </span>
                  </div>

                  <button
                    className="delete-notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notifications-footer">
              <button onClick={fetchNotifications}>Refresh</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;