import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase";

const PROTECTED_ROUTES = ["/trains/booking", "/trains/food-order", "/trains/review", "/trains/payment"];
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

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900",
      },
    });
  }

  const token = request.cookies.get("sb-access-token")?.value || request.cookies.get("supabase-auth-token")?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    const { user } = await checkAuthentication(token);
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const { user, error } = await checkAuthentication(token);

  if (!user || error) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
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
