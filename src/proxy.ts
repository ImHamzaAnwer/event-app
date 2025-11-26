import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyEmail';

  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, process.env.AUTH_SECRET!);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Logged-in users should not access login/signup
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated users cannot access protected routes
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/login', '/signup', '/verifyEmail', "/dashboard/:path*"],
};
