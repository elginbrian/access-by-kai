import React from "react";
import { Notification, NotificationPriority, NotificationType } from "@/types/notification";
import { useMarkNotificationAsRead, useDeleteNotification } from "@/lib/hooks/useNotifications";

// Simple date formatting function to replace date-fns
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "baru saja";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  } else {
    return date.toLocaleDateString("id-ID");
  }
};

interface NotificationItemProps {
  notification: Notification;
  onRead?: (notification: Notification) => void;
  onDelete?: (notificationId: string) => void;
}

const getPriorityColor = (priority: NotificationPriority): string => {
  switch (priority) {
    case "URGENT":
      return "border-l-red-600 bg-red-50";
    case "HIGH":
      return "border-l-red-500 bg-red-50";
    case "NORMAL":
      return "border-l-yellow-500 bg-yellow-50";
    case "LOW":
      return "border-l-green-500 bg-green-50";
    default:
      return "border-l-gray-500 bg-gray-50";
  }
};

const getTypeIcon = (type: NotificationType): string => {
  switch (type) {
    case "TRAIN_BOOKING":
      return "🎫";
    case "PAYMENT_SUCCESS":
    case "PAYMENT_FAILED":
      return "💳";
    case "TICKET_TRANSFER":
      return "🔄";
    case "SYSTEM_UPDATE":
      return "⚙️";
    case "PROMOTION":
      return "🎁";
    case "FACILITY_BOOKING":
      return "🚿";
    case "REVIEW_REQUEST":
      return "⭐";
    default:
      return "📢";
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, onDelete }) => {
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleMarkAsRead = () => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(
        { id: String(notification.notification_id), is_read: true },
        {
          onSuccess: () => {
            onRead?.(notification);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    deleteNotificationMutation.mutate(String(notification.notification_id), {
      onSuccess: () => {
        onDelete?.(String(notification.notification_id));
      },
    });
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at));

  return (
    <div className={`p-4 border-l-4 rounded-lg mb-3 transition-all duration-200 hover:shadow-md ${notification.is_read ? "bg-white border-l-gray-300" : getPriorityColor(notification.priority_level)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl mt-1">{getTypeIcon(notification.tipe_notifikasi)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`text-sm font-semibold truncate ${notification.is_read ? "text-gray-700" : "text-gray-900"}`}>{notification.judul}</h3>

              {!notification.is_read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
            </div>

            <p className={`text-sm mb-2 ${notification.is_read ? "text-gray-500" : "text-gray-700"}`}>{notification.pesan}</p>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{timeAgo}</span>
              <span className="capitalize bg-gray-100 px-2 py-1 rounded text-gray-600">{notification.tipe_notifikasi.replace("_", " ").toLowerCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {!notification.is_read && (
            <button onClick={handleMarkAsRead} disabled={markAsReadMutation.isPending} className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors disabled:opacity-50" title="Tandai sebagai dibaca">
              {markAsReadMutation.isPending ? "..." : "Baca"}
            </button>
          )}

          <button onClick={handleDelete} disabled={deleteNotificationMutation.isPending} className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors disabled:opacity-50" title="Hapus notifikasi">
            {deleteNotificationMutation.isPending ? "..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
