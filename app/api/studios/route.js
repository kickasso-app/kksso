import { NextResponse } from 'next/server';
import { getStudios } from 'services/studios.server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const regionName = searchParams.get('region');
  const featured = searchParams.get('featured') === 'true';
  const search = searchParams.get('search');

  try {
    const studios = await getStudios({ regionName, featured, search });
    return NextResponse.json(studios);
  } catch (error) {
    console.error("API Studios Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
