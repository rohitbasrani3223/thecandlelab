import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('candlelab_jwt_access')?.value;
    const role = request.cookies.get('candlelab_user_role')?.value;

    // If token exists in cookies and role is not admin, redirect to storefront
    if (token && role && role !== 'admin' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect /seller routes
  if (pathname.startsWith('/seller')) {
    const token = request.cookies.get('candlelab_jwt_access')?.value;
    const role = request.cookies.get('candlelab_user_role')?.value;

    if (token && role && role !== 'seller' && role !== 'SELLER' && role !== 'admin' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*'],
};
