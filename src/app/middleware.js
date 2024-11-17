import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if the user is authenticated
  if (!token) {
    // Redirect unauthenticated users to the login page
    if (!req.nextUrl.pathname.startsWith('/auth/signin')) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    return NextResponse.next();
  }

  // Restrict chef users to only access the /chefs page
  if (token.userType === 'chef' && !req.nextUrl.pathname.startsWith('/chefs')) {
    return NextResponse.redirect(new URL('/chefs', req.url));
  }

  return NextResponse.next();
}

// Define the paths where the middleware should be applied
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|api|static).*)', // Apply middleware to all paths except static files, API routes, etc.
  ],
};
