import { NextResponse, type NextRequest } from 'next/server';

const APEX_HOST = 'agrosalso.ro';

// www.agrosalso.ro -> https://agrosalso.ro (301). No-op pe localhost / domenii apphosting.
export function middleware(req: NextRequest) {
  const host = (req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '')
    .split(',')[0]
    .trim()
    .toLowerCase();

  if (host === `www.${APEX_HOST}`) {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${APEX_HOST}`);
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|mp4|webm|woff2?|ttf|txt|xml|json|js|css|map)$).*)',
  ],
};
