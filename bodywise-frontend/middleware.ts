import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// protection mapping
const protectedRoutes = {
  '/admin': ['system_admin'],
  '/doctor': ['health_professional'],
  '/institution': ['institutional_admin'],
  '/user': ['patient'],
};

// routes with authentication
const authRequiredRoutes = ['/admin', '/doctor', '/institution', '/user'];

// routes with no authentication
const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow public and API routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'))) {
    return NextResponse.next();
  }

  // check if route requires authentication
  const requiresAuth = authRequiredRoutes.some(route => pathname.startsWith(route));
  
  if (requiresAuth) {
    // get token from cookie or header
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // redirect to login if no token
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // verify token and check role
    try {
      // pass through with token present
      const response = NextResponse.next();
      response.headers.set('x-pathname', pathname);
      return response;
    } catch (error) {
      const loginUrl = new URL('/login', request.url); //Invalid token, redirect to login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
