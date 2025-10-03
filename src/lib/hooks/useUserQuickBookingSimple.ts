import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/AuthContext";

interface QuickBookingRecommendation {
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
  badges: Array<{text: string, variant: 'holiday' | 'new-generation' | 'promo' | 'premium' | 'discount' | 'available' | 'limited'}>;
}

interface QuickBookingResponse {
  recommendations: QuickBookingRecommendation[];
  message: string;
  isEmpty?: boolean;
  isNewUser?: boolean;
}

export function useUserQuickBookingSimple() {
  const { user } = useAuth();
  
  // Get numeric user_id from profile, same as mytickets
  const rawUserId = user?.profile?.user_id;
  const numericUserId = rawUserId == null ? NaN : typeof rawUserId === "string" ? parseInt(rawUserId, 10) : (rawUserId as number);

  return useQuery<QuickBookingResponse>({
    queryKey: ["user-quick-booking-simple", numericUserId],
    queryFn: async () => {
      if (!numericUserId || isNaN(numericUserId)) {
        throw new Error("User profile ID is required");
      }

      console.log("Simple Hook - Fetching for user profile ID:", numericUserId);

      const response = await fetch(`/api/recommendations/user-quick-booking-simple?userId=${numericUserId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      console.log("Simple Hook - Received data:", data);
      
      return data;
    },
    enabled: !!(numericUserId && !isNaN(numericUserId)),
    staleTime: 1000 * 60 * 10, // 10 minutes - longer cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false, // No auto refetch
  });
}