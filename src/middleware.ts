import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * `/` is the GoodAIt film (static HTML in public/), not the old Next mail-docket.
 * Rewrite so the browser document is index.html — relative asset URLs
 * (styles.css, app.js, assets/…) resolve from the site root.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/index.html', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
