import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/admin", "/admin/dashboard"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  // Extract Session inside the Cookies
  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  // If Trying to access Admin Route
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.role !== "ADMIN") {
      // Forbidden: redirect to regular user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If trying to access Protected User Route
  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If trying to access Login / Registration while already authenticated
  if (path === "/login" || path === "/registration") {
    if (session) {
      if (session.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
