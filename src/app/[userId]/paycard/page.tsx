import React from "react";
import PayCardProfilePageClient from "@/components/profile/PayCardProfilePageClient";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Pengguna } from "@/types/models";

interface Props {
  params: {
    userId: string;
  };
}

const PayCardProfilePage = async ({ params }: Props) => {
  console.log('PayCardProfilePage params:', params);

  const supabase = await createServerClient();

  // Await params in Next.js 15
  const { userId } = await params;

  // If userId is not provided or is invalid, redirect to home
  if (!userId || userId === 'undefined' || userId === 'null') {
    console.log('Invalid userId in paycard, redirecting to home');
    redirect('/');
  }

  console.log('Fetching profile for paycard userId:', userId);
  const { data: profile, error } = await supabase.from("pengguna").select("*").eq("user_id", Number(userId)).maybeSingle();

  const fetchedProfile: Pengguna | null = error || !profile ? null : (profile as Pengguna);
  console.log('Fetched profile for paycard:', fetchedProfile, 'error:', error);

  // If no profile is found, redirect to home
  if (!fetchedProfile) {
    console.log('No profile found for paycard, redirecting to home');
    redirect('/');
  }

  return <PayCardProfilePageClient profile={fetchedProfile} />;
};

export default PayCardProfilePage;