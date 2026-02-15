import { NextResponse } from 'next/server';
import { getStudioByUuid, updateStudio } from 'services/studios.server';
import { PROFILE_COLUMNS } from "config/constants/profileColumns";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get('uuid');

  if (!uuid) {
    return NextResponse.json({ error: 'UUID is required' }, { status: 400 });
  }

  try {
    const profile = await getStudioByUuid(uuid, PROFILE_COLUMNS.join(", "));
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error("API Get Profile Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { uuid, updates } = await request.json();

    if (!uuid || !updates) {
      return NextResponse.json({ error: 'UUID and updates are required' }, { status: 400 });
    }

    const data = await updateStudio(uuid, updates);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Update Profile Error:", error);
    return NextResponse.json({ 
      error: 'Failed to update profile',
      message: error.message 
    }, { status: 500 });
  }
}
