import { NextRequest, NextResponse } from 'next/server';
import { searchAirports } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ airports: [] });
  }

  try {
    const airports = searchAirports(query, 10);
    return NextResponse.json({ airports });
  } catch (error) {
    console.error('Airport search error:', error);
    return NextResponse.json(
      { error: 'Failed to search airports' },
      { status: 500 }
    );
  }
}
