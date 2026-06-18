import { NextResponse, type NextRequest } from "next/server";

const SUBDOMAIN_PATH_PREFIX: Record<string, string> = {
  "portfolio.youngzin-log.com": "/portfolio",
  "resume.youngzin-log.com": "/resume",
};

export const proxy = (request: NextRequest) => {
  const host = request.headers.get("host")?.split(":")[0];
  const prefix = host ? SUBDOMAIN_PATH_PREFIX[host] : undefined;
  const { pathname } = request.nextUrl;

  if (
    !prefix ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? prefix : `${prefix}${pathname}`;

  return NextResponse.rewrite(url);
};
