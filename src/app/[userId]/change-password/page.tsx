import React from "react";
import ChangePasswordPageClient from "@/components/profile/ChangePasswordPageClient";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Pengguna } from "@/types/models";

interface Props {
  params: {
    userId: string;
  };
}

const ChangePasswordPage = async ({ params }: Props) => {
  console.log('ChangePasswordPage params:', params);

  const supabase = await createServerClient();

  // If userId is not provided or is invalid, redirect to home
  if (!params.userId || params.userId === 'undefined' || params.userId === 'null') {
    console.log('Invalid userId in change-password, redirecting to home');
    redirect('/');
  }

  console.log('Fetching profile for change-password userId:', params.userId);
  const { data: profile, error } = await supabase.from("pengguna").select("*").eq("user_id", Number(params.userId)).maybeSingle();

  const fetchedProfile: Pengguna | null = error || !profile ? null : (profile as Pengguna);
  console.log('Fetched profile for change-password:', fetchedProfile, 'error:', error);

  // If no profile is found, redirect to home
  if (!fetchedProfile) {
    console.log('No profile found for change-password, redirecting to home');
    redirect('/');
  }

  return <ChangePasswordPageClient profile={fetchedProfile} />;
};

export default ChangePasswordPage;
