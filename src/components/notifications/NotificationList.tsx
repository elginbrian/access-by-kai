import React, { useState } from 'react';
import { useNotifications, useMarkAllAsRead } from '@/lib/hooks/useNotifications';
import { NotificationFilters, NotificationType, NotificationPriority } from '@/types/notification';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  userId?: string;
  showFilters?: boolean;
  itemsPerPage?: number;
}

const NotificationList: React.FC<NotificationListProps> = ({
  userId,
  showFilters = true,
  itemsPerPage = 10,
}) => {
  const [filters, setFilters] = useState<NotificationFilters>({
    page: 1,
    limit: itemsPerPage,
  });

  const { data, isLoading, error, refetch } = useNotifications(filters);
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const unreadCount = data?.data?.filter(n => !n.is_read).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Gagal memuat notifikasi
        </h3>
        <p className="text-gray-500 mb-4">
          Terjadi kesalahan saat mengambil data notifikasi
        </p>
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const notifications = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header with filters and actions */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-4">
              {/* Type filter */}
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange({ 
                  type: e.target.value as NotificationType || undefined 
                })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Tipe</option>
                <option value="TRAIN_BOOKING">Pemesanan Kereta</option>
                <option value="FACILITY_BOOKING">Pemesanan Fasilitas</option>
                <option value="PAYMENT_SUCCESS">Pembayaran Berhasil</option>
                <option value="PAYMENT_FAILED">Pembayaran Gagal</option>
                <option value="TICKET_TRANSFER">Transfer Tiket</option>
                <option value="TICKET_CANCELLATION">Pembatalan Tiket</option>
                <option value="SCHEDULE_CHANGE">Perubahan Jadwal</option>
                <option value="PROMOTION">Promosi</option>
                <option value="SYSTEM_UPDATE">Update Sistem</option>
                <option value="REMINDER">Pengingat</option>
                <option value="REVIEW_REQUEST">Permintaan Ulasan</option>
              </select>

              {/* Priority filter */}
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange({ 
                  priority: e.target.value as NotificationPriority || undefined 
                })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Prioritas</option>
                <option value="LOW">Rendah</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Tinggi</option>
                <option value="URGENT">Mendesak</option>
              </select>

              {/* Read status filter */}
              <select
                value={filters.is_read?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange({ 
                    is_read: value === '' ? undefined : value === 'true'
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="false">Belum Dibaca</option>
                <option value="true">Sudah Dibaca</option>
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {markAllAsReadMutation.isPending ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    '✓'
                  )}
                  Tandai Semua Dibaca ({unreadCount})
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600">
            Total: {data?.total || 0} notifikasi
            {unreadCount > 0 && (
              <span className="ml-2">• {unreadCount} belum dibaca</span>
            )}
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5l-5-5h5v-6h-5l5-5l5 5h-5v6z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada notifikasi
            </h3>
            <p className="text-gray-500">
              {filters.type || filters.priority || filters.is_read !== undefined
                ? 'Tidak ada notifikasi yang sesuai dengan filter yang dipilih.'
                : 'Anda belum memiliki notifikasi.'}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.notification_id}
              notification={notification}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
            disabled={filters.page === 1}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Halaman {filters.page || 1} dari {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
            disabled={filters.page === totalPages}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;