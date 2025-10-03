import React from "react";
import ManagePassengersPageClient from "@/components/profile/ManagePassengersPageClient";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Pengguna } from "@/types/models";

interface Props {
  params: {
    userId: string;
  };
}

const ManagePassengersPage = async ({ params }: Props) => {
  console.log('ManagePassengersPage params:', params);

  const supabase = await createServerClient();

  // If userId is not provided or is invalid, redirect to home
  if (!params.userId || params.userId === 'undefined' || params.userId === 'null') {
    console.log('Invalid userId in manage/passengers, redirecting to home');
    redirect('/');
  }

  console.log('Fetching profile for manage/passengers userId:', params.userId);
  const { data: profile, error } = await supabase.from("pengguna").select("*").eq("user_id", Number(params.userId)).maybeSingle();

  const fetchedProfile: Pengguna | null = error || !profile ? null : (profile as Pengguna);
  console.log('Fetched profile for manage/passengers:', fetchedProfile, 'error:', error);

  // If no profile is found, redirect to home
  if (!fetchedProfile) {
    console.log('No profile found for manage/passengers, redirecting to home');
    redirect('/');
  }

  return <ManagePassengersPageClient profile={fetchedProfile} />;
};

export default ManagePassengersPage;