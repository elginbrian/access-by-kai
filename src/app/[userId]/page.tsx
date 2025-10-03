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
  console.log('ProfilePage params:', params);

  const supabase = await createServerClient();

  // Await params in Next.js 15
  const { userId } = await params;

  // If userId is not provided or is invalid, redirect to home
  if (!userId || userId === 'undefined' || userId === 'null') {
    console.log('Invalid userId, redirecting to home');
    redirect('/');
  }

  console.log('Fetching profile for userId:', userId);
  const { data: profile, error } = await supabase.from("pengguna").select("*").eq("user_id", Number(userId)).maybeSingle();

  const fetchedProfile: Pengguna | null = error || !profile ? null : (profile as Pengguna);
  console.log('Fetched profile:', fetchedProfile, 'error:', error);

  return <ProfilePageClient profile={fetchedProfile} />;
};

export default ProfilePage;
