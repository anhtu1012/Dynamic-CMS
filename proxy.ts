import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password",];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    const timeLeft = decoded.exp - currentTime;

    // Refresh if expired or less than 10 minutes left
    if (timeLeft < 10 * 60) {
      if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Refresh token logic
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/v1/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!res.ok) {
          throw new Error("Refresh failed");
        }

        const data = await res.json();
        const newResponse = NextResponse.next();

        // Set new cookies
        newResponse.cookies.set("accessToken", data.accessToken, {
          path: "/",
          maxAge: data.expiresIn || 86400, // Adjust based on API response
        });
        newResponse.cookies.set("refreshToken", data.refreshToken, {
          path: "/",
          maxAge: data.refreshExpiresIn || 604800, // Adjust based on API response
        });

        return newResponse;
      } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
