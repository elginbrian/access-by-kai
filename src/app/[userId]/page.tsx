import React from "react";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { createServerClient } from "@/lib/supabase/server";
import type { Pengguna } from "@/types/models";
import { redirect } from "next/navigation";

interface Props {
  params: {
    userId: string;
  };
}

const ProfilePage = async ({ params }: Props) => {
  const supabase = await createServerClient();

  // If userId is not provided or is invalid, redirect to home
  if (!params.userId || params.userId === 'undefined' || params.userId === 'null') {
    redirect('/');
  }

  const { data: profile, error } = await supabase.from("pengguna").select("*").eq("user_id", Number(params.userId)).maybeSingle();

  const fetchedProfile: Pengguna | null = error || !profile ? null : (profile as Pengguna);

  return <ProfilePageClient profile={fetchedProfile} />;
};

export default ProfilePage;
