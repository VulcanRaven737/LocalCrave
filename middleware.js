import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const url = req.nextUrl.clone(); // Clone the URL object for redirection purposes
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated
  if (!token) {
    // Allow access to the signin page, API routes, and static files
    if (url.pathname.startsWith('/auth/signin') || url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // If the user is authenticated and is a "chef"
  if (token.userType === 'chef') {
    // Allow access only to the /chefs page
    if (!url.pathname.startsWith('/chefs')) {
      url.pathname = '/chefs';
      return NextResponse.redirect(url);
    }
  }

  // Allow all other users
  return NextResponse.next();
}

// Define the paths where the middleware should apply
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|api|static).*)', // Apply middleware to all paths except Next.js internals, static files, and APIs
  ],
};
