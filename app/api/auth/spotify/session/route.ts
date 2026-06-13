import { NextResponse } from 'next/server';

export async function GET() {
  const data = (globalThis as any).cachedSpotifyData || null;
  return NextResponse.json({ data });
}

export async function POST() {
  (globalThis as any).cachedSpotifyData = null;
  return NextResponse.json({ success: true });
}
