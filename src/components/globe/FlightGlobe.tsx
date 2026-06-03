'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface FlightGlobeProps {
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
  fromName?: string;
  toName?: string;
  height?: number;
  distanceMiles?: number;
  flightTime?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobeInstance = any;

// Interpolate position along great circle arc
function interpolateGreatCircle(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  fraction: number
): { lat: number; lng: number; altitude: number } {
  const toRad = (deg: number) => deg * Math.PI / 180;
  const toDeg = (rad: number) => rad * 180 / Math.PI;

  const φ1 = toRad(lat1);
  const λ1 = toRad(lng1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lng2);

  // Angular distance
  const d = Math.acos(
    Math.sin(φ1) * Math.sin(φ2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1)
  );

  if (d === 0) {
    return { lat: lat1, lng: lng1, altitude: 0 };
  }

  const A = Math.sin((1 - fraction) * d) / Math.sin(d);
  const B = Math.sin(fraction * d) / Math.sin(d);

  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);

  const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
  const lng = toDeg(Math.atan2(y, x));

  // Calculate altitude for arc effect (peaks at middle of journey)
  const arcHeight = 0.06;
  const altitude = Math.sin(fraction * Math.PI) * arcHeight;

  return { lat, lng, altitude };
}

// Calculate bearing between two points
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => deg * Math.PI / 180;
  const toDeg = (rad: number) => rad * 180 / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Easing function for smooth animation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function FlightGlobe({
  fromLat,
  fromLng,
  toLat,
  toLng,
  fromName,
  toName,
  height = 400,
  distanceMiles,
  flightTime
}: FlightGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planeData, setPlaneData] = useState<Array<{ lat: number; lng: number; altitude: number; bearing: number }>>([]);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'starting' | 'flying' | 'landed'>('idle');

  // Animation durations
  const ZOOM_IN_DURATION = 1500;
  const FLIGHT_DURATION = 5000;
  const PAUSE_DURATION = 2000;

  const startAnimation = useCallback(() => {
    if (fromLat === undefined || fromLng === undefined || toLat === undefined || toLng === undefined) return;
    if (!globeRef.current) return;

    // Phase 1: Zoom into origin
    setAnimationPhase('starting');
    globeRef.current.pointOfView({ lat: fromLat, lng: fromLng, altitude: 0.8 }, ZOOM_IN_DURATION);

    // Phase 2: Start flying after zoom completes
    setTimeout(() => {
      setAnimationPhase('flying');
      const startTime = Date.now();

      const animate = () => {
        if (!globeRef.current) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / FLIGHT_DURATION, 1);
        const eased = easeInOutCubic(progress);

        // Get plane position along route
        const pos = interpolateGreatCircle(fromLat, fromLng, toLat, toLng, eased);

        // Calculate bearing for plane rotation
        const nextFraction = Math.min(eased + 0.02, 1);
        const nextPos = interpolateGreatCircle(fromLat, fromLng, toLat, toLng, nextFraction);
        const bearing = calculateBearing(pos.lat, pos.lng, nextPos.lat, nextPos.lng);

        setPlaneData([{ ...pos, bearing }]);

        // Camera follows the plane - zoomed in view
        // Altitude varies: starts low, goes higher mid-flight, comes back low
        const cameraAltitude = 0.8 + Math.sin(progress * Math.PI) * 0.4;

        // Camera slightly behind and above the plane position
        globeRef.current.pointOfView(
          { lat: pos.lat, lng: pos.lng, altitude: cameraAltitude },
          0 // Instant update for smooth following
        );

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Landing phase - zoom in on destination
          setAnimationPhase('landed');
          globeRef.current.pointOfView({ lat: toLat, lng: toLng, altitude: 0.8 }, 800);

          // Restart animation after pause
          setTimeout(() => {
            if (animationRef.current !== null) {
              setPlaneData([]);
              startAnimation();
            }
          }, PAUSE_DURATION);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, ZOOM_IN_DURATION);
  }, [fromLat, fromLng, toLat, toLng]);

  useEffect(() => {
    const loadGlobe = async () => {
      try {
        const GlobeModule = await import('globe.gl');
        const Globe = GlobeModule.default;

        if (!containerRef.current) return;

        containerRef.current.innerHTML = '';

        const globe = new Globe(containerRef.current)
          .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
          .showAtmosphere(true)
          .atmosphereColor('#3a8ee6')
          .atmosphereAltitude(0.25)
          .width(containerRef.current.clientWidth)
          .height(height);

        const controls = globe.controls();
        controls.autoRotate = false;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.minDistance = 120;
        controls.maxDistance = 500;

        globeRef.current = globe;
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load globe:', err);
        setError('Failed to load 3D globe');
      }
    };

    loadGlobe();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      globeRef.current = null;
    };
  }, [height]);

  // Setup route visualization and start animation
  useEffect(() => {
    if (!globeRef.current || !isLoaded) return;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (fromLat === undefined || fromLng === undefined || toLat === undefined || toLng === undefined) {
      globeRef.current.arcsData([]);
      globeRef.current.pointsData([]);
      globeRef.current.htmlElementsData([]);
      globeRef.current.ringsData([]);
      setPlaneData([]);
      setAnimationPhase('idle');
      return;
    }

    // Add flight arc (the route path)
    globeRef.current
      .arcsData([{
        startLat: fromLat,
        startLng: fromLng,
        endLat: toLat,
        endLng: toLng,
        color: ['rgba(59, 130, 246, 0.9)', 'rgba(139, 92, 246, 0.9)']
      }])
      .arcColor('color')
      .arcAltitudeAutoScale(0.4)
      .arcStroke(2)
      .arcDashLength(0.5)
      .arcDashGap(0.1)
      .arcDashAnimateTime(1500);

    // Add airport markers
    globeRef.current
      .pointsData([
        { lat: fromLat, lng: fromLng, name: fromName || 'Origin', size: 0.6, color: '#22c55e' },
        { lat: toLat, lng: toLng, name: toName || 'Destination', size: 0.6, color: '#ef4444' }
      ])
      .pointLat('lat')
      .pointLng('lng')
      .pointColor('color')
      .pointAltitude(0.01)
      .pointRadius('size');

    // Add pulsing rings at airports
    globeRef.current
      .ringsData([
        { lat: fromLat, lng: fromLng, maxR: 3, propagationSpeed: 2, repeatPeriod: 1000, color: 'rgba(34, 197, 94, 0.6)' },
        { lat: toLat, lng: toLng, maxR: 3, propagationSpeed: 2, repeatPeriod: 1000, color: 'rgba(239, 68, 68, 0.6)' }
      ])
      .ringLat('lat')
      .ringLng('lng')
      .ringMaxRadius('maxR')
      .ringPropagationSpeed('propagationSpeed')
      .ringRepeatPeriod('repeatPeriod')
      .ringColor('color');

    // Start the animation sequence
    animationRef.current = 1; // Mark as active
    startAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [fromLat, fromLng, toLat, toLng, fromName, toName, isLoaded, startAnimation]);

  // Update plane HTML element on globe
  useEffect(() => {
    if (!globeRef.current) return;

    if (planeData.length === 0) {
      globeRef.current.htmlElementsData([]);
      return;
    }

    globeRef.current
      .htmlElementsData(planeData)
      .htmlLat((d: { lat: number }) => d.lat)
      .htmlLng((d: { lng: number }) => d.lng)
      .htmlAltitude((d: { altitude: number }) => d.altitude + 0.01)
      .htmlElement((d: { bearing: number }) => {
        const el = document.createElement('div');
        el.innerHTML = `
          <div style="
            transform: rotate(${d.bearing + 90}deg);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
          ">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white" style="filter: drop-shadow(0 0 12px rgba(59, 130, 246, 1));">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
        `;
        el.style.pointerEvents = 'none';
        return el;
      });
  }, [planeData]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (globeRef.current && containerRef.current) {
        globeRef.current.width(containerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div
        className="relative w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  const hasRoute = fromLat !== undefined && toLat !== undefined;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden bg-slate-900"
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading globe...</p>
          </div>
        </div>
      )}

      {/* Flight info overlay — air miles as the focal number */}
      {hasRoute && isLoaded && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-center">
          <div className="bg-black/80 backdrop-blur-md rounded-xl px-5 py-3 flex items-center gap-5 sm:gap-7 border border-white/10 shadow-xl">
            {distanceMiles !== undefined && (
              <div className="flex items-end gap-2">
                <div className="font-mono tabular-nums leading-none">
                  <span className="text-white font-bold text-[34px] sm:text-[42px]">
                    {distanceMiles.toLocaleString()}
                  </span>
                </div>
                <div className="text-blue-300 text-[10.5px] uppercase tracking-[0.16em] font-semibold pb-1">
                  air<br />miles
                </div>
              </div>
            )}
            {flightTime && (
              <div className="hidden sm:flex items-baseline gap-2 pl-5 sm:pl-6 border-l border-white/15">
                <div className="text-white font-semibold tabular-nums text-[20px]">{flightTime}</div>
                <div className="text-slate-400 text-[10px] uppercase tracking-[0.12em] font-semibold">flight</div>
              </div>
            )}
            <div className="flex items-center gap-2 pl-3 sm:pl-4 border-l border-white/15">
              <div className={`w-2 h-2 rounded-full ${animationPhase === 'flying' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
              <span className="text-slate-300 text-[11px] uppercase tracking-[0.12em] font-mono">
                {animationPhase === 'starting' && 'Departing'}
                {animationPhase === 'flying' && 'In flight'}
                {animationPhase === 'landed' && 'Arrived'}
                {animationPhase === 'idle' && 'Ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Route labels */}
      {hasRoute && isLoaded && (
        <>
          <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <div className="text-white text-xs font-bold">FROM</div>
                <div className="text-white text-sm font-medium">{fromName || 'Origin'}</div>
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <div className="text-white text-xs font-bold">TO</div>
                <div className="text-white text-sm font-medium">{toName || 'Destination'}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
