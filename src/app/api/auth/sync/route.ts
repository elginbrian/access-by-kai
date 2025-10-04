import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body?.access_token || body?.token;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: "sb-access-token",
      value: encodeURIComponent(token),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
