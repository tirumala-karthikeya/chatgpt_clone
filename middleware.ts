import { authMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const hasClerk = !!process.env.CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

export default hasClerk
  ? authMiddleware({
      publicRoutes: [
        '/',
        '/api/(.*)',
      ],
    })
  : function middleware(req: NextRequest) {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
};
