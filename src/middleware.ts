import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  COOKIE_NAME,
  CUSTOMER_COOKIE,
  getCustomerJwtSecret,
  getJwtSecret,
} from "@/lib/auth-constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value ?? request.cookies.get(COOKIE_NAME)?.value;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(adminToken, getJwtSecret());
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(ADMIN_COOKIE);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  if (pathname === "/admin/login" && adminToken) {
    try {
      await jwtVerify(adminToken, getJwtSecret());
      return NextResponse.redirect(new URL("/admin", request.url));
    } catch {
      // allow login
    }
  }

  const protectedPortal =
    pathname.startsWith("/portal/") &&
    !pathname.startsWith("/portal/login") &&
    !pathname.startsWith("/portal/register");

  if (protectedPortal || pathname === "/portal") {
    // Allow /portal hub, but protected subpages require customer auth
    if (pathname !== "/portal") {
      const customerToken = request.cookies.get(CUSTOMER_COOKIE)?.value;
      if (!customerToken) {
        const loginUrl = new URL("/portal/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }
      try {
        const { payload } = await jwtVerify(customerToken, getCustomerJwtSecret());
        if (payload.typ !== "customer") throw new Error("invalid");
      } catch {
        const response = NextResponse.redirect(new URL("/portal/login", request.url));
        response.cookies.delete(CUSTOMER_COOKIE);
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal", "/portal/:path*"],
};
