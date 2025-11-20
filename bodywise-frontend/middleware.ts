import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

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
const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/education', '/testimonials', '/api-docs', '/api'];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow public and API routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'))) {
    return NextResponse.next();
  }

  // check if route requires authentication
  const requiresAuth = authRequiredRoutes.some(route => pathname.startsWith(route));
  
  if (requiresAuth) {
    // get token from cookie or header
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // redirect to login if no token
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // verify token and check role
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const userRole = payload.role as string;

      // check role permissions for protected routes
      for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
          // unauthorized - redirect to their appropriate dashboard
          const roleRedirectMap: Record<string, string> = {
            'system_admin': '/admin',
            'health_professional': '/doctor',
            'institutional_admin': '/institution',
            'patient': '/user',
          };
          const redirectPath = roleRedirectMap[userRole] || '/login';
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }

      // pass through with valid token and role
      const response = NextResponse.next();
      response.headers.set('x-user-role', userRole);
      return response;
    } catch (error) {
      console.error('Token verification failed:', error);
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
