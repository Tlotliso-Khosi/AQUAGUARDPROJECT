import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/farmer/dashboard", "/customer/dashboard", "/profile"]

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If already logged in and trying to access login/register, redirect to dashboard
  if (token && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/farmer/:path*", "/customer/:path*", "/profile/:path*", "/login", "/register"],
}
