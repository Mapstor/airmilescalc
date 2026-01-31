'use client';

import dynamic from 'next/dynamic';

const FlightGlobe = dynamic(() => import('./FlightGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading globe...</p>
      </div>
    </div>
  )
});

interface GlobeWrapperProps {
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

export default function GlobeWrapper(props: GlobeWrapperProps) {
  const { height = 400, ...rest } = props;
  return (
    <div style={{ height }}>
      <FlightGlobe {...rest} height={height} />
    </div>
  );
}
