import { NextRequest, NextResponse } from 'next/server';
import { getAirportByIata } from '@/lib/queries';
import {
  calculateDistance,
  calculateFlightTime,
  calculateCO2,
  calculateTimeDifference,
  getJetLagInfo,
  calculateBearing,
  classifyRoute,
  calculateCruisingAltitude,
  estimateFuelConsumption,
  calculateMidpoint,
  formatCoordinatesDMS,
} from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromIata, toIata, cabinClass } = body;

    if (!fromIata || !toIata) {
      return NextResponse.json(
        { error: 'Both fromIata and toIata are required' },
        { status: 400 }
      );
    }

    const validClasses = ['economy', 'premium_economy', 'business', 'first'] as const;
    type CabinClass = (typeof validClasses)[number];
    const selectedClass: CabinClass = validClasses.includes(cabinClass)
      ? cabinClass
      : 'economy';

    // Get airports from database
    const fromAirport = getAirportByIata(fromIata);
    const toAirport = getAirportByIata(toIata);

    if (!fromAirport) {
      return NextResponse.json(
        { error: `Airport not found: ${fromIata}` },
        { status: 404 }
      );
    }

    if (!toAirport) {
      return NextResponse.json(
        { error: `Airport not found: ${toIata}` },
        { status: 404 }
      );
    }

    // Calculate distance using Vincenty formula
    const distance = calculateDistance(
      fromAirport.latitude,
      fromAirport.longitude,
      toAirport.latitude,
      toAirport.longitude
    );

    // Calculate flight time
    const flightTime = calculateFlightTime(distance.km);

    // Calculate CO2 emissions for the selected cabin class plus a
    // per-class breakdown so the UI can show all classes at a glance.
    const co2 = calculateCO2(distance.km, selectedClass);
    const co2ByClass = {
      economy: calculateCO2(distance.km, 'economy'),
      premium_economy: calculateCO2(distance.km, 'premium_economy'),
      business: calculateCO2(distance.km, 'business'),
      first: calculateCO2(distance.km, 'first'),
    };

    // Time-zone aware extras (skip if either airport has no tz data)
    const timeDifference =
      fromAirport.timezone && toAirport.timezone
        ? calculateTimeDifference(fromAirport.timezone, toAirport.timezone)
        : null;
    const jetLag = timeDifference ? getJetLagInfo(timeDifference.hours) : null;

    // Route geometry, aircraft profile, and consumption
    const bearing = calculateBearing(
      fromAirport.latitude, fromAirport.longitude,
      toAirport.latitude, toAirport.longitude
    );
    const routeType = classifyRoute(distance.km);
    const cruisingAltitude = calculateCruisingAltitude(distance.km);
    const fuelEstimate = estimateFuelConsumption(distance.km);
    const midLatLng = calculateMidpoint(
      fromAirport.latitude, fromAirport.longitude,
      toAirport.latitude, toAirport.longitude
    );
    const midDMS = formatCoordinatesDMS(midLatLng.lat, midLatLng.lng);

    return NextResponse.json({
      from: {
        iata: fromAirport.iata,
        name: fromAirport.name,
        city: fromAirport.city,
        country: fromAirport.country,
        latitude: fromAirport.latitude,
        longitude: fromAirport.longitude,
        timezone: fromAirport.timezone,
      },
      to: {
        iata: toAirport.iata,
        name: toAirport.name,
        city: toAirport.city,
        country: toAirport.country,
        latitude: toAirport.latitude,
        longitude: toAirport.longitude,
        timezone: toAirport.timezone,
      },
      distance,
      flightTime,
      co2,
      co2ByClass,
      cabinClass: selectedClass,
      timeDifference,
      jetLag,
      bearing,
      routeType,
      cruisingAltitude,
      fuelEstimate,
      midpoint: {
        lat: midLatLng.lat,
        lng: midLatLng.lng,
        latitude: midDMS.latitude,
        longitude: midDMS.longitude,
      },
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 }
    );
  }
}
