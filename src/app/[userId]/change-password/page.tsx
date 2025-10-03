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
  const supabase = await createServerClient();

  // Await params in Next.js 15
  const { userId } = await params;

  // If userId is not provided or is invalid, redirect to home
  if (!userId || userId === 'undefined' || userId === 'null') {
    redirect('/');
  }

  const { data: profile, error } = await supabase.from("pengguna").select("*").eq("user_id", Number(userId)).maybeSingle();

  const fetchedProfile: Pengguna | null = error || !profile ? null : (profile as Pengguna);

  // If no profile is found, redirect to home
  if (!fetchedProfile) {
    redirect('/');
  }

  return <ChangePasswordPageClient profile={fetchedProfile} />;
};

export default ChangePasswordPage;
