import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireManager } from 'services/admin.server';

export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token');
  const tag = request.nextUrl.searchParams.get('tag');
  const path = request.nextUrl.searchParams.get('path');

  // To prevent unauthorized cache clearing: the secret token (scripts, bookmarks)
  // or a signed-in manager (admin page)
  const secret = process.env.REVALIDATION_TOKEN;
  const hasValidToken = Boolean(secret) && token === secret;
  if (!hasValidToken) {
    if (!request.headers.get('authorization')) {
      return NextResponse.json({ message: 'Invalid or missing token' }, { status: 401 });
    }
    const auth = await requireManager(request);
    if (!auth.user) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }
  }

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now(), tag });
  }
  
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), path });
  }

  return NextResponse.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing tag or path to revalidate',
  });
}
