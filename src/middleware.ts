import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_KEY = 'sl_auth';

const protectedPaths = ['/home'];
const authPaths = ['/login', '/register'];

const pathMatches = (pathname: string, basePath: string) =>
  pathname === basePath || pathname.startsWith(`${basePath}/`);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE_KEY)?.value);

  const isProtectedRoute = protectedPaths.some((path) => pathMatches(pathname, path));
  const isAuthRoute = authPaths.some((path) => pathMatches(pathname, path));

  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/login', '/register'],
};
