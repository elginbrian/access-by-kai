import { createClient } from "@/lib/supabase";
import type { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, GoogleOAuthCallbackData, CompleteGoogleProfileForm } from "@/lib/validators/auth";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import type { Pengguna } from "@/types/models";

const supabase = createClient();

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  profile?: Pengguna;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  error: AuthError | null;
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) return null;

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: {
        id: session.user.id,
        email: session.user.email!,
        user_metadata: session.user.user_metadata,
      },
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: profile } = await supabase.from("pengguna").select("*").eq("email", user.email!).single();

    return {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata,
      profile: profile || undefined,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function signIn(credentials: LoginForm): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { user: null, session: null, error };
    }

    let profile: Pengguna | undefined;
    if (data.user) {
      const { data: profileData } = await supabase.from("pengguna").select("*").eq("email", data.user.email!).single();
      profile = profileData || undefined;
    }

    const authUser: AuthUser | null = data.user
      ? {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
          profile,
        }
      : null;

    const authSession: AuthSession | null = data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type,
          user: authUser!,
        }
      : null;

    return { user: authUser, session: authSession, error: null };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      user: null,
      session: null,
      error: { message: "Terjadi kesalahan saat login" } as AuthError,
    };
  }
}

export async function signUp(userData: RegisterForm): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nama_lengkap: userData.nama_lengkap,
          nomor_telepon: userData.nomor_telepon,
        },
      },
    });

    if (error) {
      return { user: null, session: null, error };
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("pengguna").insert({
        email: userData.email,
        nama_lengkap: userData.nama_lengkap,
        nomor_telepon: userData.nomor_telepon,
        nomor_identitas: userData.nomor_telepon || "TEMP_" + Date.now(),
        password_hash: "",
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
    }

    const authUser: AuthUser | null = data.user
      ? {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
        }
      : null;

    const authSession: AuthSession | null = data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type,
          user: authUser!,
        }
      : null;

    return { user: authUser, session: authSession, error: null };
  } catch (error) {
    console.error("Error signing up:", error);
    return {
      user: null,
      session: null,
      error: { message: "Terjadi kesalahan saat registrasi" } as AuthError,
    };
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error: { message: "Terjadi kesalahan saat logout" } as AuthError };
  }
}

export async function resetPassword(data: ForgotPasswordForm): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { error: { message: "Terjadi kesalahan saat mengirim email reset password" } as AuthError };
  }
}

export async function updatePassword(data: ResetPasswordForm): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    return { error };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: { message: "Terjadi kesalahan saat mengubah password" } as AuthError };
  }
}

export async function signInWithGoogle(): Promise<{ error: AuthError | null; url?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return { error };
    }

    return { error: null, url: data.url };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { error: { message: "Terjadi kesalahan saat login dengan Google" } as AuthError };
  }
}

export async function handleOAuthCallback(callbackData: GoogleOAuthCallbackData): Promise<AuthResponse> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        user: null,
        session: null,
        error: { message: "Tidak dapat mengambil data user dari OAuth callback" } as AuthError,
      };
    }

    const { data: existingProfile } = await supabase.from("pengguna").select("*").eq("email", user.email!).single();

    let profile: Pengguna;

    if (existingProfile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from("pengguna")
        .update({
          nama_lengkap: callbackData.name || existingProfile.nama_lengkap,
        })
        .eq("email", user.email!)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating existing profile:", updateError);
      }

      profile = updatedProfile || existingProfile;
    } else {
      const { data: newProfile, error: createError } = await supabase
        .from("pengguna")
        .insert({
          email: user.email!,
          nama_lengkap: callbackData.name || user.email!.split("@")[0],
          password_hash: "",
          nomor_telepon: null,
          nomor_identitas: "TEMP_" + Date.now(),
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating OAuth profile:", createError);
        return {
          user: null,
          session: null,
          error: { message: "Gagal membuat profil pengguna" } as AuthError,
        };
      }

      profile = newProfile;
    }

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return {
        user: null,
        session: null,
        error: { message: "Tidak dapat mengambil session" } as AuthError,
      };
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata,
      profile,
    };

    const authSession: AuthSession = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: authUser,
    };

    return { user: authUser, session: authSession, error: null };
  } catch (error) {
    console.error("Error handling OAuth callback:", error);
    return {
      user: null,
      session: null,
      error: { message: "Terjadi kesalahan saat memproses login OAuth" } as AuthError,
    };
  }
}

export async function completeGoogleProfile(data: CompleteGoogleProfileForm): Promise<{ error: AuthError | null }> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: { message: "User tidak ditemukan" } as AuthError };
    }

    const { error } = await supabase
      .from("pengguna")
      .update({
        nomor_telepon: data.nomor_telepon,
        tanggal_lahir: data.tanggal_lahir || null,
      })
      .eq("email", user.email!);

    if (error) {
      return { error: { message: error.message } as AuthError };
    }

    return { error: null };
  } catch (error) {
    console.error("Error completing Google profile:", error);
    return { error: { message: "Terjadi kesalahan saat melengkapi profil" } as AuthError };
  }
}

// Check if user profile is complete (has phone number)
export async function isProfileComplete(): Promise<boolean> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return false;

    const { data: profile } = await supabase.from("pengguna").select("nomor_telepon").eq("email", user.email!).single();

    return !!profile?.nomor_telepon;
  } catch (error) {
    console.error("Error checking profile completeness:", error);
    return false;
  }
}

export function onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    const authSession: AuthSession | null = session
      ? {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type,
          user: {
            id: session.user.id,
            email: session.user.email!,
            user_metadata: session.user.user_metadata,
          },
        }
      : null;

    callback(event, authSession);
  });
}
