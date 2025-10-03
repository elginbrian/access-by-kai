import React, { useState } from 'react';
import { useUnreadNotificationCount } from '@/lib/hooks/useNotifications';
import Link from 'next/link';

interface NotificationBellProps {
  userId?: string;
  className?: string;
  showPreview?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  userId,
  className = '',
  showPreview = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadData, isLoading } = useUnreadNotificationCount();
  
  const unreadCount = unreadData?.count || 0;

  return (
    <div className={`relative ${className}`}>
      <Link
        href={userId ? `/profile/${userId}/notification` : '/notification'}
        className="relative inline-flex items-center p-2 text-gray-600 hover:text-gray-900 transition-colors"
        onMouseEnter={() => showPreview && setIsOpen(true)}
        onMouseLeave={() => showPreview && setIsOpen(false)}
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5V8a3 3 0 00-6 0v9l-5 5h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Notification Badge */}
        {!isLoading && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <span className="absolute -top-1 -right-1 bg-gray-400 rounded-full w-3 h-3 animate-pulse"></span>
        )}
      </Link>

      {/* Preview Tooltip (optional) */}
      {showPreview && isOpen && unreadCount > 0 && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Notifikasi
              </h3>
              <span className="text-xs text-gray-500">
                {unreadCount} baru
              </span>
            </div>
            
            <div className="text-center py-4">
              <div className="text-blue-500 mb-2">
                <svg className="mx-auto h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21Z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Anda memiliki {unreadCount} notifikasi yang belum dibaca
              </p>
              <Link
                href={userId ? `/profile/${userId}/notification` : '/notification'}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Lihat Semua
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;