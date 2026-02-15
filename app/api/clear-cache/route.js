import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token');
  const tag = request.nextUrl.searchParams.get('tag');
  const path = request.nextUrl.searchParams.get('path');

  // To prevent unauthorized cache clearing
  const secret = process.env.REVALIDATION_TOKEN;
  if (!secret || token !== secret) {
    return NextResponse.json({ message: 'Invalid or missing token' }, { status: 401 });
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
