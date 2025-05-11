import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If the user is not logged in and tries to access a page other than /login, redirect to /login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the user is logged in and tries to access the /login page, redirect to the homepage
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow other requests to pass through
  return NextResponse.next();
}

// Configure the paths where the middleware should be applied
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"], // Match all non-static resources and API paths
};