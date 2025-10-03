import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log("Current auth user:", user?.id);

    // Check for any table that might have UUID mapping
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id || "")
      .limit(1);

    // Check users table
    const { data: usersTable, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    // Check if there's any table with auth_id or uuid column
    const { data: authMappings, error: authError2 } = await supabase
      .from("user_auth_mapping")
      .select("*")
      .limit(5);

    // Get some sample pemesanan to see structure
    const { data: samplePemesanan, error: pemesananError } = await supabase
      .from("pemesanan")
      .select("user_id, pemesanan_id, status_pemesanan")
      .limit(5);

    return NextResponse.json({
      authUser: { id: user?.id, email: user?.email },
      profiles: { data: profiles, error: profilesError },
      usersTable: { data: usersTable, error: usersError },
      authMappings: { data: authMappings, error: authError2 },
      samplePemesanan: { data: samplePemesanan, error: pemesananError },
      errors: {
        authError,
        profilesError,
        usersError,
        authError2,
        pemesananError
      }
    });

  } catch (error) {
    console.error("Schema debug error:", error);
    return NextResponse.json(
      { error: "Schema debug error", details: error },
      { status: 500 }
    );
  }
}