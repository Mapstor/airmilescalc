// lib/calculations.ts
// All calculations using real formulas - NO FAKE DATA

/**
 * Calculate geodesic distance using Vincenty formula
 * Accurate to 0.5mm on the WGS-84 ellipsoid
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { km: number; miles: number; nauticalMiles: number } {
  // WGS-84 ellipsoid parameters
  const a = 6378137; // Semi-major axis (meters)
  const f = 1 / 298.257223563; // Flattening
  const b = a * (1 - f); // Semi-minor axis

  // Convert to radians
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const L = (lon2 - lon1) * Math.PI / 180;

  const U1 = Math.atan((1 - f) * Math.tan(φ1));
  const U2 = Math.atan((1 - f) * Math.tan(φ2));
  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  let λ = L;
  let λʹ: number;
  let iterLimit = 100;
  let sinλ: number, cosλ: number;
  let sinσ: number, cosσ: number, σ: number;
  let sinα: number, cos2α: number, cos2σm: number;
  let C: number;

  do {
    sinλ = Math.sin(λ);
    cosλ = Math.cos(λ);
    sinσ = Math.sqrt(
      (cosU2 * sinλ) ** 2 +
      (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) ** 2
    );

    // Co-incident points
    if (sinσ === 0) {
      return { km: 0, miles: 0, nauticalMiles: 0 };
    }

    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = Math.atan2(sinσ, cosσ);
    sinα = cosU1 * cosU2 * sinλ / sinσ;
    cos2α = 1 - sinα ** 2;
    cos2σm = cos2α !== 0 ? cosσ - 2 * sinU1 * sinU2 / cos2α : 0;
    C = f / 16 * cos2α * (4 + f * (4 - 3 * cos2α));
    λʹ = λ;
    λ = L + (1 - C) * f * sinα * (
      σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm ** 2))
    );
  } while (Math.abs(λ - λʹ) > 1e-12 && --iterLimit > 0);

  // Formula failed to converge (antipodal points)
  if (iterLimit === 0) {
    // Fall back to Haversine for antipodal points
    return calculateDistanceHaversine(lat1, lon1, lat2, lon2);
  }

  const u2 = cos2α * (a ** 2 - b ** 2) / (b ** 2);
  const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const Δσ = B * sinσ * (cos2σm + B / 4 * (
    cosσ * (-1 + 2 * cos2σm ** 2) -
    B / 6 * cos2σm * (-3 + 4 * sinσ ** 2) * (-3 + 4 * cos2σm ** 2)
  ));

  const meters = b * A * (σ - Δσ);
  const km = meters / 1000;
  const miles = km * 0.621371;
  const nauticalMiles = km * 0.539957;

  return {
    km: Math.round(km),
    miles: Math.round(miles),
    nauticalMiles: Math.round(nauticalMiles)
  };
}

/**
 * Haversine formula as fallback for antipodal points
 */
function calculateDistanceHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { km: number; miles: number; nauticalMiles: number } {
  const R = 6371; // Earth's mean radius in km

  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = R * c;
  const miles = km * 0.621371;
  const nauticalMiles = km * 0.539957;

  return {
    km: Math.round(km),
    miles: Math.round(miles),
    nauticalMiles: Math.round(nauticalMiles)
  };
}

/**
 * Calculate estimated flight time based on distance
 * Uses average cruise speed of 850 km/h plus ground time
 */
export function calculateFlightTime(distanceKm: number): {
  hours: number;
  minutes: number;
  totalMinutes: number;
  display: string;
} {
  // Average cruise speed for commercial jets
  const cruiseSpeedKmh = 850;

  // Ground time (taxi, takeoff, landing) varies by distance
  let groundTimeMinutes: number;
  if (distanceKm < 1500) {
    groundTimeMinutes = 30; // Short-haul
  } else if (distanceKm < 4000) {
    groundTimeMinutes = 40; // Medium-haul
  } else {
    groundTimeMinutes = 50; // Long-haul
  }

  const flightTimeMinutes = (distanceKm / cruiseSpeedKmh) * 60 + groundTimeMinutes;
  const hours = Math.floor(flightTimeMinutes / 60);
  const minutes = Math.round(flightTimeMinutes % 60);

  return {
    hours,
    minutes,
    totalMinutes: Math.round(flightTimeMinutes),
    display: `${hours}h ${minutes}m`
  };
}

/**
 * Calculate CO2 emissions based on DEFRA 2024 emission factors
 */
export function calculateCO2(
  distanceKm: number,
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first' = 'economy'
): {
  kgCO2: number;
  kgCO2e: number; // With radiative forcing
  treesNeeded: number;
  comparison: string;
} {
  // DEFRA 2024 emission factors (kg CO2 per passenger km)
  let baseFactor: number;
  if (distanceKm < 1500) {
    baseFactor = 0.255; // Short-haul domestic
  } else if (distanceKm < 3700) {
    baseFactor = 0.156; // Medium-haul
  } else {
    baseFactor = 0.150; // Long-haul
  }

  // Cabin class multipliers (based on seat space allocation)
  const classMultipliers = {
    economy: 1.0,
    premium_economy: 1.6,
    business: 2.9,
    first: 4.0
  };

  const kgCO2 = distanceKm * baseFactor * classMultipliers[cabinClass];

  // Radiative forcing multiplier (non-CO2 effects at altitude)
  const radiativeForcingMultiplier = 1.9;
  const kgCO2e = kgCO2 * radiativeForcingMultiplier;

  // Average tree absorbs ~21 kg CO2 per year
  const treesNeeded = Math.ceil(kgCO2e / 21);

  // Generate comparison
  let comparison: string;
  if (kgCO2e < 100) {
    comparison = `Equivalent to driving ${Math.round(kgCO2e / 0.21)} km by car`;
  } else if (kgCO2e < 500) {
    comparison = `Equivalent to ${Math.round(kgCO2e / 50)} weeks of average household electricity`;
  } else {
    comparison = `Equivalent to ${(kgCO2e / 1000).toFixed(1)} months of average person's carbon footprint`;
  }

  return {
    kgCO2: Math.round(kgCO2),
    kgCO2e: Math.round(kgCO2e),
    treesNeeded,
    comparison
  };
}

/**
 * Get timezone information using built-in JavaScript Intl API
 */
export function getTimezoneInfo(timezone: string): {
  currentTime: string;
  utcOffset: string;
} | null {
  try {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Get UTC offset
    const offsetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    });
    const parts = offsetFormatter.formatToParts(now);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');

    return {
      currentTime: formatter.format(now),
      utcOffset: offsetPart?.value || 'UTC'
    };
  } catch {
    return null;
  }
}

/**
 * Calculate time difference between two timezones
 */
export function calculateTimeDifference(
  tz1: string,
  tz2: string
): { hours: number; display: string } | null {
  try {
    const now = new Date();
    const d1 = new Date(now.toLocaleString('en-US', { timeZone: tz1 }));
    const d2 = new Date(now.toLocaleString('en-US', { timeZone: tz2 }));
    const diffMs = d2.getTime() - d1.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const sign = diffHours >= 0 ? '+' : '';
    return {
      hours: diffHours,
      display: `${sign}${diffHours}h`
    };
  } catch {
    return null;
  }
}

/**
 * Calculate initial bearing (direction) from point 1 to point 2
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { degrees: number; cardinal: string; description: string } {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const degrees = ((θ * 180 / Math.PI) + 360) % 360;

  // Convert to cardinal direction
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  const cardinal = cardinals[index];

  // Human-readable description
  const descriptions: Record<string, string> = {
    'N': 'North',
    'NNE': 'North-Northeast',
    'NE': 'Northeast',
    'ENE': 'East-Northeast',
    'E': 'East',
    'ESE': 'East-Southeast',
    'SE': 'Southeast',
    'SSE': 'South-Southeast',
    'S': 'South',
    'SSW': 'South-Southwest',
    'SW': 'Southwest',
    'WSW': 'West-Southwest',
    'W': 'West',
    'WNW': 'West-Northwest',
    'NW': 'Northwest',
    'NNW': 'North-Northwest'
  };

  return {
    degrees: Math.round(degrees),
    cardinal,
    description: descriptions[cardinal]
  };
}

/**
 * Classify route by distance
 */
export function classifyRoute(distanceKm: number): {
  type: 'short-haul' | 'medium-haul' | 'long-haul' | 'ultra-long-haul';
  description: string;
  typicalAircraft: string[];
} {
  if (distanceKm < 1500) {
    return {
      type: 'short-haul',
      description: 'Short-haul flight (under 1,500 km)',
      typicalAircraft: ['Airbus A320', 'Boeing 737', 'Embraer E190']
    };
  } else if (distanceKm < 4000) {
    return {
      type: 'medium-haul',
      description: 'Medium-haul flight (1,500 - 4,000 km)',
      typicalAircraft: ['Airbus A321', 'Boeing 737 MAX', 'Airbus A320neo']
    };
  } else if (distanceKm < 12000) {
    return {
      type: 'long-haul',
      description: 'Long-haul flight (4,000 - 12,000 km)',
      typicalAircraft: ['Boeing 777', 'Airbus A350', 'Boeing 787 Dreamliner']
    };
  } else {
    return {
      type: 'ultra-long-haul',
      description: 'Ultra-long-haul flight (over 12,000 km)',
      typicalAircraft: ['Airbus A350-900ULR', 'Boeing 777-200LR', 'Airbus A380']
    };
  }
}

/**
 * Calculate CO2 emissions for all cabin classes
 */
export function calculateCO2AllClasses(distanceKm: number): {
  economy: { kgCO2: number; kgCO2e: number };
  premiumEconomy: { kgCO2: number; kgCO2e: number };
  business: { kgCO2: number; kgCO2e: number };
  first: { kgCO2: number; kgCO2e: number };
  treesNeeded: number;
  comparison: string;
} {
  const economy = calculateCO2(distanceKm, 'economy');
  const premiumEconomy = calculateCO2(distanceKm, 'premium_economy');
  const business = calculateCO2(distanceKm, 'business');
  const first = calculateCO2(distanceKm, 'first');

  return {
    economy: { kgCO2: economy.kgCO2, kgCO2e: economy.kgCO2e },
    premiumEconomy: { kgCO2: premiumEconomy.kgCO2, kgCO2e: premiumEconomy.kgCO2e },
    business: { kgCO2: business.kgCO2, kgCO2e: business.kgCO2e },
    first: { kgCO2: first.kgCO2, kgCO2e: first.kgCO2e },
    treesNeeded: economy.treesNeeded,
    comparison: economy.comparison
  };
}

/**
 * Format coordinates as DMS (degrees, minutes, seconds)
 */
export function formatCoordinatesDMS(lat: number, lng: number): {
  latitude: string;
  longitude: string;
} {
  const formatDMS = (decimal: number, isLat: boolean): string => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(1);

    const direction = isLat
      ? (decimal >= 0 ? 'N' : 'S')
      : (decimal >= 0 ? 'E' : 'W');

    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  return {
    latitude: formatDMS(lat, true),
    longitude: formatDMS(lng, false)
  };
}

/**
 * Calculate the midpoint between two coordinates on Earth
 */
export function calculateMidpoint(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): { lat: number; lng: number } {
  const toRad = (deg: number) => deg * Math.PI / 180;
  const toDeg = (rad: number) => rad * 180 / Math.PI;

  const φ1 = toRad(lat1);
  const λ1 = toRad(lng1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lng2);

  const Bx = Math.cos(φ2) * Math.cos(λ2 - λ1);
  const By = Math.cos(φ2) * Math.sin(λ2 - λ1);

  const φ3 = Math.atan2(
    Math.sin(φ1) + Math.sin(φ2),
    Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By)
  );
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return {
    lat: toDeg(φ3),
    lng: toDeg(λ3)
  };
}

/**
 * Estimate driving time based on distance
 */
export function calculateDrivingTime(distanceKm: number): {
  hours: number;
  days: number;
  display: string;
  practical: boolean;
} {
  // Average driving speed considering highways and breaks
  const avgSpeedKmh = 80;
  const hoursPerDay = 8; // Max practical driving per day

  const totalHours = distanceKm / avgSpeedKmh;
  const days = totalHours / hoursPerDay;

  let display: string;
  if (totalHours < 1) {
    display = `${Math.round(totalHours * 60)} minutes`;
  } else if (totalHours < 24) {
    display = `${Math.round(totalHours)} hours`;
  } else {
    display = `${Math.round(days)} days (${Math.round(totalHours)} hours)`;
  }

  return {
    hours: Math.round(totalHours),
    days: Math.round(days * 10) / 10,
    display,
    practical: distanceKm < 3000 // Only practical if under 3000km
  };
}

/**
 * Calculate typical cruising altitude based on distance
 */
export function calculateCruisingAltitude(distanceKm: number): {
  feet: number;
  meters: number;
  flightLevel: string;
} {
  let feet: number;

  if (distanceKm < 500) {
    feet = 25000;
  } else if (distanceKm < 1500) {
    feet = 33000;
  } else if (distanceKm < 4000) {
    feet = 37000;
  } else if (distanceKm < 8000) {
    feet = 39000;
  } else {
    feet = 41000;
  }

  return {
    feet,
    meters: Math.round(feet * 0.3048),
    flightLevel: `FL${Math.round(feet / 100)}`
  };
}

/**
 * Get jet lag information based on time zone difference
 */
export function getJetLagInfo(timeDiffHours: number): {
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  recoveryDays: number;
  tips: string[];
  direction: 'east' | 'west' | 'none';
} {
  const absHours = Math.abs(timeDiffHours);
  const direction = timeDiffHours > 0 ? 'east' : timeDiffHours < 0 ? 'west' : 'none';

  let severity: 'none' | 'mild' | 'moderate' | 'severe';
  let recoveryDays: number;
  const tips: string[] = [];

  if (absHours <= 2) {
    severity = 'none';
    recoveryDays = 0;
    tips.push('Minimal time difference - jet lag unlikely');
  } else if (absHours <= 5) {
    severity = 'mild';
    recoveryDays = Math.ceil(absHours / 2);
    tips.push('Adjust sleep schedule 1-2 hours before departure');
    tips.push('Stay hydrated during the flight');
    tips.push('Get sunlight exposure at destination');
  } else if (absHours <= 9) {
    severity = 'moderate';
    recoveryDays = Math.ceil(absHours * 0.7);
    tips.push('Start adjusting sleep schedule several days before travel');
    tips.push('Avoid alcohol and caffeine during the flight');
    tips.push('Take short naps (20-30 min) if needed');
    if (direction === 'east') {
      tips.push('Eastward travel is harder - try to get morning light');
    } else {
      tips.push('Westward travel: stay awake until local bedtime');
    }
  } else {
    severity = 'severe';
    recoveryDays = Math.ceil(absHours * 0.8);
    tips.push('Consider a stopover to break up the journey');
    tips.push('Use melatonin supplements (consult doctor first)');
    tips.push('Plan light activities for first few days');
    tips.push('Expose yourself to daylight at appropriate times');
    tips.push('Avoid important meetings on arrival day');
  }

  return { severity, recoveryDays, tips, direction };
}

/**
 * Get seat recommendation based on flight direction and time
 */
export function getSeatRecommendation(bearing: number, flightTimeMinutes: number): {
  windowView: 'left' | 'right';
  sunPosition: string;
  recommendation: string;
} {
  // Determine general direction
  const isNorthbound = bearing >= 315 || bearing < 45;
  const isSouthbound = bearing >= 135 && bearing < 225;
  const isEastbound = bearing >= 45 && bearing < 135;
  const isWestbound = bearing >= 225 && bearing < 315;

  let windowView: 'left' | 'right';
  let sunPosition: string;
  let recommendation: string;

  if (isEastbound) {
    windowView = 'left';
    sunPosition = 'Sun will be on the right (south) side during daytime';
    recommendation = 'Left window for views away from sun glare, right for warmth';
  } else if (isWestbound) {
    windowView = 'right';
    sunPosition = 'Sun will be on the left (south) side during daytime';
    recommendation = 'Right window for views away from sun glare, left for warmth';
  } else if (isNorthbound) {
    windowView = 'right';
    sunPosition = 'Sun will be on the right (east/south) side';
    recommendation = 'Either side offers good views on northbound flights';
  } else if (isSouthbound) {
    windowView = 'left';
    sunPosition = 'Sun will be on the left (east/north) side';
    recommendation = 'Either side offers good views on southbound flights';
  } else {
    windowView = 'left';
    sunPosition = 'Sun position varies';
    recommendation = 'Choose based on your preferred view';
  }

  // Add comfort note for long flights
  if (flightTimeMinutes > 360) {
    recommendation += '. For this long flight, consider an aisle seat for easier movement.';
  }

  return { windowView, sunPosition, recommendation };
}

/**
 * Get distance comparisons with famous landmarks/routes
 */
export function getDistanceComparisons(distanceKm: number): string[] {
  const comparisons: string[] = [];

  // Earth circumference
  const earthCircumference = 40075;
  const percentOfEarth = (distanceKm / earthCircumference) * 100;
  comparisons.push(`${percentOfEarth.toFixed(1)}% of Earth's circumference`);

  // Moon distance
  const moonDistance = 384400;
  if (distanceKm > 1000) {
    const timesToMoon = moonDistance / distanceKm;
    comparisons.push(`${Math.round(timesToMoon)} flights of this distance would reach the Moon`);
  }

  // Famous distances for comparison
  if (distanceKm < 500) {
    comparisons.push(`About the distance from London to Paris (344 km)`);
  } else if (distanceKm < 1000) {
    comparisons.push(`Similar to Berlin to Vienna (524 km)`);
  } else if (distanceKm < 2000) {
    comparisons.push(`Comparable to New York to Miami (1,756 km)`);
  } else if (distanceKm < 4000) {
    comparisons.push(`Similar to Los Angeles to New York (3,944 km)`);
  } else if (distanceKm < 8000) {
    comparisons.push(`Comparable to London to New York (5,567 km)`);
  } else if (distanceKm < 12000) {
    comparisons.push(`Similar to London to Tokyo (9,571 km)`);
  } else {
    comparisons.push(`Among the longest possible flight routes`);
  }

  // Speed of sound comparison
  const hoursAtSoundSpeed = distanceKm / 1235; // Speed of sound at sea level ~1235 km/h
  comparisons.push(`${hoursAtSoundSpeed.toFixed(1)} hours at the speed of sound`);

  return comparisons;
}

/**
 * Calculate fuel estimates for the flight
 */
export function estimateFuelConsumption(distanceKm: number): {
  litersTotal: number;
  litersPerPassenger: number;
  gallonsTotal: number;
  gallonsPerPassenger: number;
} {
  // Average fuel consumption for commercial aircraft
  // Based on ~3 liters per 100km per passenger for modern aircraft
  const litersPerPassengerPer100km = 3;
  const avgPassengers = 180; // Average passengers on a commercial flight

  const litersPerPassenger = Math.round((distanceKm / 100) * litersPerPassengerPer100km);
  const litersTotal = litersPerPassenger * avgPassengers;

  return {
    litersTotal: Math.round(litersTotal),
    litersPerPassenger,
    gallonsTotal: Math.round(litersTotal * 0.264172),
    gallonsPerPassenger: Math.round(litersPerPassenger * 0.264172)
  };
}

/**
 * Get hemisphere and geographic region info
 */
export function getGeographicContext(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number
): {
  crossesEquator: boolean;
  crossesDateLine: boolean;
  crossesPrimeMeridian: boolean;
  fromHemisphere: string;
  toHemisphere: string;
  routeDescription: string;
} {
  const fromHemisphere = `${fromLat >= 0 ? 'Northern' : 'Southern'} & ${fromLng >= 0 ? 'Eastern' : 'Western'}`;
  const toHemisphere = `${toLat >= 0 ? 'Northern' : 'Southern'} & ${toLng >= 0 ? 'Eastern' : 'Western'}`;

  const crossesEquator = (fromLat >= 0 && toLat < 0) || (fromLat < 0 && toLat >= 0);
  const crossesPrimeMeridian = (fromLng >= 0 && toLng < 0) || (fromLng < 0 && toLng >= 0);

  // Check if crosses date line (simplified check)
  const lngDiff = Math.abs(fromLng - toLng);
  const crossesDateLine = lngDiff > 180;

  let routeDescription = '';
  if (crossesEquator && crossesDateLine) {
    routeDescription = 'This route crosses both the Equator and the International Date Line';
  } else if (crossesEquator) {
    routeDescription = 'This route crosses the Equator';
  } else if (crossesDateLine) {
    routeDescription = 'This route crosses the International Date Line';
  } else if (crossesPrimeMeridian) {
    routeDescription = 'This route crosses the Prime Meridian (0° longitude)';
  } else {
    routeDescription = `Route stays within the ${fromLat >= 0 ? 'Northern' : 'Southern'} Hemisphere`;
  }

  return {
    crossesEquator,
    crossesDateLine,
    crossesPrimeMeridian,
    fromHemisphere,
    toHemisphere,
    routeDescription
  };
}
