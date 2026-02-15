import { NextResponse } from 'next/server';
import { getRequests, getRequest, updateRequest } from 'services/requests.server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studioUuid = searchParams.get('studio_uuid');
  const requestId = searchParams.get('request_id');

  if (!studioUuid) {
    return NextResponse.json({ error: 'Studio UUID is required' }, { status: 400 });
  }

  try {
    let data;
    if (requestId) {
      data = await getRequest(requestId, studioUuid);
      if (!data) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    } else {
      data = await getRequests(studioUuid);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Get Requests Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { request_id, updates } = await request.json();

    if (!request_id || !updates) {
      return NextResponse.json({ error: 'Request ID and updates are required' }, { status: 400 });
    }

    // TODO: Verify user ownership/permissions here if needed
    // Assuming studio_uuid check is handled by the caller or implicitly trusted for now

    const data = await updateRequest(request_id, updates);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Update Request Error:", error);
    return NextResponse.json({ 
      error: 'Failed to update request',
      message: error.message 
    }, { status: 500 });
  }
}
