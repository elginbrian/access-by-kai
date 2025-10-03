export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type NotificationType = 
  | 'TRAIN_BOOKING'
  | 'FACILITY_BOOKING'
  | 'TICKET_TRANSFER'
  | 'TICKET_CANCELLATION'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'SCHEDULE_CHANGE'
  | 'PROMOTION'
  | 'SYSTEM_UPDATE'
  | 'REMINDER'
  | 'REVIEW_REQUEST';

export type NotificationReferenceType = 
  | 'TRAIN_BOOKING'
  | 'FACILITY_BOOKING'
  | 'TICKET'
  | 'PAYMENT'
  | 'PROMOTION'
  | 'SYSTEM'
  | 'REVIEW';

// Enum for review service types (matching jenis_layanan_enum)
export type JenisLayanan = 'BOOKING_TIKET' | 'EPORTER' | 'LOGISTIK' | 'LAPORAN_MANUAL';

export interface Notification {
  notification_id: number;
  user_id: number;
  tipe_notifikasi: NotificationType;
  judul: string;
  pesan: string;
  reference_id?: number;
  reference_type?: NotificationReferenceType;
  is_read: boolean;
  priority_level: NotificationPriority;
  action_url?: string;
  created_at: string;
  read_at?: string;
}

// API compatible types (matching database schema exactly)
export interface CreateNotificationRequest {
  user_id: number;
  tipe_notifikasi: NotificationType;
  judul: string;
  pesan: string;
  reference_id?: number;
  reference_type?: NotificationReferenceType;
  priority_level?: NotificationPriority;
  action_url?: string;
}

export interface NotificationFilters {
  is_read?: boolean;
  priority?: NotificationPriority;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

export interface PaginatedNotifications {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Review System Types (matching ulasan table)
export interface Review {
  ulasan_id: number;
  pengguna_id: number;
  jenis_layanan: JenisLayanan;
  penilaian: number; // 1-5
  komentar: string;
  platform: string;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export interface CreateReviewRequest {
  pengguna_id: number;
  jenis_layanan: JenisLayanan;
  penilaian: number;
  komentar: string;
  platform?: string;
}

export interface ReviewFilters {
  jenis_layanan?: JenisLayanan;
  penilaian?: number;
  platform?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedReviews {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  byService: {
    [key in JenisLayanan]: {
      count: number;
      averageRating: number;
    };
  };
}