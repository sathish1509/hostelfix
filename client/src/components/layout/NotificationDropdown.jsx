import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Info, AlertTriangle } from "lucide-react";
import { cn } from "../../utils/cn";

const NotificationDropdown = ({ isOpen }) => {
  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Complaint Approved", message: "Your complaint #C-1002 has been approved.", type: "success", time: "2 min ago", read: false },
    { id: 2, title: "New Announcement", message: "Water supply maintenance tomorrow.", type: "info", time: "1 hour ago", read: false },
    { id: 3, title: "SLA Breech Warning", message: "Complaint #C-998 is overdue.", type: "warning", time: "1 day ago", read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
        <button 
          onClick={markAllAsRead}
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer flex gap-3",
                  !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                )}
              >
                <div className={cn(
                  "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                  !notification.read ? "bg-primary-500" : "bg-transparent"
                )} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                      <p className={cn("text-sm font-medium", !notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400")}>
                          {notification.title}
                      </p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notification.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;
