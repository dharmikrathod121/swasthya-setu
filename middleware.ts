import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createMiddlewareClient } from "@/lib/supabase/middleware";

/**
 * Routes that require an authenticated user session.
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/appointments",
  "/chat",
  "/ai-services",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never intercept API routes or static assets.
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ request, response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent authenticated users from re-visiting the login page.
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/appointments/:path*",
    "/chat/:path*",
    "/ai-services/:path*",
    "/login",
    "/((?!_next|api|static|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|css|js|woff2?|ttf|eot)$).*)",
  ],
};