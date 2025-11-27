/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  const isPublicPath =
    path === '/login' ||
    path === '/signup' ||
    path === '/verifyEmail';

  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any;
      isAuthenticated = true;
      isAdmin = decoded?.isAdmin === true; // 🔥 read role from token
    } catch {
      isAuthenticated = false;
    }
  }

  // Block logged-in users from login/signup pages
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated users → redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin-only access to dashboard
  if (path.startsWith('/dashboard') && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/login',
    '/signup',
    '/verifyEmail',
    '/dashboard/:path*',
  ],
};
