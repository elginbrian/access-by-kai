import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    try {
      const page = Number(new URL(request.url).searchParams.get("page") || "1");
      const limit = Number(new URL(request.url).searchParams.get("limit") || "50");
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const supabase = createAdminClient();
      const { data, error, count } = await (supabase as any).from("reports").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);

      if (error) {
        console.error("Supabase error fetching reports", error);
        return NextResponse.json({ success: false, error: "Failed to fetch reports" }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: data || [], pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) } });
    } catch (e) {
      console.warn("Supabase admin client not available or query failed, returning empty list", e);
      return NextResponse.json({ success: true, data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } });
    }
  } catch (error) {
    console.error("Admin reports GET error", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
