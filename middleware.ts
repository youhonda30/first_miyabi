import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/cart",
    "/checkout",
    "/orders",
  ]

  // Admin-only routes
  const adminRoutes = ["/admin"]

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Redirect to sign in if trying to access protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check admin access
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/auth/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    if (req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Redirect to home if logged in and trying to access auth pages
  if (isLoggedIn && pathname.startsWith("/auth/signin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}
