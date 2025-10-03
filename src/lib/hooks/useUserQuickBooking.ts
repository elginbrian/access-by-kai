import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/AuthContext";

export interface QuickBookingRecommendation {
  jadwalId: number;
  trainName: string;
  trainCode: string;
  trainClass: string;
  fromCity: string;
  toCity: string;
  fromCityCode: string;
  toCityCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  date: string;
  price: number;
  frequency: number;
  badges: Array<{
    text: string;
    variant: 'holiday' | 'new-generation' | 'promo' | 'premium' | 'discount' | 'available' | 'limited';
  }>;
}

export interface QuickBookingResponse {
  recommendations: QuickBookingRecommendation[];
  message: string;
  isEmpty?: boolean;
  isNewUser?: boolean;
}

export interface TrackInteractionParams {
  jadwalId: number;
  interactionType: "VIEW" | "CLICK" | "BOOK" | "ABANDON";
  recommendationPosition?: number;
  recommendationReason?: string;
  sessionId?: string;
}

export function useUserQuickBookingRecommendations() {
  const { user } = useAuth();
  const userId = user?.profile?.user_id;

  return useQuery({
    queryKey: ["user-quick-booking", userId],
    queryFn: async (): Promise<QuickBookingResponse> => {
      if (!userId) {
        return { recommendations: [], message: "User not authenticated" };
      }

      console.log("Hook - Fetching for user ID:", userId);

      // Debug call first
      try {
        const debugResponse = await fetch(`/api/debug/user-quick-booking/${userId}`);
        if (debugResponse.ok) {
          const debugData = await debugResponse.json();
          console.log("Hook - Debug data:", debugData);
        }
      } catch (error) {
        console.log("Hook - Debug call failed:", error);
      }

      const response = await fetch(`/api/recommendations/user-quick-booking?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const result = await response.json();
      console.log("Hook - API response:", result);

      return result;
    },
    enabled: !!userId, // Only run query if user is logged in
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function useTrackQuickBookingInteraction() {
  const { user } = useAuth();
  const userId = user?.profile?.user_id;

  return useMutation({
    mutationFn: async (params: Omit<TrackInteractionParams, 'userId'>) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/recommendations/track-interaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track interaction");
      }

      return response.json();
    },
    onError: (error) => {
      console.warn("Failed to track interaction:", error);
      // Don't throw error - tracking is not critical for user experience
    },
  });
}