import { NextResponse } from 'next/server';
import { getStudio, getStudioByUuid } from 'services/studios.server';
import { STUDIO_COLUMNS } from "config/constants/studioColumns";

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const isPreview = searchParams.get('preview') === 'true';

  // Regular expression to check for UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUuid = uuidRegex.test(id);

  try {
    let studio;
    const columns = isPreview ? STUDIO_COLUMNS.PREVIEW : STUDIO_COLUMNS.ALL;

    if (isUuid) {
      studio = await getStudioByUuid(id, columns);
    } else {
      studio = await getStudio(id);
    }

    if (!studio) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 });
    }

    return NextResponse.json(studio);
  } catch (error) {
    console.error("API Single Studio Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
