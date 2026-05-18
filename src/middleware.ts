import { NextRequest, NextResponse } from "next/server";

function getBlogHostnames(): string[] {
  const canonicalOrigin =
    process.env.BLOG_CANONICAL_ORIGIN || "https://blog.aelf.com";
  const canonicalHostname = new URL(canonicalOrigin).hostname;
  const extraHosts = process.env.BLOG_HOSTNAMES || "";

  return [canonicalHostname, ...extraHosts.split(",")]
    .map((host) => host.trim())
    .filter(Boolean);
}

function isBlogHostname(hostHeader: string | null): boolean {
  const hostname = (hostHeader || "").split(":")[0];
  return getBlogHostnames().includes(hostname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isBlogHostname(request.headers.get("host"))) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/blog";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/blog") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
