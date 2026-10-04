import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/admin";

/** Sends signed-out visitors from the panel to the login page. Server actions re-check on their own. */
export function proxy(request: NextRequest) {
  if (isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/giris", request.url));
}

export const config = {
  matcher: ["/panel", "/panel/:path*"],
};
