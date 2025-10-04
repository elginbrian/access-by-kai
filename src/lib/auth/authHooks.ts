import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signUp, signOut, resetPassword, updatePassword, signInWithGoogle, handleOAuthCallback, completeGoogleProfile, isProfileComplete } from "@/lib/auth/authService";
import { type LoginForm, type RegisterForm, type ForgotPasswordForm, type ResetPasswordForm, type GoogleOAuthCallbackData, type CompleteGoogleProfileForm } from "@/lib/validators/auth";
import { useAuth } from "@/lib/auth/AuthContext";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "Login gagal");
        return;
      }

      if (data.user) {
        toast.success("Login berhasil!");
        queryClient.invalidateQueries({ queryKey: ["auth"] });

        if (data.session?.access_token) {
          fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: data.session.access_token }),
          }).catch(() => {});
        }

        router.push("/");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat login");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "Registrasi gagal");
        return;
      }

      if (data.user) {
        toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.");
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        router.push("/auth/login");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat registrasi");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "Logout gagal");
        return;
      }

      toast.success("Logout berhasil!");
      queryClient.clear();
      router.push("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat logout");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "Gagal mengirim email reset password");
        return;
      }

      toast.success("Email reset password telah dikirim!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat mengirim email reset password");
    },
  });
}

export function useUpdatePassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "Gagal mengubah password");
        return;
      }

      toast.success("Password berhasil diubah!");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat mengubah password");
    },
  });
}

export function useHasRole(requiredRole: string) {
  const { user } = useAuth();

  if (!user?.profile) return false;

  const userRole = (user.profile as any).role || "user";

  if (requiredRole === "admin") {
    return userRole === "admin";
  }

  return true;
}

export function useHasPermission(permission: string) {
  const { user } = useAuth();

  if (!user?.profile) return false;

  const userRole = (user.profile as any).role || "user";

  const permissions = {
    admin: ["create", "read", "update", "delete", "manage_users", "view_analytics"],
    user: ["create", "read", "update_own", "delete_own"],
    guest: ["read"],
  };

  return permissions[userRole as keyof typeof permissions]?.includes(permission) || false;
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "Login dengan Google gagal");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat login dengan Google");
    },
  });
}

export function useOAuthCallback() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleOAuthCallback,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "OAuth callback gagal");
        router.push("/auth/login");
        return;
      }

      if (data.user) {
        toast.success("Login berhasil!");
        queryClient.invalidateQueries({ queryKey: ["auth"] });

        // Sync session token to server so middleware can read it via httpOnly cookie
        if (data.session?.access_token) {
          fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: data.session.access_token }),
          }).catch(() => {});
        }

        if (data.user.profile?.nomor_telepon) {
          router.push("/");
        } else {
          router.push("/auth/complete-profile");
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat memproses OAuth callback");
      router.push("/auth/login");
    },
  });
}

export function useCompleteGoogleProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeGoogleProfile,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message || "Gagal melengkapi profil");
        return;
      }

      toast.success("Profil berhasil dilengkapi!");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan saat melengkapi profil");
    },
  });
}

export function useProfileComplete() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["auth", "profile-complete"],
    queryFn: isProfileComplete,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
