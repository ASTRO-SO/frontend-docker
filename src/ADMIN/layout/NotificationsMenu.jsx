import React from "react";

/**
 * Notifications dropdown menu
 * @param {Object} props - Component props
 * @param {Array} props.notifications - List of notification objects
 * @param {Function} props.onClose - Function to call when menu should close
 */
function NotificationsMenu({ notifications, onClose }) {
  return (
    <div
      id="notifications-menu"
      className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-zinc-800 border-zinc-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      onClick={onClose}
    >
      <div className="p-4 border-b border-zinc-700">
        <h3 className="text-base font-semibold text-white">Notifications</h3>
      </div>

      <div className="overflow-y-auto max-h-80">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="p-4 border-b border-zinc-700">
              <p className="text-sm text-gray-200">{notification.text}</p>
              <span className="text-xs text-gray-400">{notification.time}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsMenu;
