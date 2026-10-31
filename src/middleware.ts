import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ROLE_HOME } from "@/lib/constants"; // Import the map

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Public routes
  if (pathname === "/") {
    return NextResponse.next();
  }

  // If logged in and on /login, redirect to role home
  if (pathname === "/login") {
    if (user) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role], req.url));
    }
    return NextResponse.next();
  }

  // Require auth for everything else
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If they hit /dashboard, redirect to role home
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(ROLE_HOME[user.role], req.url));
  }

  // Prevent cross-role access
  const allowedPrefix = `/${user.role.toLowerCase()}`; // e.g., "/admin", "/teacher"
  
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/parent")
  ) {
    // If trying to access a role path that isn't theirs
    if (!pathname.startsWith(allowedPrefix)) {
      return NextResponse.rewrite(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};