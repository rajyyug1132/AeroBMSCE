import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Next.js 16 "proxy" convention (formerly middleware). Refreshes the Supabase
// session and guards /dashboard/* — see lib/supabase/middleware.ts.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/login'],
};
