import React from 'react';
import { Review, JenisLayanan } from '@/types/notification';
import { useUpdateReview, useDeleteReview } from '@/lib/hooks/useNotifications';

// Simple date formatting function to replace date-fns
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'baru saja';
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
    return date.toLocaleDateString('id-ID');
  }
};

interface ReviewItemProps {
  review: Review;
  showUserInfo?: boolean;
  canEdit?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

const getServiceName = (service: JenisLayanan): string => {
  switch (service) {
    case 'BOOKING_TIKET':
      return 'Pemesanan Tiket';
    case 'EPORTER':
      return 'E-Porter';
    case 'LOGISTIK':
      return 'Logistik';
    case 'LAPORAN_MANUAL':
      return 'Laporan Manual';
    default:
      return service;
  }
};

const getServiceIcon = (service: JenisLayanan): string => {
  switch (service) {
    case 'BOOKING_TIKET':
      return '🎫';
    case 'EPORTER':
      return '🧳';
    case 'LOGISTIK':
      return '📦';
    case 'LAPORAN_MANUAL':
      return '📋';
    default:
      return '⭐';
  }
};

const renderStars = (rating: number): React.ReactNode => {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
      ★
    </span>
  ));
};

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  showUserInfo = false,
  canEdit = false,
  onEdit,
  onDelete,
}) => {
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      deleteReviewMutation.mutate(review.ulasan_id.toString(), {
        onSuccess: () => {
          onDelete?.(review.ulasan_id.toString());
        },
      });
    }
  };

  const timeAgo = formatDistanceToNow(new Date(review.dibuat_pada));

  const isUpdated = review.diperbarui_pada !== review.dibuat_pada;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getServiceIcon(review.jenis_layanan)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {getServiceName(review.jenis_layanan)}
            </h3>
            <div className="flex items-center space-x-1">
              {renderStars(review.penilaian)}
              <span className="text-sm text-gray-600 ml-2">
                ({review.penilaian}/5)
              </span>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit?.(review)}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              title="Edit ulasan"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteReviewMutation.isPending}
              className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              title="Hapus ulasan"
            >
              {deleteReviewMutation.isPending ? '...' : 'Hapus'}
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-gray-700 leading-relaxed">
          "{review.komentar}"
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>
            {timeAgo}
            {isUpdated && (
              <span className="ml-1 text-blue-600">(diperbarui)</span>
            )}
          </span>
          {showUserInfo && (review as any).pengguna && (
            <div className="flex items-center space-x-2">
              <img
                src={(review as any).pengguna.foto_profil_url || '/default-avatar.png'}
                alt="Profile"
                className="w-5 h-5 rounded-full"
              />
              <span>{(review as any).pengguna.nama_lengkap}</span>
            </div>
          )}
          <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
            {review.platform}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;