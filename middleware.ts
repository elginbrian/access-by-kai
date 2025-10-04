import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const TRAINS_ID_REQUIRED_ROUTES = ["/trains/booking", "/trains/food-order", "/trains/review", "/trains/payment"];

const rateLimitMap = new Map();

function rateLimit(ip: string, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip);

  const recentRequests = requests.filter((time: number) => time > windowStart);

  if (recentRequests.length >= limit) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

async function checkAuthentication(token: string | undefined) {
  if (!token) return { user: null, error: "No token" };

  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    return { user, error };
  } catch (error) {
    return { user: null, error };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const assetExtRegex = /\.(png|jpg|jpeg|gif|svg|css|js|map|ico|webp|avif|json|txt|xml)$/i;
  if (pathname === "/favicon.ico" || pathname.startsWith("/_next") || assetExtRegex.test(pathname)) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900",
      },
    });
  }

  function tryParseCookieValue(val: string | undefined) {
    if (!val) return undefined;

    if (val.match(/^[A-Za-z0-9-_.]+\.[A-Za-z0-9-_.]+\.[A-Za-z0-9-_.]+$/)) return val;

    try {
      const decoded = decodeURIComponent(val);
      const parsed = JSON.parse(decoded);

      if (Array.isArray(parsed)) {
        for (const p of parsed) {
          if (p && typeof p === "object" && p.access_token) return p.access_token;
        }
      }

      if (parsed && typeof parsed === "object") {
        if (parsed.access_token) return parsed.access_token;
        if (parsed.token) return parsed.token;
      }
    } catch (e) {
      // ignore parse errors
    }

    return undefined;
  }

  const cookieNamesToTry = ["sb-access-token", "supabase-auth-token", "sb:token", "sb"];
  let token: string | undefined;
  for (const name of cookieNamesToTry) {
    const c = request.cookies.get(name)?.value;
    const parsed = tryParseCookieValue(c);
    if (parsed) {
      token = parsed;
      break;
    }
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    if (token) {
      try {
        const { user } = await checkAuthentication(token);
        if (user) return NextResponse.redirect(new URL("/", request.url));

        return NextResponse.next();
      } catch (e) {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  // const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // if (!isProtectedRoute) {
  //   return NextResponse.next();
  // }

  let user: any = null;
  let error: any = null;

  if (token) {
    const auth = await checkAuthentication(token);
    user = auth.user;
    error = auth.error;
  }

  if (!user && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  try {
    if (pathname.startsWith("/admin")) {
      const supabase = createClient();
      const res = await supabase
        .from("pengguna")
        .select("role")
        .eq("email", user.email || "")
        .maybeSingle();
      const role = (res as any)?.data?.role || null;
      // if (role !== "admin") {
      //   return NextResponse.redirect(new URL("/unauthorized", request.url));
      // }
    }
  } catch (err) {
    // if (pathname.startsWith("/admin")) {
    //   return NextResponse.redirect(new URL("/unauthorized", request.url));
    // }
  }

  for (const route of TRAINS_ID_REQUIRED_ROUTES) {
    if (pathname === route) {
      return NextResponse.redirect(new URL("/trains", request.url));
    }

    if (pathname.startsWith(route + "/")) {
      const afterRoute = pathname.substring(route.length + 1);

      if (!afterRoute || afterRoute === "" || !afterRoute.match(/^[a-zA-Z0-9_-]+/)) {
        return NextResponse.redirect(new URL("/trains", request.url));
      }
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", user.id);
  response.headers.set("x-user-email", user.email || "");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
