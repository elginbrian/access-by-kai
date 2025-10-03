import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification, NotificationFilters, NotificationPriority, NotificationType, PaginatedNotifications, CreateNotificationRequest, Review, ReviewFilters, PaginatedReviews, CreateReviewRequest, JenisLayanan } from "@/types/notification";

// Hook for fetching notifications
export const useNotifications = (filters?: NotificationFilters) => {
  const buildQueryString = (filters?: NotificationFilters) => {
    if (!filters) return "";
    const params = new URLSearchParams();

    if (filters.type) params.append("type", filters.type);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.is_read !== undefined) params.append("is_read", filters.is_read.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return `?${params.toString()}`;
  };

  return useQuery<PaginatedNotifications>({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const response = await fetch(`/api/notifications${queryString}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook for marking notification as read/unread
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_read }: { id: string | number; is_read: boolean }) => {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ is_read }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// Hook for deleting notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// Hook for creating notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationData: CreateNotificationRequest) => {
      const response = await fetch("/api/notifications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// Hook for getting unread notification count
export const useUnreadNotificationCount = () => {
  return useQuery<{ count: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const response = await fetch("/api/notifications?is_read=false&limit=0", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch unread count");
      }

      const data = await response.json();
      return { count: data.total || 0 };
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook for marking all notifications as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Fetch all unread notifications first
      const unreadResponse = await fetch("/api/notifications?is_read=false", {
        credentials: "include",
      });

      if (!unreadResponse.ok) {
        throw new Error("Failed to fetch unread notifications");
      }

      const unreadData = await unreadResponse.json();
      const unreadNotifications = unreadData.data || [];

      // Mark each unread notification as read
      const promises = unreadNotifications.map((notification: Notification) =>
        fetch(`/api/notifications/${String(notification.notification_id)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ is_read: true }),
        })
      );

      await Promise.all(promises);
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// ==============================================================
// REVIEW SYSTEM HOOKS
// ==============================================================

// Hook for fetching reviews
export const useReviews = (filters?: ReviewFilters) => {
  const buildQueryString = (filters?: ReviewFilters) => {
    if (!filters) return "";
    const params = new URLSearchParams();

    if (filters.jenis_layanan) params.append("jenis_layanan", filters.jenis_layanan);
    if (filters.penilaian) params.append("penilaian", filters.penilaian.toString());
    if (filters.platform) params.append("platform", filters.platform);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return `?${params.toString()}`;
  };

  return useQuery<PaginatedReviews>({
    queryKey: ["reviews", filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const response = await fetch(`/api/reviews${queryString}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
};

// Hook for creating review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewRequest) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch reviews and notifications
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// Hook for updating review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string; penilaian?: number; komentar?: string }) => {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// Hook for deleting review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// Hook for getting user's own reviews
export const useMyReviews = (userId?: string) => {
  return useQuery<PaginatedReviews>({
    queryKey: ["reviews", "my-reviews", userId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?pengguna_id=${userId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch my reviews");
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });
};

// Hook for admin reports (paginated)
export const useAdminReports = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["admin-reports", page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/admin/reports?page=${page}&limit=${limit}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin reports");
      }

      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
};
