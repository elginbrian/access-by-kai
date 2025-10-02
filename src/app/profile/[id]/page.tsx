import React from "react";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { createServerClient } from "@/lib/supabase/server";
import type { Pengguna } from "@/types/models";

interface Props {
  params: {
    id: string;
  };
}

const ProfilePage = async ({ params }: Props) => {
  const supabase = await createServerClient();
  const { data: profile, error } = await supabase.from("pengguna").select("*").eq("user_id", Number(params.id)).maybeSingle();

  const fetchedProfile: Pengguna | null = error || !profile ? null : (profile as Pengguna);

  return <ProfilePageClient profile={fetchedProfile} />;
};

export default ProfilePage;
