import { useQuery } from "@tanstack/react-query";
import { getUserRole } from "./permissions";

export function useUserRole(userId?: number) {
  return useQuery({
    queryKey: ["auth", "role", userId],
    queryFn: async () => {
      return getUserRole(userId);
    },
    enabled: typeof userId === "number" && userId !== null,
  });
}

export function assertAdmin(role?: string | null) {
  if (role !== "admin") throw new Error("forbidden: admin role required");
}
